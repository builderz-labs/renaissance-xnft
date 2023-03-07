
export const NftItem = ({ nft }: any) => {
  return (
    <div className='bg-gray-200 dark:bg-gray-800 rounded-lg'>
      <div className='w-70 h-70 object-cover rounded-lg'>
        <img src={nft.imageUrl} width={150} height={150} alt="NFT" className="p-2 w-full h-60 object-cover rounded-lg" />
      </div>
      <p className="font-bold my-2 truncate px-2 w-full text-center">{nft.name}</p>
    </div>
  )
};
