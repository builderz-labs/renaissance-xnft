import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { truncate } from '../../utils/history';

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
  const { data: leaderboard } = useQuery<{ user: string, total: number }[]>({
    queryKey: ['leaderboard'],
  });

  return (
    <section className="">
      <h2 className="py-2 px-2 pt-4 font-bold text-xl text-start mb-2">
        Top Re<span className='text-renaissance-orange'>:</span>deemer <span className='text-[8px] text-gray-400'>(7D)</span>
      </h2>
      <MySlide>
        <div className="flex flex-col items-center justify-center h-full w-full px-12">

          {/* First Place */}
          <div className="flex flex-row items-center justify-between gap-8 w-full">
            <div className="w-4 h-4">
              <img src="/img/crown.png" alt="First Place" />
            </div>
            <p>{leaderboard && truncate(leaderboard[0].user, 4, 4)}</p>
            <div className="flex flex-row gap-1 items-center justify-center">
              <p className="w-full  font-semibold text-[12px]">
                {leaderboard && leaderboard[0].total.toFixed(2)}
              </p>
              <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
            </div>
          </div>
          {/* Oder 2 */}
          {leaderboard && leaderboard.slice(1, 3).map((item, i) => (
            <MySecond
              key={i}
              className="flex flex-row items-center justify-between gap-8 w-full"
            >
              <div className="w-4 h-4">
                <p>{i + 2}.</p>
              </div>
              <p>{truncate(item.user, 4, 4)}</p>
              <div className="flex flex-row gap-1 items-center justify-center">
                <p className="w-full  font-light text-[12px]">{item.total.toFixed(2)}</p>
                <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
              </div>
            </MySecond>
          ))}
        </div>
      </MySlide>
    </section>
  );
};
