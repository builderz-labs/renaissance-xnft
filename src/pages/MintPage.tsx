import { defer } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";
import { Await } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { Loading } from "../components/Loading";
import { CandyMachine } from "@metaplex-foundation/js";
import Countdown from "react-countdown";
import { useWallet } from "../hooks/useWallet";

import mintBanner from '../assets/F1_2023_Lineup.png'
import { getCandyMachine } from "../utils/candyMachine";
import { toDate } from "../utils/utils";
import { MintButton } from "../components/MintButton"; 

export const loader = (queryClient: QueryClient) => {
  return defer({
    cm: queryClient.fetchQuery({
      queryKey: ["cm"],
      queryFn: () =>
        getCandyMachine("8Z1r48UAvmghrYP23hCr18tN7cRhcEEafSAWnnWpms7K")
    })
  });
}

export const MintPage = () => {
  const { cm }: { cm: CandyMachine } = useLoaderData() as any;

  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={cm} >
          <section className='my-5'>
            <Mint />
          </section>
        </Await>
      </Suspense>
    </div>
  )
}

export const Mint = () => {
  const { data: cm } = useQuery<CandyMachine>({
    queryKey: ["cm"],
  })

  const [isActive, setIsActive] = useState(false);

  const wallet = useWallet()

  return (
    <div>
      <h1 className='text-4xl font-bold mb-10'>Mint</h1>
      <img src={mintBanner} />
      <div>
      {cm && cm.candyGuard && (
        <>
        {!isActive ? ( 
          <div className="text-center mt-4 ">
            {/* @ts-ignore */}
            <Countdown
              date={toDate(
                cm.candyGuard.guards.startDate?.date
              )}
              onComplete={() => {
                setIsActive(true);
              }}
              renderer={renderGoLiveDateCounter}
              onMount={() => {
                if (
                  // @ts-ignore
                  toDate(cm?.candyGuard?.guards.startDate?.date) > new Date()
                ) {
                  setIsActive(false);
                } else {
                  setIsActive(true);
                }
              }}
            />
          </div>
        ) : (
          <>
            <div className="mt-10">
              <p className="text-center m-2">
                Total Minted:{" "}
                <span className="text-lg font-bold">
                  {cm.itemsMinted?.toNumber()} /{" "}
                  {cm.itemsLoaded}
                </span>
              </p>
            </div>
            <div className="text-center w-full p-2">
              <MintButton />
              {/* {wallet && (
                <p>SOL Balance: {(balance || 0).toLocaleString()}</p>
              )} */}
            </div>
          </>
        )}
      </>
      )}
      </div>
    </div>
  )
};

const renderGoLiveDateCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="flex mx-6 space-x-2">
      <div className="flex-1 bg-blue-500 rounded font-bold py-6">
        <h1>{days}</h1>Days
      </div>
      <div className="flex-1 bg-blue-500 rounded font-bold py-6">
        <h1>{hours}</h1>
        Hours
      </div>
      <div className="flex-1 bg-blue-500 rounded font-bold py-6">
        <h1>{minutes}</h1>Mins
      </div>
      <div className="flex-1 bg-blue-500 rounded font-bold py-6">
        <h1>{seconds}</h1>Secs
      </div>
    </div>
  );
};
