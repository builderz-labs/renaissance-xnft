import React from 'react'

const FeaturedCollections = [
    {
        id: 1,
        name: 'Claynosaurz',
        image: '/img/clay.webp',
    },
    {
        id: 2,
        name: 'LILY',
        image: '/img/lily.webp',
    },

]

function FeaturedList() {
    return (
        <div className='w-full grid grid-cols-2 px-2 gap-4'>
            {FeaturedCollections.map((collection) => (
                <div key={collection.id} className='w-full relative flex flex-col items-center justify-center my-2'>
                    <div className='w-full h-full object-cover'>
                        <img src={collection.image} alt={collection.name} className='h-28 w-full object-cover rounded-md' />
                    </div>
                    <p className='py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-40'>{collection.name}</p>
                </div>
            ))}
        </div>
    )
}

export default FeaturedList