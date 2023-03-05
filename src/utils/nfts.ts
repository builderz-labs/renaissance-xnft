import { PublicKey } from "@solana/web3.js";
import axios from "axios";

export const getNfts = async (owner: PublicKey) => {
  const nfts = [];

  try {
    const url = `https://api.helius.xyz/v0/addresses/${owner}/nfts?api-key=${
      import.meta.env.VITE_HELIUS_API_KEY
    }&pageNumber=1`;

    const { data } = await axios.get(url);
    nfts.push(...data.nfts);

    for (let index = 2; index < data.numberOfPages + 1; index++) {
      const { data } = await axios.get(
        `https://api.helius.xyz/v0/addresses/${owner}/nfts?api-key=${
          import.meta.env.VITE_HELIUS_API_KEY
        }&pageNumber=${index}`
      );
      nfts.push(...data.nfts);
    }

    return nfts;
  } catch (error) {
    throw error;
  }
};
