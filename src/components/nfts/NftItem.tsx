
export const NftItem = ({ nft }: any) => {
  return (
    <div>
      <div className='w-70 h-70 object-cover'>
        <img src={nft.imageUrl} width={150} height={150} alt="NFT" className="mt-8 w-full h-60 object-cover" />
      </div>
      <p className="font-bold mt-2">{nft.name}</p>
    </div>
  ) 
};
