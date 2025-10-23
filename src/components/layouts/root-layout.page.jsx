import Navigation from "../Navigation";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function RootLayout() {
  const { user, isLoaded } = useUser();

  // Set user ID globally for API authentication
  useEffect(() => {
    if (isLoaded && user) {
      localStorage.setItem("userId", user.id);
    } else if (isLoaded && !user) {
      localStorage.removeItem("userId");
    }
  }, [isLoaded, user]);

  return (
    <>
      <Navigation />
      <Outlet />
      <Toaster />
    </>
  );
}

export default RootLayout;
