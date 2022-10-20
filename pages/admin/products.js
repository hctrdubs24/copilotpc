import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { useRouter } from "next/router";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  const router = useRouter();

  const createHandler = async () => {
    if (!window.confirm("¿Está seguro de continuar?")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Producto creado correctamente");
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm("¿Está seguro de continuar?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Producto eliminado correctamente");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Productos">
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
            <li className=" hover:underline hover:underline-offset-4">
              <Link href="/admin/orders">Pedidos</Link>
            </li>
            <li className=" font-bold hover:underline hover:underline-offset-4">
              <Link href="/admin/products">Productos</Link>
            </li>
            <li className="hover:underline hover:underline-offset-4">
              <Link href="/admin/users">Usuarios</Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Productos</h1>
            {loadingDelete && <div>Eliminando producto...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500"
            >
              {loadingCreate ? "Loading" : "Agregar nuevo producto"}
            </button>
          </div>
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
                    <th className="p-5 text-left">Nombre</th>
                    <th className="p-5 text-left">Precio</th>
                    <th className="p-5 text-left">Categoría</th>
                    <th className="p-5 text-left">Disponibilidad</th>
                    {/* <th className="p-5 text-left">RATING</th> */}
                    <th className="p-5 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className=" p-5 ">{product._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{product.name}</td>
                      <td className=" p-5 ">${product.price}</td>
                      <td className=" p-5 ">{product.category}</td>
                      <td className=" p-5 ">{product.countInStock}</td>
                      {/* <td className=" p-5 ">{product.rating}</td> */}
                      <td className=" p-5 flex flex-row">
                        <div className="hover:underline hover:underline-offset-4">
                          <Link href={`/admin/product/${product._id}`}>
                            Editar
                          </Link>
                        </div>
                        &nbsp;
                        <div>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="text-red-600 hover:underline hover:underline-offset-4"
                          >
                            Eliminar
                          </button>
                        </div>
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

AdminProdcutsScreen.auth = { adminOnly: true };
