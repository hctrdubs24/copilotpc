import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Unauthorized() {
  const router = useRouter(),
    { message } = router.query;
  var message2 = "";

  if (message === "login required") {
    message2 = "Necesita iniciar sesión para continuar";
  }

  return (
    <Layout title="Página no autorizada">
      <h1 className="text-xl">Acceso negado</h1>
      {message && <div className="mb-4 text-red-500">{message2}</div>}
    </Layout>
  );
}
