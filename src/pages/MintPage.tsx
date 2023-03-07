import { defer } from "react-router-dom";
import { getNfts } from "../utils/nfts";
import { useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { Await } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { QueryClient } from "@tanstack/react-query";

import { Loading } from "../components/Loading";
import { NftList } from "../components/nfts/NftList";

export const loader = (queryClient: QueryClient) => {
  return defer({
    nfts: queryClient.fetchQuery({
      queryKey: ["cm"],
      queryFn: () =>
        {}
    })
  });
}

export const MintPage = () => {

  const { cm } = useLoaderData() as any;

  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={cm} >
          <section className='my-5'>
            <h1 className='text-4xl font-bold mb-10'>Mint</h1>
          </section>
        </Await>
      </Suspense>
    </div>
  )
}