import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { GSO, GSO_PK } from "@dual-finance/gso";
import { StakingOptions } from "@dual-finance/staking-options";
import { GSO_STATE_SIZE } from "../config";
import {
  getMultipleTokenAccounts,
  fetchTokenMetadata,
  parseGsoState,
  fetchMint,
  fetchProgramAccounts,
} from "../core";
import { GsoBalanceParams, SOState } from "../types";

export default function useGsoBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [gsoBalances, setGsoBalances] = useState<GsoBalanceParams[]>([]);

  useEffect(() => {
    fetchGsoBalance(connection, publicKey)
      .then((data) => {
        if (data) {
          setGsoBalances(data);
        }
      })
      .catch(console.error);
  }, [connection, publicKey]);

  return gsoBalances;
}

export async function fetchGsoBalance(
  connection: Connection,
  publicKey: PublicKey | null
) {
  if (!publicKey) {
    return;
  }
  try {
    // Fetch all program accounts for SO
    const data = await fetchProgramAccounts(connection, GSO_PK);
    const allBalanceParams = [];

    const gsoHelper = new GSO(connection.rpcEndpoint);
    const stakingOptions = new StakingOptions(connection.rpcEndpoint);

    const allTokenAccounts: string[] = [];
    const states = data.filter((item) => {
      return item.account.data.length === GSO_STATE_SIZE;
    });
    for (const acct of states) {
      const xBaseMint: PublicKey = await gsoHelper.xBaseMint(acct.pubkey);
      const tokenAddress = await getAssociatedTokenAddress(
        xBaseMint,
        publicKey
      );
      allTokenAccounts.push(tokenAddress.toBase58());
    }

    const tokenAccounts = await getMultipleTokenAccounts(
      connection,
      allTokenAccounts,
      "single"
    );
    for (let i = 0; i < tokenAccounts.array.length; ++i) {
      if (!tokenAccounts.array[i]) {
        continue;
      }
      const numTokens =
        tokenAccounts.array[i].data.parsed.info.tokenAmount.amount /
        10 **
          Number(tokenAccounts.array[i].data.parsed.info.tokenAmount.decimals);

      if (numTokens === 0) {
        continue;
      }

      const acct = states[i];
      const { soName, baseMint, lockupPeriodEnd, strike, stakingOptionsState } =
        parseGsoState(acct.account.data);
      const gsoName = `GSO${soName}`;
      const tokenJson = await fetchTokenMetadata(connection, baseMint);
      const baseAtoms = (await fetchMint(connection, baseMint)).decimals;
      let lotSize = 1_000_000; // canon lot size
      let quoteAtoms = 6; // default for USDC
      let soState;
      let strikeInUSD =
        (strike / (10 ** quoteAtoms * lotSize)) * 10 ** baseAtoms;
      try {
        soState = (await stakingOptions.getState(
          gsoName,
          baseMint
        )) as unknown as SOState;
      } catch (err) {
        console.error(err);
        const balanceParams: GsoBalanceParams = {
          soName,
          gsoName,
          numTokens,
          lotSize,
          baseAtoms,
          quoteAtoms,
          expiration: new Date(lockupPeriodEnd * 1_000).toLocaleDateString(),
          expirationInt: lockupPeriodEnd,
          strike: strikeInUSD,
          // Allow for SO State to be closed
          gsoStatePk: acct.pubkey,
          soStatePk: stakingOptionsState,
          base: baseMint,
          metadata: tokenJson,
        };
        allBalanceParams.push(balanceParams);
        continue;
      }
      lotSize = soState.lotSize;
      const { quoteMint, strikes } = soState;
      strikeInUSD =
        (strikes[0] / (10 ** quoteAtoms * lotSize)) * 10 ** baseAtoms;
      quoteAtoms = (await fetchMint(connection, quoteMint)).decimals;
      const optionMint = await stakingOptions.soMint(
        strikes[0],
        gsoName,
        baseMint
      );
      const optionJson = await fetchTokenMetadata(connection, optionMint);

      const balanceParams: GsoBalanceParams = {
        soName,
        gsoName,
        numTokens,
        lotSize,
        baseAtoms,
        expiration: new Date(lockupPeriodEnd * 1_000).toLocaleDateString(),
        expirationInt: lockupPeriodEnd,
        strike: strikeInUSD,
        gsoStatePk: acct.pubkey,
        soStatePk: stakingOptionsState,
        base: baseMint,
        metadata: tokenJson,
        optionMetadata: optionJson,
      };
      allBalanceParams.push(balanceParams);
    }
    return allBalanceParams;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchGsoBalanceDetails(
  connection: Connection,
  publicKey: PublicKey,
  name?: string
) {
  const balanceParams = await fetchGsoBalance(connection, publicKey);
  if (balanceParams) {
    return balanceParams.find((p) => p.soName === name);
  }
}
