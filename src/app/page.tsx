import HomePage from "@/components/_pages/homepage/HomePage";
import GeneralSearch from "@/components/_pages/homepage/GeneralSearch";
import { SidebarProvider } from "@/context/SidebarContext";
import AppHeaderHome from "@/layout/AppHeaderHome";

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppHeaderHome />
        <HomePage />
        <GeneralSearch />
      </SidebarProvider>
    </div>
  );
}
