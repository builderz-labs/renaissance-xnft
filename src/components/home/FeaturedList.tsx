import { useQuery } from '@tanstack/react-query';
import { Collection } from '../../data/types';
import { useNavigate } from 'react-router-dom';

export const FeaturedList = () => {
  const navigate = useNavigate();

  const { data } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });

  return (
    <section className="">
      <h2 className="py-2 px-2 pt-4 font-bold text-xl text-start">
        Featured Collections
      </h2>
      <div className="w-full grid grid-cols-2 px-2 gap-4">
        {data &&
          data.slice(0, 2).map(collection => (
            <div
              key={collection.id}
              onClick={() => navigate(`/project/${collection.name}`)}
              className="hover:text-renaissance-orange "
            >
              <div
                key={collection.id}
                className="w-full relative flex flex-col items-center justify-center my-2"
              >
                <div className="w-full h-full object-cover">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-28 w-full object-cover rounded-md"
                  />
                </div>
                <div className="py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-60 blur font-black"></div>
                <p className="py-2 absolute bottom-2 left-0 w-full  font-black">
                  {collection.name}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default FeaturedList;
