// import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import { StoreProvider } from "../utils/Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider, useSession } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter(),
    { status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push("/unauthorized?message=login required");
      },
    });
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

export default MyApp;
