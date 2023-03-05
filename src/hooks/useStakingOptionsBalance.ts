import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  Address,
  AnchorProvider,
  BN,
  Idl,
  Program,
} from "@project-serum/anchor";
import {
  StakingOptions,
  STAKING_OPTIONS_PK,
} from "@dual-finance/staking-options";
import stakingOptionsIdl from "@dual-finance/staking-options/lib/staking_options_idl.json";
import { useWallet } from "./useWallet";
import { SoBalanceParams, SOState } from "../types";
import { STAKING_OPTIONS_STATE_SIZE } from "../config";
import {
  getMultipleTokenAccounts,
  fetchTokenMetadata,
  fetchProgramAccounts,
} from "../core";

export default function useStakingOptionsBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [soBalances, setSoBalances] = useState<SoBalanceParams[]>([]);

  useEffect(() => {
    fetchStakingOptionsBalance(connection, publicKey)
      .then((data) => {
        if (data) {
          setSoBalances(data);
        }
      })
      .catch(console.error);
  }, [connection, publicKey]);

  return soBalances;
}

export async function fetchStakingOptionsBalance(
  connection: Connection,
  publicKey: PublicKey | null
) {
  if (!publicKey) {
    return;
  }

  try {
    // Fetch all program accounts for SO.
    const data = await fetchProgramAccounts(connection, STAKING_OPTIONS_PK, {
      filters: [{ dataSize: STAKING_OPTIONS_STATE_SIZE }],
    });
    const allStakingOptionParams = [];

    const stateAddresses: Address[] = [];
    // Check all possible DIP.
    // eslint-disable-next-line no-restricted-syntax
    for (const programAccount of data) {
      if (programAccount.account.data.length !== STAKING_OPTIONS_STATE_SIZE) {
        continue;
      }
      stateAddresses.push(programAccount.pubkey.toBase58());
    }
    const provider = new AnchorProvider(connection, window.xnft.solana, {
      commitment: "confirmed",
    });
    const program = new Program(
      stakingOptionsIdl as Idl,
      STAKING_OPTIONS_PK,
      provider
    );
    const states = await program.account.state.fetchMultiple(stateAddresses);

    const stakingOptionsHelper = new StakingOptions(connection.rpcEndpoint);
    const tokenAccountAddresses: string[] = [];
    const soMints = [];
    // For each, check the option mint and look into the ATA
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < states.length; ++i) {
      const { strikes, soName, baseMint } = states[i] as SOState;
      // TODO: Do this for multiple strikes. Will be easier once switched to balance API.
      const soMint = await stakingOptionsHelper.soMint(
        strikes[0],
        soName,
        baseMint
      );
      soMints.push(soMint);
      const ataAddress = await getAssociatedTokenAddress(soMint, publicKey);
      tokenAccountAddresses.push(ataAddress.toBase58());
    }
    // TODO: Fetch all balances once in helius API and store it similar to pricing.
    const tokenAccounts = (
      await getMultipleTokenAccounts(
        connection,
        tokenAccountAddresses,
        "confirmed"
      )
    ).array;

    for (let i = 0; i < states.length; ++i) {
      if (!tokenAccounts[i]) {
        continue;
      }
      const {
        strikes,
        soName,
        baseMint,
        optionExpiration,
        quoteMint,
        lotSize,
        baseDecimals,
        quoteDecimals,
      } = states[i] as unknown as SOState;
      const numTokens = tokenAccountAmount(tokenAccounts[i]);

      if (
        optionExpiration < Math.floor(Date.now() / 1_000) ||
        numTokens === 0
      ) {
        continue;
      }

      const soMint = soMints[i];
      const [tokenJson, optionJson] = await Promise.all([
        fetchTokenMetadata(connection, baseMint),
        fetchTokenMetadata(connection, soMint),
      ]);
      const strikeInUSD =
        (strikes[0] / (10 ** quoteDecimals * lotSize)) * 10 ** baseDecimals;
      const soParams: SoBalanceParams = {
        soName,
        lotSize,
        numTokens,
        expiration: new Date(optionExpiration * 1_000).toLocaleDateString(),
        expirationInt: optionExpiration,
        strike: strikeInUSD,
        strikeAtomsPerLot: new BN(strikes[0]),
        soStatePk: new PublicKey(stateAddresses[i]),
        base: baseMint,
        quote: quoteMint,
        option: soMint,
        baseAtoms: baseDecimals,
        quoteAtoms: quoteDecimals,
        metadata: tokenJson,
        optionMetadata: optionJson,
      };
      allStakingOptionParams.push(soParams);
    }
    return allStakingOptionParams;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchStakingOptionBalanceDetails(
  connection: Connection,
  publicKey: PublicKey,
  name?: string
) {
  const balanceParams = await fetchStakingOptionsBalance(connection, publicKey);
  if (balanceParams) {
    return balanceParams.find((p) => p.soName === name);
  }
}

function tokenAccountAmount(tokenAccount: any): number {
  const { amount } = tokenAccount.data.parsed.info.tokenAmount;
  const { decimals } = tokenAccount.data.parsed.info.tokenAmount;
  return amount / 10 ** decimals;
}
