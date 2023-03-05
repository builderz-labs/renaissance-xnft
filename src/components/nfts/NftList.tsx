import { useQuery } from "@tanstack/react-query";

import { NftItem } from "./NftItem";

export const NftList = () => {
  const { data: nfts } = useQuery<any[]>({
    queryKey: ["nfts"],
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {nfts?.map((nft: any) => {
        return <NftItem key={nft.tokenAddress} nft={nft} />;
      })}
    </div>
  )
}