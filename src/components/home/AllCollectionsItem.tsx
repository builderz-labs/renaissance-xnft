import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { useQuery } from "@tanstack/react-query";
import { Collection } from "../../data/types";
import { RestClient, CollectionFloorpriceRequest } from "@hellomoon/api"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

const client = new RestClient("5ea087e7-d02f-418e-9e29-4b75ad52c31e");

export const AllCollectionsItem = ({ collection }: { collection: Collection }) => {
  
  const navigate = useNavigate();

  const { data: marketplaceData } = useQuery({
    queryKey: ['marketplaceData', collection.helloMoonCollectionId],
    queryFn: () => client.send(new CollectionFloorpriceRequest({
      helloMoonCollectionId: collection.helloMoonCollectionId
    }))
  });    

  return (
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
            {/* @ts-ignore */}
            FP: {marketplaceData?.data[0]?.floorPriceLamports ? (parseFloat(marketplaceData?.data[0]?.floorPriceLamports!) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"}
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
  )
}