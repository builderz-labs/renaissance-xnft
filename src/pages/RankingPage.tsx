import styled from 'styled-components';
import { leaderBoard } from '../data/leaderBoard';

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
            {/*             <h1 className='text-4xl font-bold mb-10'>Ranking</h1>
 */}            <MySlide>
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
                        <MySecond className="flex flex-row items-center justify-between gap-10 w-full">
                            <div className="w-4 h-4">
                                <p>{item.rank}.</p>
                            </div>
                            <p>{item.name}</p>
                            <div className="flex flex-row gap-1 items-center justify-center">
                                <p className='w-full  font-light text-[18px]'>{leaderBoard[0].sol}</p>
                                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                            </div>
                        </MySecond>
                    ))}

                </div>
            </MySlide>
            <div className="flex flex-col items-between justify-center gap-2 px-12 py-5">
                {itemsToMap.map((item, index) => (
                    <div key={item.rank} className="flex flex-row items-center justify-between gap-4">
                        <div className="w-4 h-4">
                            <p>{item.rank}.</p>
                        </div>
                        <p>{item.name}</p>
                        <div className="flex flex-row gap-1 items-center justify-center">
                            <p className='w-full  font-light text-[14px]'>{item.sol}</p>
                            <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                        </div>
                    </div>
                ))}
            </div>

        </main>
    );
}
