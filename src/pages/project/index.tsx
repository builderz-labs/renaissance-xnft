import { useLoaderData, defer, useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Await } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';

import { Loading } from '../../components/Loading';
import { Collection } from '../../data/types';
import { NftListRedemption } from '../../components/project/NftListRedemption';

export const loader = (queryClient: QueryClient, { params }: any) => {
  if (!params.id) {
    throw new Response('Bad Request', { status: 400 });
  }
  return defer({
    collections: queryClient.fetchQuery({
      queryKey: ['collections'],
      queryFn: () =>
        fetch('/src/data/collections.json').then(res => res.json()),
      staleTime: 1000 * 60 * 2,
    }),
  });
};

export const ProjectPage = () => {
  const data = useLoaderData() as any;

  return (
    <div className="mt-5 h-full relative">
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProjectDetails />
        </Await>
      </Suspense>
    </div>
  );
};

export const ProjectDetails = () => {
  const { id } = useParams();

  // Get Collection
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });
  const [pageCollection, setPageCollection] = useState<Collection>();

  useEffect(() => {
    if (collections) {
      const collection = collections.find((c: Collection) => c.name === id);
      setPageCollection(collection);
    }
  }, [collections, id]);

  return (
    <div>
      <div className="mt-5 h-full relative">
        {pageCollection ? (
          <>
            <div className="w-full flex items-center justify-center my-5 rounded-lg shadow-lg">
              <img
                src={pageCollection.image}
                alt={id}
                className="w-full rounded-lg object-cover max-h-40"
              />
            </div>
            <section className="my-4 text-start px-2 text-2xl font-bold">
              <h1>Your {id} NFTs</h1>
              <NftListRedemption
                collectionAddress={pageCollection.collectionAddress}
              />
            </section>
          </>
        ) : (
          <div>Collection not found</div>
        )}
      </div>
    </div>
  );
};
