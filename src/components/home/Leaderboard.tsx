import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { leaderBoard } from '../../data/leaderBoard';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 96px;
  width: 100%;
  filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));
`;

const MySecond = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.28) 40%,
    rgba(255, 255, 255, 0.22) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export const Leaderboard = () => {
  const { data: leaderboard } = useQuery<any[]>({
    queryKey: ['leaderboard'],
  });

  return (
    <section className="">
      <MySlide>
        <div className="flex flex-col items-center justify-center h-full w-full px-12">
          <div className="flex flex-row items-center justify-between gap-8 w-full">
            <div className="w-4 h-4">
              <img src="/img/crown.png" alt="First Place" />
            </div>
            <p>{leaderBoard[0].name}</p>
            <div className="flex flex-row gap-1 items-center justify-center">
              <p className="w-full  font-semibold text-[12px]">
                {leaderBoard[0].sol}
              </p>
              <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
            </div>
          </div>
          {leaderBoard.slice(1, 3).map(item => (
            <MySecond
              key={item.rank}
              className="flex flex-row items-center justify-between gap-8 w-full"
            >
              <div className="w-4 h-4">
                <p>{item.rank}.</p>
              </div>
              <p>{item.name}</p>
              <div className="flex flex-row gap-1 items-center justify-center">
                <p className="w-full  font-light text-[12px]">{item.sol}</p>
                <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
              </div>
            </MySecond>
          ))}
        </div>
      </MySlide>
    </section>
  );
};
