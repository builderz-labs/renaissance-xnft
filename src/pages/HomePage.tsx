import styled from 'styled-components';
import { QueryClient } from '@tanstack/react-query';
import FeaturedList from '../components/home/FeaturedList';
import { Suspense } from 'react';
import { AllCollections } from '../components/home/AllCollections';
import { Await, defer, useLoaderData } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Leaderboard } from '../components/home/Leaderboard';
import { fetchLeaderboard } from '../utils/history';

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const loader = (queryClient: QueryClient) => {
  return defer({
    collections: queryClient.fetchQuery({
      queryKey: ['collections'],
      queryFn: () =>
        fetch('/src/data/collections.json').then(res => res.json()),
      staleTime: 1000 * 60 * 2,
    }),
    leaderboard: queryClient.fetchQuery({
      queryKey: ['leaderboard'],
      queryFn: () => fetchLeaderboard(),
    }),
  });
};

export const HomePage = () => {
  const { collections, leaderboard } = useLoaderData() as any;

  return (
    <div className="h-full max-w-full relative">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-20" />
      <Suspense fallback={<Loading />}>
        <Await resolve={collections}>
          {/* All Sections in their own components */}
          <p className="text-[14px] px-2 py-4 text-start max-w-xs">
            It's Repay Renaissance! Redeem your royalties - your project might
            reward you!
          </p>
          <Leaderboard />
          <FeaturedList />
          <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
          <AllCollections />
        </Await>
      </Suspense>
    </div>
  );
};
