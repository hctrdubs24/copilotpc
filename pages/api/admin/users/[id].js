import User from "../../../../models/User";
import db from "../../../../utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Necesita inicio de sesión del administrador");
  }

  if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    if (user.email === "admin@example.com") {
      return res
        .status(400)
        .send({ message: "No se permite eliminar a administradores" });
    }
    await user.remove();
    await db.disconnect();
    res.send({ message: "Usuario eliminado" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Usuario no encontrado" });
  }
};

export default handler;
