import { defer, useParams } from "react-router-dom";
import { getNfts } from "../../utils/nfts";
import { useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { QueryClient } from "@tanstack/react-query";
import { allCollections } from '../../data/allCollections';
import { Pagination } from 'antd';

import { Loading } from "../../components/Loading";
import { NftList } from "../../components/nfts/NftList";
import styled from 'styled-components';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

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
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [myCollectionAddress, setMyCollectionAddress] = useState<any[]>([]);

    useEffect(() => {
        nfts.then((data: any[]) => {
            setProjects([...data]);

        });
        nfts.then((data: any[]) => {
            const myCollection = allCollections.find((collection) => collection.name === id);
            setCollection([myCollection]);
        });
        nfts.then((data: any[]) => {
            const myCollectionAddress = projects.filter((collection) => collection.name === id);
            setMyCollectionAddress([myCollectionAddress]);
        });
        nfts.then((data: any[]) => {
            const filteredProjects = projects.filter((nft: any) => nft.collectionAddress === myCollectionAddress);
            setFilteredProjects([...filteredProjects]);
        });
    }, [nfts]);

    console.log(nfts)
    console.log('projects', projects)
    console.log(filteredProjects)
    console.log('nfts', filteredProjects)
    console.log('collection', collection)

    const [filteredNfts, setFilteredNfts] = useState<any[]>([]);
    const [currentNfts, setCurrentNfts] = useState<any[]>(nfts.nfts);

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(12);

    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalToRepay, setTotalToRepay] = useState(0);

    const [loading, setLoading] = useState(false);

    const wallet = useWallet();
    const { connection } = useConnection()

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const [showUnpaidRoyaltiesOnly, setShowUnpaidRoyaltiesOnly] = useState(false);
    const [selectAllUnpaid, setSelectAllUnpaid] = useState(false);



    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

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
                                        <>
                                            <div className='w-full grid grid-cols-2 gap-2 my-10 mb-40 relative'>
                                                {filteredProjects && filteredProjects.length > 0 ? filteredProjects.map((project: any) => (

                                                    <>
                                                        <ItemCard key={project.id} className=' rounded-lg'>
                                                            <div className='w-70 h-70 object-cover rounded-lg'>
                                                                <img src={project.imageUrl} width={150} height={150} alt={project.name} className="p-2 w-full h-40 object-cover rounded-lg" />
                                                            </div>
                                                            <p className="font-bold my-2 px-2 w-full text-center truncate hover:text-[#FF8A57]">{project.name}</p>
                                                            <p className="font-bold my-2 px-2 w-full text-center truncate hover:text-[#FF8A57]">{project.status}</p>
                                                        </ItemCard>
                                                    </>
                                                )) : <div className='flex flex-col gap-4 px-4 w-full'>
                                                    <p className='text-center'>No NFTs in this collection</p>
                                                </div>}
                                            </div>

                                            <div className='w-full flex justify-center'>

                                                <Pagination current={currentPage} onChange={handlePageChange} pageSize={pageSize} total={filteredNfts.length} defaultCurrent={1}
                                                    defaultPageSize={pageSize} pageSizeOptions={[12, 24, 36, 48, 56]} showSizeChanger showQuickJumper responsive onShowSizeChange={(current, size) => setPageSize(size)}
                                                    className='text-black dark:text-white' />
                                            </div>

                                            <div className='my-5 md:my-20 flex flex-col md:flex-row  items-end md:items-center justify-end md:justify-center w-full gap-8'>
                                                <div className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-start gap-8'>
                                                    <div onClick={() => setSelectAllUnpaid(!selectAllUnpaid)} className='flex items-center justify-end gap-2 text-[12px] md:text-[16px] '>
                                                        <input type='checkbox' checked={selectAllUnpaid} />
                                                        <p>Select all unpaid royalties</p>
                                                    </div>
                                                    <div onClick={() => setShowUnpaidRoyaltiesOnly(!showUnpaidRoyaltiesOnly)} className='flex justify-end'>
                                                        <label className='flex items-center gap-2 text-[12px] md:text-[16px] '>
                                                            <input type='checkbox' checked={showUnpaidRoyaltiesOnly} />
                                                            Show unpaid royalties only
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row md:flex-col-reverse lg:flex-row gap-4 items-start md:items-center justify-end w-full my-10 md:my-0  lg:w-[50%]'>
                                                    {selectedItems.length > 0 && <p className=' '>{selectedItems.length} NFT{selectedItems.length > 1 && "s"} selected ({selectedItems.length > 0 && (totalToRepay.toFixed(2))} SOL) </p>}
                                                    <button /* onClick={handleRepay} */ disabled={selectedItems.length === 0} className={'btn btn-buy text-white hover:text-black pt-0 pb-0 px-[36px] rounded-[120px] bg-[#222222] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100   hover:bg-[#f5fd9c]' + (loading && " loading")}>Redeem</button>
                                                </div>
                                            </div>
                                        </>
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
