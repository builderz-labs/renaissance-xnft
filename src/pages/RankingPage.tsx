import styled from 'styled-components';
import { leaderBoard } from '../data/leaderBoard';
import { allCollections } from '../data/allCollections';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
height: 120px;
width: 100%;
filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));

margin-x: 18px;

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


export default function RankingPage() {

    const itemsToMap = leaderBoard.slice(3);


    return (
        <main className='mt-5'>
            <h2 className='text-2xl font-semibold text-start mb-4' >Top Redeemer:</h2>
            <MySlide>
                <div className="flex flex-col items-center justify-center h-full w-full px-12">

                    <div className="flex flex-row items-center justify-between gap-10 mb-2 w-full">
                        <div className="w-4 h-4">
                            <img src="/img/crown.png" alt="First Place" />
                        </div>
                        <p className='text-[18px] font-black'>{leaderBoard[0].name}</p>
                        <div className="flex flex-row gap-1 items-center justify-center">
                            <p className='w-full  font-light text-[18px]'>{leaderBoard[0].sol}</p>
                            <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                        </div>
                    </div>

                    {leaderBoard.slice(1, 3).map((item) => (
                        <div className="flex flex-row items-center justify-between gap-10 w-full">
                            <div className="w-4 h-4">
                                <p>{item.rank}.</p>
                            </div>
                            <p className='truncate'>{item.name}</p>
                            <div className="flex flex-row gap-1 items-center justify-center">
                                <p className='w-full  font-light text-[18px]'>{leaderBoard[0].sol}</p>
                                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                            </div>
                        </div>
                    ))}

                </div>
            </MySlide>
            <div className="flex flex-col items-between justify-center gap-4  py-5 mb-40">
                <h2 className='text-2xl font-semibold text-start my-2 mb-4'>Top Collections:</h2>
                <div className="bg-lily-black bg-opacity-40 flex flex-col gap-4 py-5">
                    {allCollections.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md">
                            <div className="w-[20px] col-span-1">
                                <p>{item.id}.</p>
                            </div>
                            <div className="flex flex-row gap-4 col-span-5 w-full text-start items-center justify-start">
                                <img src={item.image} alt={item.name} className='w-5 h-5 rounded-full' />
                                <p className='w-full  font-bold text-[18px]'>{item.name}</p>
                            </div>
                            <div className="flex flex-row gap-2 col-span-2 items-center justify-start">
                                <p className=' font-bold text-[18px]'>{item.sol}</p>
                                <img src="/img/sol.svg" alt="solana logo" className='w-4' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    );
}
