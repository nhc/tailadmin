import { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

export const useActiveMenu = (activePath: string) => {
  const { setForcedActivePath } = useSidebar();

  useEffect(() => {
    // Set the forced active path when the component mounts
    setForcedActivePath(activePath);

    // Clean up when the component unmounts
    return () => {
      setForcedActivePath(null);
    };
  }, [activePath, setForcedActivePath]);
};
