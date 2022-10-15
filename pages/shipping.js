import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function ShippingScreen() {
  const {
      handleSubmit,
      register,
      formState: { errors },
      setValue,
    } = useForm(),
    { state, dispatch } = useContext(Store),
    { cart } = state,
    { shippingAddress } = cart,
    router = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Datos de envío">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Dirección de envío</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Nombre completo</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Ingrese su nombre completo",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Dirección</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="address"
            {...register("address", {
              required: "Ingrese su dirección",
              minLength: {
                value: 3,
                message: "La dirección debe tener más de dos caracteres",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">Ciudad</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="city"
            {...register("city", {
              required: "Ingrese su ciudad",
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Código postal</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="postalCode"
            {...register("postalCode", {
              required: "Ingrese su código postal",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">País</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="country"
            {...register("country", {
              required: "Ingrese su país",
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="rounded py-2 px-4 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500">
            Continuar
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
