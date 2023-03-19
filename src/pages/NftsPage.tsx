import { defer } from 'react-router-dom';
import { getNfts } from '../utils/nfts';
import { useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { QueryClient } from '@tanstack/react-query';

import { Loading } from '../components/Loading';
import styled from 'styled-components';
import { NftListRedemption } from '../components/project/NftListRedemption';
import { NftStats } from '../components/nfts/NftStats';

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const NftsPage = () => {
  return (
    <div className="h-full relative mb-40">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-10" />
      <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
          <section className="my-5 ">
            <h1 className="text-4xl font-bold mb-16">Your NFTs</h1>
            <NftStats />
            <NftListRedemption />
          </section>
    </div>
  );
};
