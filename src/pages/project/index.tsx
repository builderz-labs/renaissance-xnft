import { defer, useParams } from "react-router-dom";
import { getNfts } from "../../utils/nfts";
import { useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { QueryClient } from "@tanstack/react-query";
import { allCollections } from '../../data/allCollections';

import { Loading } from "../../components/Loading";
import { NftList } from "../../components/nfts/NftList";
import styled from 'styled-components';

const ItemCard = styled.div`
background: linear-gradient(206.07deg, #050505 30.45%, #101C26 99.29%);
border-radius: 12px;

border: 0.5px solid;

border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 138, 87, 0.1) 100%);
`

export const loader = (queryClient: QueryClient, { params }: any) => {
    return defer({
        nfts: queryClient.fetchQuery({
            queryKey: ["nfts"],
            queryFn: () =>
                getNfts(window.xnft.solana.publicKey || new PublicKey("PeRXuY1P4cnzDZEPH1ancRVSyQMDpnTF27BwmQ1kkWq"))
        })
    });
}

function ProjectPage() {

    const { nfts } = useLoaderData() as any;

    const { id } = useParams();

    // check allCollections for id and return image



    const [projects, setProjects] = useState<any[]>([]);
    const [collection, setCollection] = useState<any[]>([]);

    useEffect(() => {
        nfts.then((data: any[]) => {
            setProjects([...data]);

        });
        nfts.then((data: any[]) => {
            const myCollection = allCollections.find((collection) => collection.name === id);
            setCollection([myCollection]);
        });
    }, [nfts]);

    console.log(nfts)
    console.log('collection', collection)

    const filteredCollection = projects.filter((project: any) => project.collection === id);

    return (
        <div>
            <div className='mt-5'>
                <Suspense fallback={<Loading />}>
                    <>
                        {collection && collection.length > 0 ?
                            <>
                                <div className="w-full flex items-center justify-center mb-5 rounded-lg shadow-lg">
                                    {collection && collection.length > 0 &&
                                        <div className="w-full flex items-center justify-center my-5 rounded-lg shadow-lg">
                                            <img src={collection[0].image} alt={id} className='w-full rounded-lg object-cover max-h-40' />
                                        </div>
                                    }
                                </div>
                                <section className='my-4 text-start px-2 text-2xl font-bold'>
                                    <h1>Your {id} NFTs</h1>
                                </section>
                                <Await resolve={projects}>
                                    {() => (
                                        <div className='w-full grid grid-cols-2 gap-2 my-10 mb-40 '>
                                            {filteredCollection && filteredCollection.length > 0 ? filteredCollection.map((project: any) => (

                                                <>
                                                    <ItemCard key={project.id} className=' rounded-lg'>
                                                        <div className='w-70 h-70 object-cover rounded-lg'>
                                                            <img src={project.imageUrl} width={150} height={150} alt={project.name} className="p-2 w-full h-40 object-cover rounded-lg" />
                                                        </div>
                                                        <p className="font-bold my-2 px-2 w-full text-center truncate hover:text-[#FF8A57]">{project.name}</p>
                                                    </ItemCard>
                                                </>
                                            )) : <div className='flex flex-col gap-4 px-4 w-full'>
                                                <p className='text-center'>No NFTs in this collection</p>
                                            </div>}
                                        </div>
                                    )}
                                </Await>
                            </> : <div className='flex flex-col gap-4'>
                                <Loading />
                                <p>Fetching and Filtering Collection ...</p>
                            </div>}
                    </>
                </Suspense>
            </div>
        </div>
    );
}

export default ProjectPage;
