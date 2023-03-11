import styled from 'styled-components';
import FeaturedList from '../components/FeaturedList';

import { useState } from 'react';
import AllList from '../components/AllList';
import { allCollections } from '../data/allCollections';
import Search from '../components/Search';
import { leaderBoard } from '../data/leaderBoard';

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
background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 30%, rgba(255, 255, 255, 0) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
  `
const MySecond = styled.div`
background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 40%, rgba(255, 255, 255, 0.22) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
`


export const HomePage = () => {

  // search input for all collections
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
          <div className="flex flex-col items-center justify-center h-full w-full px-12">
            <div className="flex flex-row items-center justify-between gap-8 w-full">
              <div className="w-4 h-4">
                <img src="/img/crown.png" alt="First Place" />
              </div>
              <p>{leaderBoard[0].name}</p>
              <div className="flex flex-row gap-1 items-center justify-center">
                <p className='w-full  font-semibold text-[8px]'>{leaderBoard[0].sol}</p>
                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
              </div>
            </div>
            {leaderBoard.slice(1, 3).map((item) => (
              <MySecond className="flex flex-row items-center justify-between gap-8 w-full">
                <div className="w-4 h-4">
                  <p>{item.rank}.</p>
                </div>
                <p>{item.name}</p>
                <div className="flex flex-row gap-1 items-center justify-center">
                  <p className='w-full  font-light text-[8px]'>{item.sol}</p>
                  <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                </div>
              </MySecond>
            ))}
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