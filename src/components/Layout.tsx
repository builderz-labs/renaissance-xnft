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
      <main className="flex-1 p-2  text-black dark:text-white">
        <Outlet />
      </main>
      <Tabs />
    </div>
  );
}
