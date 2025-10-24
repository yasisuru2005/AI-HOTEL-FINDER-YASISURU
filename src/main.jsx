import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import RootLayout from "./components/layouts/root-layout.page.jsx";
import HomePage from "./pages/home.page.jsx";
import HotelDetailsPage from "./pages/hotel-details.page.jsx";
import HotelsPage from "./pages/hotels.page.jsx";
import MyAccountPage from "./pages/my-account.page.jsx";
import NotFoundPage from "./pages/not-found.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";

import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./lib/store";

import { ClerkProvider } from "@clerk/clerk-react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import "./index.css";
import ProtectLayout from "./components/layouts/protect.layout.jsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route element={<ProtectLayout />}>
                  <Route path="/hotels/:_id" element={<HotelDetailsPage />} />
                  <Route path="/my-account" element={<MyAccountPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>
);
