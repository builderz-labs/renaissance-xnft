import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Tabs } from "./Tabs";
import styled from "styled-components";

const myMain = styled.main`

`

export function Layout() {
  return (
    <div className="h-screen w-screen max-w-[425px] flex flex-col px-2">
      <Header />
      {/* Set background color here */}
      <main className="flex-1 p-2  text-white">
        <Outlet />
      </main>
      <Tabs />
      <div className="flex flex-row items-center justify-center gap-2 text-[8px] font-light my-2 py-8">
        <p>Powered by</p>
        <a href="https://builderz.dev" target='_blank' rel='noreferrer'>
          <img src="/img/builderz.svg" alt="builderz logo" />
        </a>
      </div>
    </div>
  );
}
