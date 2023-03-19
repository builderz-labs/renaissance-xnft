import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Collection } from '../../data/types';
import Search from '../Search';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { AllCollectionsItem } from './AllCollectionsItem';

export const AllCollections = () => {
  const { data } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });

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
              <MenuItem value="Name">Name</MenuItem>
            </Select>
          </FormControl>
        </div>

      </div>
      <Search onSearch={handleSearch} />

      <div className="w-full grid grid-cols-2 px-2 gap-4 mb-40">
        {filteredCollections.map((collection: Collection) => (
          <AllCollectionsItem collection={collection} key={collection.id} />
        ))}
      </div>
    </section>
  );
};
