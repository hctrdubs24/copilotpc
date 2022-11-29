import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
// import User from "../../models/User";
// import db from "../../utils/db";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  // order/:id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter(),
    orderId = query.id,
    [
      {
        loading,
        error,
        order,
        successPay,
        loadingPay,
        loadingDeliver,
        successDeliver,
      },
      dispatch,
    ] = useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "MXN",
          },
        });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("El pedido se ha pago correctamente");
        senConfirmationEmail();
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("El pedido ha sido enviado");
      // aquí
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  }

  const senConfirmationEmail = async () => {
    const orderDataEmail = {
      order: order,
      email: session.user.email,
      orderId: orderId,
    };
    console.log(orderDataEmail);
    await axios.post(
      "https://node-mailer-six.vercel.app/orderd",
      orderDataEmail
    );
  };

  return (
    <Layout title={`Pedido ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Pedido ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:gap-5 md:grid-cols-1">
          <div className="overflow-x-auto md:col-span-3">
            <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md p-5">
              <h2 className="mb-2 text-lg">Dirección de envío</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">
                  Enviado a {deliveredAt}
                </div>
              ) : (
                <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">
                  No envíado
                </div>
              )}
            </div>

            <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">
                  Pagado en: {paidAt}
                </div>
              ) : (
                <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">
                  No se ha realizado el pago
                </div>
              )}
            </div>

            <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Artículos del pedido</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Artículo</th>
                    <th className="    p-5 text-right">Cantidad</th>
                    <th className="  p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
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
            </div>
          </div>
          <div className="lg:col-span-1 sm:col-span-3">
            <div className="mb-5 block rounded-lg border border-gray-200 shadow-md p-3 ">
              <h2 className="mb-2 text-lg">Resumen del pedido</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Artículos</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{" "}
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
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div
                        className="w-full 
                      "
                      >
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <div>Loading...</div>}
                    <button
                      className="rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500 w-full"
                      onClick={deliverOrderHandler}
                    >
                      Enviar pedido
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <button onClick={() => senConfirmationEmail()}>test</button>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
