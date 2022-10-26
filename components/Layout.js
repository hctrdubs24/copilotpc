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

      <section className="flex min-h-screen flex-col justify-between min-w-max">
        <header>
          <nav className="flex h-12 items-center px-10 justify-around shadow-md bg-black text-slate-50 py-11 min-w-full">
            <Link href={"/"}>
              <a className="text-4xl font-bold hover:underline underline-offset-8">
                Copilot PC
              </a>
            </Link>
            <div className="flex justify-center">
              <div className="mb-3 xl:w-96">
                <div className="input-group relative flex flex-wrap items-stretch w-full mt-4">
                  <form action="" className="flex flex-row">
                    <input
                      type="search"
                      className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="button-addon3"
                    />
                    <button
                      className="btn inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                      type="button"
                      id="button-addon3"
                    >
                      Búscar
                    </button>
                  </form>
                </div>
              </div>
            </div>

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
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="flex p-2 hover:bg-gray-200 hover:text-slate-500"
                          href="/admin/dashboard"
                        >
                          Panel de administrador
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        href="#"
                        className="flex p-2 hover:bg-gray-200 hover:text-slate-500"
                        onClick={logoutClickHandler}
                      >
                        Cerrar sesión
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

        <main className="container m-auto mt-3 px-6 pb-10">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          Copilot PC &#169;
        </footer>
      </section>
    </>
  );
}
