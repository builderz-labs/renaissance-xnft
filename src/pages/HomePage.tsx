import { Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Await, Link, useLoaderData, defer } from "react-router-dom";
import { queryClient } from "../client";
import { Background } from "../components/Background";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { Logo } from "../components/Logo";
import { fetchGso } from "../hooks/useGso";
import { GsoParams } from "../types";
import { getConnection } from "../core";
import { prettyFormatPrice } from "../utils";

export async function loader() {
  return defer({
    gso: queryClient.fetchQuery({
      queryKey: ["gso"],
      queryFn: () => fetchGso(getConnection()),
    }),
  });
}

export function HomePage() {
  const data = useLoaderData() as any;
  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={data.gso}>
          <Background role="banner" className="-mt-2 -mx-2 mb-2 py-4">
            <Logo className="max-w-[300px] mx-auto" />
            <h2 className="text-white font-bold">Staking Options</h2>
          </Background>
          <GsoList />
        </Await>
      </Suspense>
    </div>
  );
}

function GsoList() {
  const { data: gso } = useQuery<GsoParams[]>({ queryKey: ["gso"] });
  return (
    <Transition
      appear
      show={!!gso}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
    >
      <div role="list">
        {gso &&
          gso.map((g) => {
            const { symbol, image } = g.metadata;
            return (
              <Link to={`/gso/${g.soName}`} key={g.soName}>
                <Card className="mb-2">
                  <div
                    role="listitem"
                    className="flex gap-2 items-center text-white"
                  >
                    <img
                      src={image}
                      alt={`${symbol} icon`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-normal">{symbol.toUpperCase()}</p>
                      <p className="text-sm">
                        Strike: {prettyFormatPrice(g.strike, 8)}
                      </p>
                      <p className="text-sm">Expires: {g.expiration}</p>
                    </div>
                    <FaChevronRight />
                  </div>
                </Card>
              </Link>
            );
          })}
      </div>
    </Transition>
  );
}
