import axios from "axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function LoginScreen() {
  const { data: session } = useSession(),
    router = useRouter(),
    { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const ahhh = await axios.post(
        "https://node-mailer-six.vercel.app/email",
        { email: email }
      );
      console.log(ahhh);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  // const sendEmail = async (e) => {
  //   // e.preventDefault();
  //   // console.log(e);
  //   console.log("hola");
  //   try {
  //     const email = e.target.email.value;
  //     const result = await axios.post(
  //       "https://node-mailer-six.vercel.app/email",
  //       { email: email }
  //     );
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <Layout title="Crear cuenta">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-6xl">Crear cuenta</h1>
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
            {...register("email", {
              required: "Por favor ingrese su email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Por favor ingrese un email correcto",
              },
            })}
            className="w-full rounded border p-2  outline-none ring-indigo-300  focus:ring"
            id="email"
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
              required: "Por favor ingrese una contraseña",
              minLength: {
                value: 6,
                message: "La contraseña debe ser mayor a 5 caracteres",
              },
            })}
            className="w-full rounded border p-2  outline-none ring-indigo-300 focus:ring"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            className="w-full rounded border p-2  outline-none ring-indigo-300 focus:ring"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Por favor confirme su contraseña",
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

        <div className="mb-4 ">
          <button
            // onSubmit={(e) => sendEmail(e)}
            className="rounded py-2 px-4 shadow-lg outline-none bg-teal-300 hover:bg-teal-400  active:bg-teal-500"
          >
            Registrar
          </button>
        </div>
        <div className="mb-4 ">
          {/* Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || "/"}`}>Register</Link> */}
        </div>
      </form>
      {/* // eslint-disable-next-line @next/next/no-sync-scripts
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
      ></script>
      
      <script>
      emailjs.init("JPSxm6eCN2FuF2qVU") 
      
      </script>
      */}
    </Layout>
  );
}
