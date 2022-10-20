import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/Layout";

export default function ProfileScreen() {
  const { data: session } = useSession(),
    {
      handleSubmit,
      register,
      getValues,
      setValue,
      formState: { errors },
    } = useForm();

  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Perfil actualizado satisfactoriamente");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Perfil">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Actualizar perfil</h1>

        <div className="mb-4">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="name"
            autoFocus
            {...register("name", {
              required: "Por favor ingrese su nombre",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="email"
            {...register("email", {
              required: "Por favor ingrese su email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Por favor ingrese un email valido",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Contraseña</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            type="password"
            id="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "La contraseña debe ser mayor a 5 caracteres",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "La contraseña debe ser mayor a 5 caracteres",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">La contraseña no coincide</div>
            )}
        </div>
        <div className="mb-4">
          <button className="rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500">
            Actualizar perfil
          </button>
        </div>
      </form>
    </Layout>
  );
}

ProfileScreen.auth = true;
