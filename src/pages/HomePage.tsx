import styled from 'styled-components';
import FeaturedList from '../components/FeaturedList';

import { useState, useEffect } from 'react';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
height: 96px;
width: 100%;
filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));

margin-x: 16px;

  `
const MyDiv = styled.div`
background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
  `
const MySecond = styled.div`
background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.22) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
`

const ItemCard = styled.div`

background: linear-gradient(206.07deg, #050505 30.45%, #101C26 99.29%);
border-radius: 12px;

border: 0.5px solid;

border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 138, 87, 0.1) 100%);


`

function AllList({ collections, searchQuery }: any) {
  console.log(searchQuery)

  const [filteredCollections, setFilteredCollections] = useState(collections);

  console.log(filteredCollections)

  useEffect(() => {
    const filteredCollections = collections.filter((collection: { name: string; }) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    setFilteredCollections(filteredCollections);

  }, [searchQuery])


  return (
    <div className='w-full grid grid-cols-2 px-2 gap-4'>
      {/*    {filteredCollections.map((collection: any) => (
        <a key={collection.id} href={`/project/${collection.name}`} className='hover:text-renaissance-orange'>
          <div className='w-full relative flex flex-col items-center justify-center my-2' >
            <div className='w-full h-full object-cover'>
              <img src={collection.image} alt={collection.name} className='h-28 w-full object-cover rounded-md' />
            </div>
            <div className='py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-60 blur font-black'>
            </div>
            <p className='py-2 absolute bottom-2 left-0 w-full  font-black'>{collection.name}</p>          </div>
        </a>
      ))} */}
      {filteredCollections.map((collection: any) => (
        <a key={collection.id} href={`/project/${collection.name}`} className='hover:text-renaissance-orange'>
          <ItemCard className='w-full relative flex flex-row items-center justify-between my-2' >
            <div className='w-[69px] h-full object-cover'>
              <img src={collection.image} alt={collection.name} className='h-[69px] w-full object-cover rounded-md' />
            </div>
            <div className='flex flex-col gap-2 justify-center items-start text-start flex-grow pl-4'>
              <p className='w-full  font-black truncate text-sm'>{collection.name}</p>
              <div className="flex flex-row gap-1 items-center justify-center">
                <p className='w-full  font-light text-[8px]'>FP: </p>
                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                <p className='w-full  font-light text-[8px]'>{collection.fp}</p>
              </div>
            </div>
          </ItemCard>
        </a>
      ))}
    </div>
  );
}

function Search({ onSearch }: any) {

  const handleInputChange = (event: { target: { value: any; }; }) => {
    onSearch(event.target.value);

  };

  return (
    <section className='my-4 w-full '>
      <div className='relative w-full px-2'>
        <label className='w-full'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 absolute top-[14px] left-[22px] opacity-60' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input type='text' placeholder='Search NFT collection ...' className='input pl-12 bg-transparent input-bordered w-full px-2' onChange={handleInputChange} />
        </label>
      </div>
    </section>
  );
}



export const HomePage = () => {

  const allCollections = [
    {
      id: 1,
      name: 'LILY',
      image: '/img/clay.webp',
      fp: 9.6
    },
    {
      id: 2,
      name: 'Claynosaurz',
      image: '/img/lily.webp',
      fp: 42.0
    },
    {
      id: 3,
      name: 'ABC',
      image: '/img/abc.gif',
      fp: 69.0
    },
    {
      id: 4,
      name: 'y00ts',
      image: '/img/y00ts.jpg',
      fp: 125.0
    },
    {
      id: 5,
      name: 'Smyths',
      image: '/img/smyths.jpg',
      fp: 6.9
    },
    {
      id: 6,
      name: 'FFF',
      image: '/img/fff.webp',
      fp: 23.6
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: any) => {
    setSearchQuery(query);
    console.log(query)
  };



  return (
    <div className="h-full max-w-full">
      <section className='px-2'>
        <p className='text-[14px] py-4 text-start max-w-xs'>It's Repay Renaissance! Redeem your royalties - your project might reward you!</p>
        <MySlide>
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex flex-row items-center justify-between gap-8">
              <div className="w-4 h-4">
                <img src="/img/crown.png" alt="First Place" />
              </div>
              <p>@donjohnson__</p>
              <p>42.0 SOL</p>
            </div>
            <MySecond className="flex flex-row items-center justify-between gap-8">
              <div className="w-4 h-4">
                <p>2.</p>
              </div>
              <p>@donjohnson__</p>
              <p>42.0 SOL</p>
            </MySecond>
            <MyDiv className="flex flex-row items-center justify-between gap-8">
              <div className="w-4 h-4">
                <p>3.</p>
              </div>
              <p>@donjohnson__</p>
              <p>42.0 SOL</p>
            </MyDiv>
          </div>
        </MySlide>
      </section>
      <section className="">
        <h2 className='py-2 px-2 pt-4 font-bold text-xl text-start'>Featured Collections</h2>
        <FeaturedList />
      </section>
      <section className='mb-10'>
        <h2 className='pt-8 px-2 font-bold text-xl text-start'>All Collections</h2>
        <Search onSearch={handleSearch} />
        <AllList collections={allCollections} searchQuery={searchQuery} />
      </section>
    </div>
  );
}