import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Collection } from '../../data/types';
import Search from '../Search';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

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
  const { data } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });

  const navigate = useNavigate();

  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');

  const [sortOption, setSortOption] = useState('');

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

  const handleSortChange = (
    event: SelectChangeEvent<typeof sortOption>
  ) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    if (data) {
      let sortedCollections = [...data];
      switch (sortOption) {
        case 'Ranking':
          sortedCollections = sortedCollections.sort(
            (a, b) => b.fp - a.fp
          );
          break;
        case 'Name':
          sortedCollections = sortedCollections.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        default:
          break;
      }
      const filteredCollections = sortedCollections.filter(
        (collection: { name: string }) =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filteredCollections);
    }
  }, [searchQuery, sortOption, data]);



  return (
    <section className="my-10">
      <div className="w-full flex flex-row justify-between items-center py-4">
        <div className=" flex items-center justify-center h-full">
          <h2 className=" px-2 font-bold text-xl">
            All Collections
          </h2>
        </div>
        <div className="max-w-xs flex items-center justify-center text-white">
          <FormControl sx={{ m: 1, minWidth: 120, color: 'white', backgroundColor: 'transparent' }} size="small" className='select select-ghost relative z-0'>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              id="sort"
              value={sortOption}
              label="Sort"
              onChange={handleSortChange}
              className='select select-ghost'
              style={{ backgroundColor: 'transparent' }} // Added background color
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Ranking">Top Redeemed</MenuItem>
              <MenuItem value="Name">Name</MenuItem>
            </Select>
          </FormControl>
        </div>

      </div>
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
                <p className="w-full  font-black truncate max-w-[70px] text-sm">
                  {collection.name}
                </p>
                <div className="flex flex-row gap-1 items-center justify-center">
                  <p className="w-full  font-light text-[12px]">
                    {collection.fp}
                  </p>
                  <img
                    src="/img/sol.svg"
                    alt="solana logo"
                    className="w-[12px]"
                  />

                </div>
              </div>
            </ItemCard>
          </div>
        ))}
      </div>
    </section>
  );
};
