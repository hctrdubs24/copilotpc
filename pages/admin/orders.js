import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Panel de administrador">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-5 sm:grid-cols-1">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="hover:underline hover:underline-offset-4">
                  Panel de administrador
                </a>
              </Link>
            </li>
            <li className="font-bold hover:underline hover:underline-offset-4">
              <Link href="/admin/orders">Pedidos</Link>
            </li>
            <li className="hover:underline hover:underline-offset-4">
              <Link href="/admin/products">Productos</Link>
            </li>
            <li className="hover:underline hover:underline-offset-4">
              <Link href="/admin/users">Usuarios</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Pedidos</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">Usuarios</th>
                    <th className="p-5 text-left">Fecha</th>
                    <th className="p-5 text-left">Total</th>
                    <th className="p-5 text-left">Estado de pago</th>
                    <th className="p-5 text-left">Estado de envío</th>
                    <th className="p-5 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "Usuario eliminado"}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">${order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : "No pagado"}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? `${order.deliveredAt.substring(0, 10)}`
                          : "No enviado"}
                      </td>
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <a className="hover:underline hover:underline-offset-4">
                            Detalles
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };
