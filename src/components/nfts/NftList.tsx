import { useQuery } from "@tanstack/react-query";

import { NftItem } from "./NftItem";

export const NftList = () => {
  const { data: nfts } = useQuery<any[]>({
    queryKey: ["nfts"],
  });

  if (nfts && nfts.length === 0) {
    return (
      <div>
        <h2>You don't own any NFTs</h2>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {nfts?.map((nft: any) => {
        return <NftItem key={nft.tokenAddress} nft={nft} />;
      })}
    </div>
  )
}