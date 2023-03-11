import { useParams } from 'react-router-dom';

import { defer } from "react-router-dom";
import { getNfts } from "../../utils/nfts";
import { useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { Await } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { QueryClient } from "@tanstack/react-query";

import { Loading } from "../../components/Loading";
import { NftList } from "../../components/nfts/NftList";

export const loader = (queryClient: QueryClient) => {
    return defer({
        nfts: queryClient.fetchQuery({
            queryKey: ["nfts"],
            queryFn: () =>
                getNfts((window.xnft.solana.publicKey)) // Hard coded if in localhost
        })
    });
}

function ProjectPage() {

    const { nfts } = useLoaderData() as any;

    const { id } = useParams();
    const routerName = "project";

    const collectionName = id;

    const filteredNfts = nfts.filter((nft: any) => nft.collectionName === collectionName);

    return (
        <div className="h-full mb-40">

            <Suspense fallback={<Loading />}>
                <Await resolve={filteredNfts} >
                    <section className='my-5'>
                        <h1 className='text-4xl font-bold mb-10'>Your {id} NFTs</h1>
                        <NftList />
                    </section>
                </Await>
            </Suspense>
        </div>
    );
}

export default ProjectPage;