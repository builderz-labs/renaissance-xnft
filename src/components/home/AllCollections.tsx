import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Collection } from '../../data/types';
import Search from '../Search';
import { useNavigate } from 'react-router-dom';

const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border-radius: 12px;
  border: 0.5px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 138, 87, 0.1) 100%
  );
`;

export const AllCollections = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });

  const navigate = useNavigate();

  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: any) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (data) {
      const filteredCollections = data.filter((collection: { name: string }) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredCollections(filteredCollections);
    }
  }, [searchQuery]);

  return (
    <section className="mb-10">
      <h2 className="pt-8 px-2 font-bold text-xl text-start">
        All Collections
      </h2>
      <Search onSearch={handleSearch} />

      <div className="w-full grid grid-cols-2 px-2 gap-4 mb-40">
        {filteredCollections.map((collection: any) => (
          <div
            key={collection.id}
            onClick={() => navigate(`/project/${collection.name}`)}
            className="hover:text-renaissance-orange"
          >
            <ItemCard className="w-full relative flex flex-row items-center justify-between my-2">
              <div className="w-[69px] h-full object-cover">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-[69px] w-full object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2 justify-center items-start text-start flex-grow pl-4">
                <p className="w-full  font-black truncate text-sm">
                  {collection.name}
                </p>
                <div className="flex flex-row gap-1 items-center justify-center">
                  <p className="w-full  font-light text-[8px]">FP: </p>
                  <img
                    src="/img/sol.svg"
                    alt="solana logo"
                    className="w-[7px]"
                  />
                  <p className="w-full  font-light text-[8px]">
                    {collection.fp}
                  </p>
                </div>
              </div>
            </ItemCard>
          </div>
        ))}
      </div>
    </section>
  );
};
