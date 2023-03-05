import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "./useWallet";

async function fetchBalance(
  token: string,
  connection: Connection,
  publicKey: PublicKey
) {
  try {
    const parsedTokenAccountsByOwner =
      await connection.getParsedTokenAccountsByOwner(publicKey, {
        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        mint: new PublicKey(token),
      });
    if (token === "SOL") {
      const unwrapped: number =
        (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
      const unwrappedAvailable: number =
        Math.floor(Math.max(0, unwrapped - 0.01) * 10 ** 9) / 10 ** 9;
      const unwrappedAvailableRounded: number =
        Math.floor(unwrappedAvailable * 10 ** 9) / 10 ** 9;
      return unwrappedAvailableRounded;
    }
    const { decimals } =
      parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount;
    if (parsedTokenAccountsByOwner.value.length) {
      const balance: number =
        1.0 *
        parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount
          .uiAmount;
      const balanceRounded: number =
        Math.floor(balance * 10 ** decimals) / 10 ** decimals;
      return balanceRounded;
    }
    // no tokens in wallet
    return 0;
  } catch (err) {
    console.log(err);
  }
}

export default function useTokenBalance(token?: string) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    if (token && publicKey) {
      fetchBalance(token, connection, publicKey).then((data) => {
        setBalance(data);
      });
    }
  }, [token, publicKey, connection]);

  return balance;
}
