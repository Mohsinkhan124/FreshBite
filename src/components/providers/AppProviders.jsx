"use client";

import { Toaster } from "react-hot-toast";
import ReduxProvider from "./ReduxProvider";
import AuthBootstrap from "./AuthBootstrap";
import CartWishlistBootstrap from "./CartWishlistBootstrap";

/**
 * Single client boundary at the root of the tree.
 *
 * Only this wrapper is a Client Component — the `children` passed into it
 * from the Server Component layout stay server-rendered. This keeps the
 * client bundle limited to providers rather than the whole page.
 */
export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <AuthBootstrap />
      <CartWishlistBootstrap />
      {children}

      <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          duration: 3200,
          className:
            "!rounded-2xl !bg-white !text-ink-900 !shadow-lift !border !border-cream-200 !text-sm !font-medium !px-4 !py-3",
          success: {
            iconTheme: { primary: "oklch(0.66 0.19 150)", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "oklch(0.60 0.21 25)", secondary: "#fff" },
          },
        }}
      />
    </ReduxProvider>
  );
}
