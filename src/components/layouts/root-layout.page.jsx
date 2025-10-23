import Navigation from "../Navigation";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function RootLayout() {
  const { user, isLoaded } = useUser();

  // Set user ID globally for API authentication
  useEffect(() => {
    console.log("Auth status:", { isLoaded, user: !!user, userId: user?.id });
    if (isLoaded && user) {
      localStorage.setItem("userId", user.id);
      console.log("User ID set in localStorage:", user.id);
    } else if (isLoaded && !user) {
      localStorage.removeItem("userId");
      console.log("User ID removed from localStorage");
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
