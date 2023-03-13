import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

export type checkNftRes = {
  mint: string;
  royaltiesPaid: boolean;
  royaltiesToPay: number;
  royaltiesPaidAmount: number;
  status: string;
};

export const getNfts = async (owner: PublicKey) => {
  const nfts = [];

  try {
    const url = `${
      import.meta.env.VITE_HELIUS_RPC_PROXY
    }/v0/addresses/${owner.toBase58()}/nfts?pageNumber=1`;

    const { data } = await axios.get(url);
    nfts.push(...data.nfts);

    for (let index = 2; index < data.numberOfPages + 1; index++) {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_HELIUS_RPC_PROXY
        }/v0/addresses/${owner.toBase58()}/nfts?pageNumber=${index}`
      );
      nfts.push(...data.nfts);
    }

    return nfts;
  } catch (error) {
    throw error;
  }
};

export const checkNfts = async (mintList: string[]) => {
  try {
    const res: checkNftRes[] = await (
      await fetch(
        'https://renaissance-api.builderzlabs.workers.dev/api/check-nfts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mints: mintList,
          }),
        }
      )
    ).json();

    return res;
  } catch (error) {
    throw error;
  }
};

export const getCheckedNftsForCollection = async (
  owner: PublicKey,
  allowedCollections?: string[]
) => {
  let nfts = [];

  try {
    nfts = await getNfts(owner);

    if (allowedCollections) {
      nfts = nfts.filter(nft =>
        allowedCollections.includes(nft.collectionAddress)
      );
    }

    const checkedNfts = await checkNfts(nfts.map(nft => nft.tokenAddress));

    const combinedArray = nfts.map((nft: any) => {
      const matchingResult = checkedNfts.find(
        (result: checkNftRes) => result.mint === nft.tokenAddress
      );
      return { ...nft, ...matchingResult };
    });

    return combinedArray;
  } catch (error) {
    throw error;
  }
};
