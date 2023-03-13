import styled from 'styled-components';

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

export const NftItem = ({ nft }: any) => {
  return (
    <ItemCard className=" rounded-lg">
      <div className="w-70 h-70 object-cover rounded-lg">
        <img
          src={nft.imageUrl}
          width={150}
          height={150}
          alt="NFT"
          className="p-2 w-full h-40 object-cover rounded-lg"
        />
      </div>
      <p className="font-bold my-2 px-2 w-full text-center truncate hover:text-[#FF8A57]">
        {nft.name}
      </p>
    </ItemCard>
  );
};
