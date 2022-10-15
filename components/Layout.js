import Head from "next/head";
import Link from "next/link";
import DropdownLink from "../components/DropdownLink";
import { Menu } from "@headlessui/react";
import { Store } from "../utils/Store";
import { useSession, signOut } from "next-auth/react";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession(),
    { state, dispatch } = useContext(Store),
    { cart } = state,
    [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({
      type: "CART_RESET",
    });
    signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Copilot PC` : `Copilot PC`}</title>
        <meta name="description" content="Copilot PC Web Site uwu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <section className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-10 justify-between shadow-md bg-black text-slate-50 py-11">
            <Link href={"/"}>
              <a className="text-4xl font-bold hover:underline underline-offset-8">
                Copilot PC
              </a>
            </Link>
            <div>
              <Link href={"/cart"}>
                <a className="p-2">
                  Carrito
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as={"div"} className="relative z-10 inline-block ">
                  <Menu.Button className={"text-teal-300"}>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items
                    className={
                      "absolute right-0 w-56 origin-top-right bg-slate-600 shadow-lg"
                    }
                  >
                    <Menu.Item>
                      <DropdownLink
                        href={"/profile"}
                        className="flex p-2 hover:bg-gray-200 hover:text-slate-500"
                      >
                        Perfil
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="flex p-2 hover:bg-gray-200 hover:text-slate-500"
                        href={"/order-history"}
                      >
                        Historial de compras
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        className="flex p-2 hover:bg-gray-200 hover:text-slate-500"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
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
