import { useLoaderData, defer, useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Await } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { Loading } from '../../components/Loading';
import { Collection } from '../../data/types';
import { NftListRedemption } from '../../components/project/NftListRedemption';
import styled from 'styled-components';
import { Button, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
    throw new Response('Bad Request', { status: 400 });
  }
  return defer({
    collections: queryClient.fetchQuery({
      queryKey: ['collections'],
      queryFn: () =>
        fetch('/src/data/collections.json').then(res => res.json()),
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

  // Get Collection
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });
  const [pageCollection, setPageCollection] = useState<Collection>();

  useEffect(() => {
    if (collections) {
      const collection = collections.find((c: Collection) => c.name === id);
      setPageCollection(collection);
    }
  }, [collections, id]);

  console.log(collections)

  return (
    <div>
      <div className="mt-5 h-full relative mb-40">
        {pageCollection ? (
          <>
            <div className="w-full flex flex-col items-center justify-center my-5 rounded-lg shadow-lg">

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
                  {/*  <div className='w-full flex flex-row justify-start gap-4 items-center'>

                    <a href="">
                      <TwitterIcon />
                    </a>
                    <a href="" >
                      <HeadsetMicIcon />
                    </a>
                    <a href="">
                      <LanguageIcon />
                    </a>

                  </div> */}
                  <div className="border-b border-b-gray-500 w-full"></div>
                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <div className='flex flex-row gap-2 items-center justify-center pr-2'>
                      <p className="font-light text-xl">
                        {pageCollection.fp}
                      </p>
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="h-full w-0.5 bg-gray-500"></div>
                    <div className='flex flex-row gap-2 items-center justify-center pr-2'>
                      <Tooltip title="Percent of royalties paid vs expected
actual_royalties / expected_royalties"
                        placement="top"
                        className='cursor-help'>
                        <p className='text-start  font-light text-lg'>15.66%</p>

                      </Tooltip>
                    </div>
                  </div>
                </div>

              </ItemCard>
              <ItemCard className='w-full flex justify-end'>
                <div className="w-1/2 h-full p-5 flex flex-col items-center justify-center gap-1">
                  <div className='w-full flex flex-row justify-center gap-4 items-start'>
                    <a href="">
                      <TwitterIcon />
                    </a>
                    <a href="" >
                      <HeadsetMicIcon />
                    </a>
                    <a href="">
                      <LanguageIcon />
                    </a>
                  </div>
                  <ItemCard className="h-full w-full my-6">
                    <div className="flex flex-row gap-2 items-center justify-center w-full h-full">
                      <div className='flex flex-row gap-1 items-center justify-center py-2'>
                        <p className="w-full text-center  font-light text-sm">0.89</p>
                        <img
                          src="/img/sol.svg"
                          alt="solana logo"
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </ItemCard>
                  <button /* disabled={selectedItems.length === 0} */ className={'btn btn-buy text-black  pt-0 pb-0 px-[24px] w-full rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100   hover:bg-[#f5fd9c] break-keep' /* + (loading && " loading") */}>Redeem All</button>
                </div>
                <div className="w-1/2 h-full p-5 flex flex-col items-start justify-start gap-1">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="">
                      <Tooltip title="Actual royalties rate received. total_royalties / total_sales"
                        placement="top"
                        className='cursor-help'>
                        <p className='text-start  font-light text-sm'>Effective Rate:</p>
                      </Tooltip>
                    </div>

                    <div className='flex flex-row gap-2 items-center justify-center pr-2'>
                      <p className="w-full  font-light text-xl">
                        0.78%
                      </p>
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div className="border-b border-b-gray-500 w-full my-2"></div>

                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <div className="">
                      <Tooltip title="Creators' royalty rate as per on-chain metadata"
                        placement="top"
                        className='cursor-help'>
                        <p className='text-start  font-light text-sm'>Expected Rate:</p>
                      </Tooltip>
                    </div>                    <div className='flex flex-row gap-2 items-center justify-center pr-2'>
                      <p className="w-full  font-light text-xl">
                        5.00%
                      </p>
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div className="border-b border-b-gray-500 w-full my-2"></div>

                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <div className="">
                      <Tooltip title="Percent of royalties paid vs expected actual_royalties / expected_royalties"
                        placement="top"
                        className='cursor-help'>
                        <p className='text-start  font-light text-sm'>Percent Paid:</p>
                      </Tooltip>
                    </div>
                    <div className='flex flex-row gap-2 items-center justify-center pr-2'>
                      <p className="w-full  font-light text-xl">
                        15.6%
                      </p>
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </ItemCard>
            </div>
            <section className="my-4 text-start px-2 text-2xl font-bold flex flex-col gap-4 mt-20">
              <h1>Your {id} NFTs</h1>
              <NftListRedemption
                collectionAddress={pageCollection.collectionAddress}
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
