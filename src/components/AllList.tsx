import { useEffect, useState } from 'react';
import styled from 'styled-components';


const ItemCard = styled.div`

background: linear-gradient(206.07deg, #050505 30.45%, #101C26 99.29%);
border-radius: 12px;

border: 0.5px solid;

border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 138, 87, 0.1) 100%);


`

function AllList({ collections, searchQuery }: any) {
    console.log(searchQuery)

    const [filteredCollections, setFilteredCollections] = useState(collections);

    console.log(filteredCollections)

    useEffect(() => {
        const filteredCollections = collections.filter((collection: { name: string; }) =>
            collection.name.toLowerCase().includes(searchQuery.toLowerCase())
        );


        setFilteredCollections(filteredCollections);

    }, [searchQuery])


    return (
        <div className='w-full grid grid-cols-2 px-2 gap-4 mb-40'>
            {/*    {filteredCollections.map((collection: any) => (
        <a key={collection.id} href={`/project/${collection.name}`} className='hover:text-renaissance-orange'>
          <div className='w-full relative flex flex-col items-center justify-center my-2' >
            <div className='w-full h-full object-cover'>
              <img src={collection.image} alt={collection.name} className='h-28 w-full object-cover rounded-md' />
            </div>
            <div className='py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-60 blur font-black'>
            </div>
            <p className='py-2 absolute bottom-2 left-0 w-full  font-black'>{collection.name}</p>          </div>
        </a>
      ))} */}
            {filteredCollections.map((collection: any) => (
                <a key={collection.id} href={`/project/${collection.name}`} className='hover:text-renaissance-orange'>
                    <ItemCard className='w-full relative flex flex-row items-center justify-between my-2' >
                        <div className='w-[69px] h-full object-cover'>
                            <img src={collection.image} alt={collection.name} className='h-[69px] w-full object-cover rounded-md' />
                        </div>
                        <div className='flex flex-col gap-2 justify-center items-start text-start flex-grow pl-4'>
                            <p className='w-full  font-black truncate text-sm'>{collection.name}</p>
                            <div className="flex flex-row gap-1 items-center justify-center">
                                <p className='w-full  font-light text-[8px]'>FP: </p>
                                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                                <p className='w-full  font-light text-[8px]'>{collection.fp}</p>
                            </div>
                        </div>
                    </ItemCard>
                </a>
            ))}
        </div>
    );
}

export default AllList;