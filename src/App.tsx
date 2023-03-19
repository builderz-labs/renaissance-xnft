import buffer from "buffer";
globalThis.Buffer = buffer.Buffer;

import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'tw-elements';
import { Layout } from './components/Layout';
import { queryClient } from './client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

import ErrorPage from './pages/ErrorPage';
import { HomePage, loader as homeLoader } from './pages/HomePage';
import { NftsPage } from './pages/NftsPage';
import { ProjectPage, loader as projectLoader } from './pages/project';
import { RankingPage, loader as rankingLoader} from './pages/RankingPage';

declare global {
  interface Window {
    xnft: any;
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: () => homeLoader(queryClient),
          },
          {
            path: 'NFTs',
            element: <NftsPage />,
          },
          {
            path: 'project/:id',
            element: <ProjectPage />,
            loader: ({ params }) => projectLoader(queryClient, { params }),
          },
          {
            path: 'Ranking',
            element: <RankingPage />,
            loader: () => rankingLoader(queryClient)
          },
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
        <ReactQueryDevtools />
        <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
      </QueryClientProvider>
    </ConnectionProvider>
  );
}

export default App;
