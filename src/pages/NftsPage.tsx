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
      queryKey: ["nfts"],
      queryFn: () =>
        getNfts(window.xnft.solana.publicKey || new PublicKey("PeRXuY1P4cnzDZEPH1ancRVSyQMDpnTF27BwmQ1kkWq")) // Hard coded if in localhost
    })
  });
}

export const NftsPage = () => {

  const { nfts } = useLoaderData() as any;

  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={nfts} >
          <section className='my-5 mb-40'>

            <h1 className='text-4xl font-bold mb-10'>NFTs</h1>
            <NftList />
          </section>
        </Await>
      </Suspense>
    </div>
  )
}