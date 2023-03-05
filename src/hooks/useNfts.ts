import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { getNfts } from "../utils/nfts";

export default function useNfts() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  console.log(publicKey);
  console.log(connection);

  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    getNfts(publicKey!)
      .then((data) => {
        if (data) {
          setNfts(data);
        }
      })
      .catch(console.error);
  }, [connection, publicKey]);

  return nfts;
}
