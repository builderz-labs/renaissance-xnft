import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Tabs } from "./Tabs";

export function Layout() {
  return (
    <div className="h-screen w-screen max-w-[425px] flex flex-col">
      <Header />
      {/* Set background color here */}
      <main className="flex-1 p-2 bg-gray-100 dark:bg-[#0C0B0B] text-black dark:text-white">
        <Outlet />
      </main>
      <Tabs />
    </div>
  );
}
