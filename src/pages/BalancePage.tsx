import { Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Await, defer, Link, useLoaderData } from "react-router-dom";
import { queryClient } from "../client";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { fetchGsoBalance } from "../hooks/useGsoBalance";
import { fetchStakingOptionsBalance } from "../hooks/useStakingOptionsBalance";
import { useWallet } from "../hooks/useWallet";
import { GsoBalanceParams } from "../types";
import { getConnection } from "../core";
import { prettyFormatPrice } from "../utils";

export async function loader() {
  return defer({
    gsoBalances: queryClient.fetchQuery({
      queryKey: ["balance/gso", window.xnft.solana.publicKey.toBase58()],
      queryFn: () =>
        fetchGsoBalance(getConnection(), window.xnft.solana.publicKey),
    }),
    soBalances: queryClient.fetchQuery({
      queryKey: ["balance/so", window.xnft.solana.publicKey.toBase58()],
      queryFn: () =>
        fetchStakingOptionsBalance(
          getConnection(),
          window.xnft.solana.publicKey
        ),
    }),
  });
}

export function BalancePage() {
  const data = useLoaderData() as any;
  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={data.gsoBalances}>
          <Balances />
        </Await>
      </Suspense>
    </div>
  );
}

function Balances() {
  const { publicKey } = useWallet();
  const { data: gsoBalances } = useQuery<GsoBalanceParams[]>({
    queryKey: ["balance/gso", publicKey.toBase58()],
  });
  const { data: soBalances } = useQuery<GsoBalanceParams[]>({
    queryKey: ["balance/so", publicKey.toBase58()],
  });

  return (
    <Transition
      appear
      show={!!gsoBalances || !!soBalances}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
    >
      <div role="list">
        {soBalances &&
          soBalances
            .filter((g) => g.expirationInt >= Math.floor(Date.now() / 1000))
            .map((g) => {
              const { symbol, image } = g.metadata;
              const { symbol: optionSymbol, image: optionImage } =
                g.optionMetadata;
              return (
                <Link to={`/balance/so/${g.soName}`} key={g.soName}>
                  <Card className="mb-2">
                    <div
                      role="listitem"
                      className="flex gap-4 items-center text-white"
                    >
                      <div className="relative">
                        <img
                          src={optionImage}
                          alt={`${optionSymbol} icon`}
                          className="w-10 h-10 rounded-full"
                        />
                        <img
                          src={image}
                          alt={`${symbol} icon`}
                          className="absolute w-5 h-5 -top-2 -right-2 rounded-full"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-lg">
                          {g.numTokens} Staking Options
                        </div>
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
        {gsoBalances &&
          gsoBalances
            .filter((g) => g.expirationInt < Math.floor(Date.now() / 1000))
            .map((g) => {
              const { symbol, image } = g.metadata;
              return (
                <Link to={`/balance/gso/${g.soName}`} key={g.soName}>
                  <Card className="mb-2">
                    <div
                      role="listitem"
                      className="flex gap-4 items-center text-white"
                    >
                      <div className="relative">
                        <img
                          src={image}
                          alt={`${symbol} icon`}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-lg">
                          {g.numTokens} {symbol?.toUpperCase()}
                        </div>
                        <p className="text-sm">Expired on: {g.expiration}</p>
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
