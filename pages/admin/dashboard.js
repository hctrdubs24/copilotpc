import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: "Ventas",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };
  return (
    <Layout title="Panel de administrador">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-5 sm:grid-cols-1">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="font-bold hover:underline hover:underline-offset-4">
                  Panel de administrador
                </a>
              </Link>
            </li>
            <li className="hover:underline hover:underline-offset-4">
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
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Panel de administrador</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md m-5 p-5">
                  <p className="text-3xl">${summary.ordersPrice} </p>
                  <p>Ventas</p>
                  <div className="hover:underline hover:underline-offset-4">
                    <Link href="/admin/orders">Ver ventas</Link>
                  </div>
                </div>
                <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md m-5 p-5">
                  <p className="text-3xl">{summary.ordersCount} </p>
                  <p>Pedidos</p>
                  <div className="hover:underline hover:underline-offset-4">
                    <Link href="/admin/orders">Ver pedidos</Link>
                  </div>
                </div>
                <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md m-5 p-5">
                  <p className="text-3xl">{summary.productsCount} </p>
                  <p>Productos</p>
                  <div className="hover:underline hover:underline-offset-4">
                    <Link href="/admin/products">Ver productos</Link>
                  </div>
                </div>
                <div className="mb-5  block   rounded-lg border border-gray-200  shadow-md m-5 p-5">
                  <p className="text-3xl">{summary.usersCount} </p>
                  <p>Usuarios</p>
                  <div className="hover:underline hover:underline-offset-4">
                    <Link href="/admin/users">Ver usuarios</Link>
                  </div>
                </div>
              </div>
              <h2 className="text-xl">Reporte de ventas</h2>
              <Bar
                options={{
                  legend: { display: true, position: "right" },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
