import { defer } from 'react-router-dom';
import { getNfts } from '../utils/nfts';
import { useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { QueryClient } from '@tanstack/react-query';

import { Loading } from '../components/Loading';
import { NftList } from '../components/nfts/NftList';
import styled from 'styled-components';

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const loader = (queryClient: QueryClient) => {
  return defer({
    nfts: queryClient.fetchQuery({
      queryKey: ['nfts'],
      queryFn: () =>
        getNfts(
          window.xnft.solana.publicKey ||
          new PublicKey('PeRXuY1P4cnzDZEPH1ancRVSyQMDpnTF27BwmQ1kkWq')
        ), // Hard coded if in localhost
    }),
  });
};

export const NftsPage = () => {
  const { nfts } = useLoaderData() as any;

  return (
    <div className="h-full mb-40 relative">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-10" />
      <Suspense fallback={<Loading />}>
        <Await resolve={nfts}>
          <section className="my-5 ">
            <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
            <h1 className="text-4xl font-bold mb-10">Your NFTs</h1>
            <NftList />
          </section>
        </Await>
      </Suspense>
    </div>
  );
};
