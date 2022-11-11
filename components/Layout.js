import Head from "next/head";
import Link from "next/link";
import DropdownLink from "../components/DropdownLink";
import { Menu } from "@headlessui/react";
import { Store } from "../utils/Store";
import { useSession, signOut } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

export default function Layout({ title, children }) {
  const router = useRouter();
  const { status, data: session } = useSession(),
    { state, dispatch } = useContext(Store),
    { cart } = state,
    [cartItemsCount, setCartItemsCount] = useState(0);

  const [query, setQuery] = useState("");

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  // const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    
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
          <nav className="flex h-12 items-center px-10 justify-around shadow-md bg-black text-slate-50 py-11 min-w-full ">
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                className={"p-0 text-gray-100"}
                onClick={sidebarOpenHandler}
              >
                <MenuIcon className={"transform"} />
              </IconButton>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Comprar por categoría</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>

            <Link href={"/"}>
              <a className="text-4xl font-bold hover:underline underline-offset-8">
                Copilot PC
              </a>
            </Link>
            <div className="flex justify-center">
              <div className="mb-3 xl:w-96">
                <div className="input-group relative flex flex-wrap items-stretch w-full mt-4">
                  <form
                    action=""
                    className="flex flex-row"
                    onSubmit={submitHandler}
                  >
                    <input
                      type="search"
                      className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Búscar"
                      aria-label="Search"
                      aria-describedby="button-addon3"
                      onChange={queryChangeHandler}
                    />
                    <button
                      className="btn inline-block px-3 py-2 border-2 border-teal-600 text-teal-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
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
