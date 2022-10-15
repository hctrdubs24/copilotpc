import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store),
    router = useRouter();

  if (!product) {
    return (
      <Layout title={"Producto no encontrado"}>Producto no encontrado</Layout>
    );
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug),
      quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error(
        "Lo sentimos, este producto ya no se encuentra disponible por el momento"
      );
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2 mb-3 w-44 hover:underline underline-offset-8">
        <Link href="/">Menú principal</Link>
      </div>
      <div className="grid md:grid-cols-5 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            className="rounded-md"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Categoria: {product.category}</li>
            <li>Marcar: {product.brand}</li>
            {/* <li>
              {product.rating} of {product.numReviews} reviews
            </li> */}
            <li>Descripción: {product.description}</li>
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="card p-5 rounded-md  shadow-lg">
            <div className="mb-2 flex justify-between">
              <div>Precio:</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Estatus:</div>
              <div>
                {product.countInStock > 0 ? "Disponible" : "No disponible"}
              </div>
            </div>
            <button
              className="primary-button rounded-md w-full bg-teal-400 py-2 border-end"
              onClick={addToCartHandler}
            >
              Agregar a carrito
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context,
    { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
