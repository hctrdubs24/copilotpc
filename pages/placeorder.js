import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Layout from "../components/Layout";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import { toast } from "react-toastify";
import { Store } from "../utils/Store";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store),
    { cart } = state,
    { cartItems, shippingAddress, paymentMethod } = cart,
    round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15,
    taxPrice = round2(itemsPrice * 0.1),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice),
    router = useRouter();

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Realizar pedido">
      <CheckoutWizard activeStep={3} />
      {/* <h1 className="mb-4 text-xl">Realizar pedido</h1> */}
      {cartItems.length === 0 ? (
        <>
          <h3>El carrito está vacio 😥</h3>
          <h2 className="underline underline-offset-1 text-4xl">
            <Link href="/">Vamos a comprar 😀</Link>
          </h2>
        </>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 mt-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="mb-3  block   rounded-lg border border-gray-200  shadow-md  p-5">
              <h2 className="mb-2 text-lg">Dirección de envío</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <div className="rounded w-16 py-2 px-3 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500">
                <Link href="/shipping">Editar</Link>
              </div>
            </div>
            <div className="mb-5 block rounded-lg border border-gray-200  shadow-md  p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              <div className="rounded w-16 py-2 px-3   shadow-lg outline-none bg-teal-300 hover:bg-teal-400 active:bg-teal-500">
                <Link href="/payment">Editar</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Productos</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Producto</th>
                    <th className="p-5 text-right">Cantidad</th>
                    <th className="p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
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
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="rounded w-16 py-2 px-3 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500">
                <Link href="/cart">Editar</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 font-bold text-lg">Resumen del pedido</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Productos</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Impuestos</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Envío</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="rounded py-2 px-4 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500;
                    w-full"
                  >
                    {loading ? "Loading..." : "Realizar pedido"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
