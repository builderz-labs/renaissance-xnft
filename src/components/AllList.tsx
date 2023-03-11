const AllCollections = [
    {
        name: 'LILY',
        image: '/img/clay.webp',
    },
    {
        name: 'Claynosaurz',
        image: '/img/lily.webp',
    },
    {
        name: 'LILY',
        image: '/img/clay.webp',
    },
    {
        name: 'Claynosaurz',
        image: '/img/lily.webp',
    },
    {
        name: 'LILY',
        image: '/img/clay.webp',
    },
    {
        name: 'Claynosaurz',
        image: '/img/lily.webp',
    },
]


function AllList() {
    return (
        <div className='w-full grid grid-cols-2 px-2 gap-4'>
            {AllCollections.map((collection) => (
                <div className='w-full relative flex flex-col items-center justify-center my-2'>
                    <div className='w-full h-full object-cover'>
                        <img src={collection.image} alt={collection.name} className='h-28 w-full object-cover rounded-md' />
                    </div>
                    <p className='py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-40'>{collection.name}</p>
                </div>
            ))}
        </div>
    )
}

export default AllList