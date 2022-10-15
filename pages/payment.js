import Layout from "../components/Layout";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import { toast } from "react-toastify";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""),
    { state, dispatch } = useContext(Store),
    { cart } = state,
    { shippingAddress, paymentMethod } = cart,
    router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error(
        "Necesita seleccionar un método de pago para continuar"
      );
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Método de pago">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {
          //["PayPal", "Stripe", "CashOnDelivery"]
          ["PayPal"].map((payment) => (
            <div key={payment} className="mb-4">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                type="radio"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />

              <label className="p-2" htmlFor={payment}>
                {payment}
              </label>
            </div>
          ))
        }
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="rounded py-2 px-4 shadow-lg outline-none bg-slate-300 hover:bg-slate-400  active:bg-slate-500"
          >
            Regresar
          </button>
          <button className="rounded py-2 px-4 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500">
            Continuar
          </button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
