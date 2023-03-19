import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Collection } from "../../data/types";
// import { getCollectionLeaderboard } from "../../utils/history";

export const CollectionsLeaderboard = () => {
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: ["collections"],
  });

  // const { data: collectionsLeaderboard, isLoading: isLoadingLeaderboard } = useQuery({
  //   queryKey: ["collectionsLeaderboard"],
  //   queryFn: () => {} // getCollectionLeaderboard(collections!.map(col => col.collectionAddress)),
  //   // enabled: !!collections,
  // });

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-between justify-center gap-4  py-5 mb-40 rounded-lg">
      <h2 className="text-2xl font-semibold text-start my-2 mb-4">
        Top Collections:
      </h2>
      {isLoadingCollections ? (
        <CircularProgress />
      ) : (
        <div className="bg-lily-black bg-opacity-40 flex flex-col gap-4 rounded-md">
          {collections &&
            collections.map((item, index) => (
              <div
                onClick={() => navigate(`/project/${item.name}`)}
                key={item.id}
                className="hover:text-renaissance-orange hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <div className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md border-b border-b-white ">
                  <div className="w-[20px] col-span-1">
                    <p className="font-bold">{item.id}.</p>
                  </div>
                  <div className="flex flex-row gap-4 col-span-5 w-full text-start items-center justify-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <p className="w-full  font-bold text-[18px]">{item.name}</p>
                  </div>
                  {/* <div className="flex flex-row gap-2 col-span-2 items-center justify-end">
                    <p className=" font-bold text-[18px]">{item.sol}</p>
                    <img src="/img/sol.svg" alt="solana logo" className="w-4" />
                  </div> */}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
