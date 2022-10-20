import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users`);
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

  const deleteHandler = async (userId) => {
    if (!window.confirm("¿Está seguro de continuar?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Usuarios">
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
            <li className="hover:underline hover:underline-offset-4">
              <Link href="/admin/products">Productos</Link>
            </li>
            <li className="font-bold hover:underline hover:underline-offset-4">
              <Link href="/admin/users">Usuarios</Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Usuarios</h1>
          {loadingDelete && <div>Eliminando...</div>}
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
                    <th className="p-5 text-left">Email</th>
                    <th className="p-5 text-left">Administrador</th>
                    <th className="p-5 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className={
                        user.isAdmin
                          ? "border-b bg-teal-100 text-green-700"
                          : "border-b"
                      }
                    >
                      <td className=" p-5 ">{user._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{user.name}</td>
                      <td className=" p-5 ">{user.email}</td>
                      <td className=" p-5 ">{user.isAdmin ? "SI" : "NO"}</td>
                      <td className=" p-5 ">
                        {/* <Link href={`/admin/user/${user._id}`} passHref>
                          <a
                            type="button"
                            className=" hover:underline hover:underline-offset-4"
                          >
                            Editar
                          </a>
                        </Link>
                        &nbsp; */}
                        {user.isAdmin ? (
                          ""
                        ) : (
                          <button
                            type="button"
                            className="text-red-600 hover:underline hover:underline-offset-4"
                            onClick={() => deleteHandler(user._id)}
                          >
                            Eliminar
                          </button>
                        )}
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

AdminUsersScreen.auth = { adminOnly: true };
export default AdminUsersScreen;
