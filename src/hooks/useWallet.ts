import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

type CustomWalletContext = WalletContextState & {
  publicKey: PublicKey;
};

export function useWallet() {
  const wallet = useMemo<CustomWalletContext>(() => {
    return window.xnft.solana;
  }, []);
  return wallet;
}
