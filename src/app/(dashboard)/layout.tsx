import { Outfit } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useServerUser } from "@/lib/hooks/useServerUser";
import { redirect } from "next/navigation";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication server-side
  const { authUser, error } = await useServerUser();

  if (error || !authUser) {
    redirect("/auth/signin");
  }

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
