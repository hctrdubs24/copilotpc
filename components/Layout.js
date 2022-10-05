import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { Store } from "../utils/Store";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store),
    { cart } = state;

  return (
    <>
      <Head>
        <title>{title ? `${title} - Copilot PC` : `Copilot PC`}</title>
        <meta name="description" content="Copilot PC Web Site uwu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-10 justify-between shadow-md bg-black text-slate-50 py-11">
            <Link href={"/"}>
              <a className="text-4xl font-bold hover:underline underline-offset-8">Copilot PC</a>
            </Link>
            <div>
              <Link href={"/cart"}>
                <a className="p-2">
                  Carrito
                  {cart.cartItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </a>
              </Link>
              <Link href={"/login"}>
                <a className="p-2">Ingresar</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-3 px-3">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          Copilot PC &#169;
        </footer>
      </section>
    </>
  );
}
