import HomePage from "@/components/_pages/homepage/HomePage";
import { SidebarProvider } from "@/context/SidebarContext";
import AppHeaderHome from "@/layout/AppHeaderHome";

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppHeaderHome />
        <HomePage />
      </SidebarProvider>
    </div>
  );
}
