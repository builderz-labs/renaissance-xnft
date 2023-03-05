import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Tabs } from "./Tabs";

export function Layout() {
  return (
    <div className="h-screen w-screen max-w-[425px] flex flex-col">
      <Header />
      {/* Set background color here */}
      <main className="flex-1 p-2 bg-[#104664]"> 
        <Outlet />
      </main>
      <Tabs />
    </div>
  );
}
