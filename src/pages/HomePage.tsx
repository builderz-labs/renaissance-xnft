import styled from 'styled-components';
import FeaturedList from '../components/FeaturedList';

import { useState, useEffect } from 'react';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  max-width: 100%;
  height: 99px;
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
      {filteredCollections.map((collection: any) => (
        <div className='w-full relative flex flex-col items-center justify-center my-2' key={collection.id}>
          <div className='w-full h-full object-cover'>
            <img src={collection.image} alt={collection.name} className='h-28 w-full object-cover rounded-md' />
          </div>
          <p className='py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-40'>{collection.name}</p>
        </div>
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
    },
    {
      id: 2,
      name: 'Claynosaurz',
      image: '/img/lily.webp',
    },
    {
      id: 3,
      name: 'ABC',
      image: '/img/clay.webp',
    },
    {
      id: 4,
      name: 'y00ts',
      image: '/img/lily.webp',
    },
    {
      id: 5,
      name: 'Cynova',
      image: '/img/clay.webp',
    },
    {
      id: 6,
      name: 'BLOCKZ',
      image: '/img/lily.webp',
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
        <p className='text-[14px] py-4'>It's Repay Renaissance! Redeem your royalties - your project might reward you!</p>
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
      <section className=''>
        <h2 className='pt-8 px-2 font-bold text-xl text-start'>All Collections</h2>
        <Search onSearch={handleSearch} />
        <AllList collections={allCollections} searchQuery={searchQuery} />
      </section>
    </div>
  );
}