import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function LoginScreen() {
  const { data: session } = useSession(),
    router = useRouter(),
    { redirect } = router.query;

  useEffect(() => {
    if (session?.user) router.push(redirect || "/");
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) toast.error(result.error);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-6xl">Inicio de sesión </h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Por favor ingrese su email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Por favor ingrese un correo válido",
              },
            })}
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "Por favor ingrese su contraseña",
              minLength: {
                value: 6,
                message: "La contraseña debe tener más de 5 caracteres",
              },
            })}
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button py-2 px-4 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500 rounded-sm">
            Ingresar
          </button>
        </div>
        <div className="mb-4 ">
          ¿Aún no tienes una cuenta?
          <div className="w-fit hover:underline underline-offset-8">
            <Link href={`/register?redirect=${redirect || "/"}`}>
              ¡Registrate aquí!
            </Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
