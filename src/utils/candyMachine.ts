import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey, Connection } from "@solana/web3.js";

export const getCandyMachine = async (cmAddress: string) => {
  const connection = new Connection(import.meta.env.VITE_HELIUS_RPC_PROXY);
  const metaplex = new Metaplex(connection);

  const cm = await metaplex
    .candyMachines()
    .findByAddress({ address: new PublicKey(cmAddress) });

  return cm;
};
