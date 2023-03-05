import buffer from "buffer";
globalThis.Buffer = buffer.Buffer;

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "tw-elements";
import { Layout } from "./components/Layout";
import { HomePage, loader as homeLoader } from "./pages/HomePage";
import { GsoPage, loader as gsoLoader } from "./pages/GsoPage";
import { BalancePage, loader as balanceLoader } from "./pages/BalancePage";
import {
  GsoBalancePage,
  loader as gsoBalanceLoader,
} from "./pages/GsoBalancePage";
import {
  StakingOptionBalancePage,
  loader as soBalanceLoader,
} from "./pages/StakingOptionBalancePage";
import ErrorPage from "./pages/ErrorPage";
import { NftsPage, loader as nftsLoader } from "./pages/NftsPage";
import { queryClient } from "./client";
import "./App.css";

declare global {
  interface Window {
    xnft: any;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          // { index: true, element: <HomePage />, loader: homeLoader },
          // { path: "gso/:name", element: <GsoPage />, loader: gsoLoader },
          {
            path: "nfts",
            element: <NftsPage />,
            loader: nftsLoader,
          },
          // {
          //   path: "balance/gso/:name",
          //   element: <GsoBalancePage />,
          //   loader: gsoBalanceLoader,
          // },
          // {
          //   path: "balance/so/:name",
          //   element: <StakingOptionBalancePage />,
          //   loader: soBalanceLoader,
          // },
        ],
      },
    ],
  },
]);

function App() {  
  return (
    <ConnectionProvider endpoint={import.meta.env.VITE_HELIUS_RPC_PROXY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConnectionProvider>
  );
}

export default App;
