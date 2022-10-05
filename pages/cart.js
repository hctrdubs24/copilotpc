import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import { useContext } from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function CartScreen() {
  const router = useRouter(),
    { state, dispatch } = useContext(Store),
    {
      cart: { cartItems },
    } = state,
    removeItemHandler = (item) => {
      dispatch({ type: "CART_REMOVE_ITEM", payload: item });
    },
    updateCartHandler = (item, qty) => {
      const quantity = Number(qty);
      dispatch({
        type: "CART_ADD_ITEM",
        payload: { ...item, quantity },
      });
    };

  return (
    <Layout title="Carrito de compra">
      <h1 className="mb-4 text-xl">Carrito de compra</h1>
      {cartItems.length === 0 ? (
        <>
          <h3>El carrito está vacio 😥</h3>
          <h2 className="underline underline-offset-1 text-4xl">
            <Link href="/">Vamos a comprar 😀</Link>
          </h2>
        </>
      ) : (
        <section className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Artículo</th>
                  <th className="p-5 text-right">Cantidad</th>
                  <th className="p-5 text-right">Precio</th>
                  <th className="p-5">¿Qué hacer?🤔</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/shipping")}
                  className="primary-button w-full bg-teal-300 hover:bg-teal-400  active:bg-teal-500 rounded
                  py-2"
                >
                  Proceder con el pago 🛒
                </button>
              </li>
            </ul>
          </div>
        </section>
      )}
    </Layout>
  );
}
