import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, Suspense, useCallback, useMemo, useState } from "react";
import {
  Await,
  defer,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { queryClient } from "../client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { TokenInput } from "../components/TokenInput";
import { fetchGsoBalanceDetails } from "../hooks/useGsoBalance";
import { useWallet } from "../hooks/useWallet";
import { unstakeGSO, getConnection } from "../core";
import { GsoBalanceParams } from "../types";
import { parseNumber } from "../utils";

type LoaderParams = {
  params: {
    name?: string;
  };
};

export async function loader({ params }: LoaderParams) {
  if (!params.name) {
    throw new Response("Bad Request", { status: 400 });
  }
  return defer({
    gsoBalanceDetails: queryClient.fetchQuery({
      queryKey: [
        "balance/gso",
        window.xnft.solana.publicKey.toBase58(),
        params.name,
      ],
      queryFn: () =>
        fetchGsoBalanceDetails(
          getConnection(),
          window.xnft.solana.publicKey,
          params.name
        ),
    }),
  });
}

export function GsoBalancePage() {
  const data = useLoaderData() as any;
  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <Await resolve={data.gsoBalanceDetails}>
          <BalanceDetails />
        </Await>
      </Suspense>
    </div>
  );
}

function BalanceDetails() {
  const navigate = useNavigate();
  const { name } = useParams();
  const wallet = useWallet();
  const { data: gsoBalanceDetails } = useQuery<GsoBalanceParams>({
    queryKey: ["balance/gso", wallet.publicKey.toBase58(), name],
  });
  const { connection } = useConnection();

  const [stakeValue, setStakeValue] = useState("");
  const handleUnstakeClick = useCallback(async () => {
    if (!connection || !gsoBalanceDetails || !wallet) {
      return;
    }

    const amount = Number(
      parseFloat(stakeValue) * 10 ** gsoBalanceDetails.baseAtoms
    );
    try {
      const signature = await unstakeGSO(
        gsoBalanceDetails,
        amount,
        connection,
        wallet
      );
      console.info("signature:", signature);
      await queryClient.invalidateQueries(["balance/gso", wallet.publicKey]);
      await queryClient.invalidateQueries([
        "balance/gso",
        wallet.publicKey,
        name,
      ]);
      navigate("/balance");
    } catch (err) {
      console.error(err);
    }
  }, [gsoBalanceDetails, stakeValue, connection, wallet, name]);
  const step = useMemo(() => {
    if (gsoBalanceDetails) return 1 / 10 ** gsoBalanceDetails.baseAtoms;
  }, [gsoBalanceDetails]);
  const isDisabled = useMemo(() => {
    const value = parseFloat(stakeValue);
    if (
      !gsoBalanceDetails ||
      !value ||
      !step ||
      value > gsoBalanceDetails.numTokens ||
      value < step
    ) {
      return true;
    }
    return false;
  }, [stakeValue, gsoBalanceDetails, step]);

  if (!gsoBalanceDetails) return null;

  const { symbol, image } = gsoBalanceDetails.metadata;
  return (
    <div className="flex flex-col gap-2">
      {gsoBalanceDetails && (
        <>
          <Card>
            <div className="flex items-center text-left gap-4">
              <img src={image} className="w-20 h-20" />
              <div className="flex-1 text-md border-l-gray-500 border-l-2 pl-4">
                <h2 className="text-lg font-bold">
                  {gsoBalanceDetails.soName}
                </h2>
                <p>
                  Collateral: {gsoBalanceDetails.numTokens}{" "}
                  {symbol?.toUpperCase()}
                </p>
                <p>Expires: {gsoBalanceDetails.expiration}</p>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col gap-2 bg-[#05040d]">
            <TokenInput
              type="number"
              step={step}
              min={step}
              max={gsoBalanceDetails.numTokens}
              placeholder="0.0"
              token={gsoBalanceDetails.metadata}
              value={stakeValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const inputStr = event.target.value;
                setStakeValue(
                  parseNumber(inputStr, gsoBalanceDetails.baseAtoms)
                );
              }}
              onMaxClick={() => {
                setStakeValue(gsoBalanceDetails.numTokens.toString());
              }}
            />

            <Button
              className={isDisabled ? "bg-gray-400" : undefined}
              disabled={isDisabled}
              onClick={handleUnstakeClick}
            >
              Unstake
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
