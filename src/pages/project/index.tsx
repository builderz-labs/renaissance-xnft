import { useLoaderData, defer, useParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Loading } from "../../components/Loading";
import { Collection } from "../../data/types";
import { NftListRedemption } from "../../components/project/NftListRedemption";
import styled from "styled-components";
import { Tooltip } from "@mui/material";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getCheckedNftsForCollection } from "../../utils/nfts";
import { useWallet } from "../../hooks/useWallet";
import { SmallLoading } from "../../components/SmallLoading";
import { repayRoyalties } from "../../utils/repayRoyalties";
import { useConnection } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { NftStats } from "../../components/nfts/NftStats";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border-radius: 12px;
  border: 0.5px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 138, 87, 0.1) 100%
  );
`;

export const loader = (queryClient: QueryClient, { params }: any) => {
  if (!params.id) {
    throw new Response("Bad Request", { status: 400 });
  }
  return defer({
    collections: queryClient.fetchQuery({
      queryKey: ["collections"],
      queryFn: () =>
        fetch("/src/data/collections.json").then((res) => res.json()),
      staleTime: 1000 * 60 * 2,
    }),
  });
};

export const ProjectPage = () => {
  const data = useLoaderData() as any;

  return (
    <div className="mt-5 h-full relative">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-20" />
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProjectDetails />
          <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
        </Await>
      </Suspense>
    </div>
  );
};

export const ProjectDetails = () => {
  const { id } = useParams();

  const wallet = useWallet();
  const { connection } = useConnection()

  // Get Collection
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collections"],
  });
  const [pageCollection, setPageCollection] = useState<Collection>();

  useEffect(() => {
    if (collections) {
      const collection = collections.find((c: Collection) => c.name === id);
      setPageCollection(collection);
    }
  }, [collections, id]);

  const { data: checkedNfts, isLoading, refetch } = useQuery<any[]>({
    queryKey: [
      "checkedNfts",
      [pageCollection?.collectionAddress],
      wallet.publicKey,
    ],
    queryFn: () =>
      getCheckedNftsForCollection(
        /*       wallet.publicKey || */
        new PublicKey("63Kaxzs8BxXh7sPZHDnAy9HwvkeLwJ3mF33EcXKSjpT9"),
        [pageCollection?.collectionAddress!]
      ),
    enabled: !!pageCollection && !!wallet.publicKey,
  });

  // States
  const [loading, setLoading] = useState(false);
  const [outstandingRoyalties, setOutstandingRoyalties] = useState(0);
  const [nftsPaid, setNftsPaid] = useState(0);
  const [royaltiesPaid, setRoyaltiesPaid] = useState(0);

  useEffect(() => {
    if (checkedNfts) {
      const outstandingRoyalties = checkedNfts.reduce(
        (acc: number, nft: any) => acc + nft.royaltiesToPay,
        0
      );

      const nftsPaid = checkedNfts.filter(
        (nft: any) => nft.royaltiesPaid
      ).length;

      const royaltiesPaid = checkedNfts.reduce(
        (acc: number, nft: any) => acc + nft.royaltiesPaidAmount,
        0
      );

      setOutstandingRoyalties(outstandingRoyalties);
      setNftsPaid(nftsPaid);
      setRoyaltiesPaid(royaltiesPaid);
    }
  }, [checkedNfts]);

  // Repay Royalties
  const handleRepay = async () => {
    setLoading(true);

    let itemsToRepay = checkedNfts!.filter((nft) => nft.royaltiesToPay > 0);

    try {
      const res = await repayRoyalties(itemsToRepay, connection, wallet);
      if (res) {
        await refetch();
        toast.success("Royalties Repaid");
      } else {
        toast.error("Error Repaying Royalties");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-5 h-full relative mb-40">
        {pageCollection ? (
          <>
            {/* Collection Information */}
            <ItemCard className="w-full relative flex flex-row items-start justify-start my-2">
                <div className="w-1/2 h-full object-cover ">
                  <img
                    src={pageCollection.image}
                    alt={id}
                    className="rounded-lg object-cover h-full w-full p-4"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-4 justify-start items-start text-start flex-grow pl-4 py-4 pr-4 h-full">
                  <p className="w-full  font-black truncate text-4xl">
                    {pageCollection.name}
                  </p>
                  <p className="text-sm w-36 truncate flex-wrap ">
                    {pageCollection.description}
                  </p>
                  <div className="border-b border-b-gray-500 w-full"></div>
                  <div className="w-full flex flex-row justify-start gap-4 items-center">
                    <a href="">
                      <TwitterIcon />
                    </a>
                    <a href="">
                      <HeadsetMicIcon />
                    </a>
                    <a href="">
                      <LanguageIcon />
                    </a>
                  </div>
                </div>
              </ItemCard>
            {/* NFT Stats */}
            <NftStats pageCollection={pageCollection} />
            {/* NFT List */}
            <section className="my-4 text-start px-2 text-2xl font-bold flex flex-col gap-4 mt-10 relative">
              <h1>Your {id} NFTs</h1>
              <NftListRedemption
                collectionAddress={[pageCollection.collectionAddress]}
              />
            </section>
          </>
        ) : (
          <div>Collection not found</div>
        )}
      </div>
    </div>
  );
};
