
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { GlobalChatWidget } from "./chat/GlobalChatWidget";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => { }} />
        <main className="flex-1 bg-gray-800">
          <Outlet />
        </main>
        <GlobalChatWidget />
      </div>
    </div>
  );
};
