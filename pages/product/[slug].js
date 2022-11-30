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
      <div className="grid lg:grid-cols-5 md:grid-cols-3 md:gap-3">
        <div className="md:col-span-1">
          <Image
            src={product.image}
            alt={product.name}
            width={140}
            height={140}
            layout="responsive"
            className="rounded-md"
           
          ></Image>
        </div>
        <div className="lg:col-span-2" style={{maxHeight: '150px'}}>
          <ul className="rounded-lg border border-gray-200 shadow-lg my-5 p-5">
            <li>
              <h1 className="text-4xl font-bold mb-4 pt-2">{product.name}</h1>
            </li>
            <li className="mb-1">Categoria: {product.category}</li>
            <li className="mb-1">Marca: {product.brand}</li>
            {/* <li>
              {product.rating} of {product.numReviews} reviews
            </li> */}
            <li className="mb-1">Descripción: {product.description}</li>
          </ul>
        </div>
        <div className="lg:col-span-2 md:col-span-2 sm:col-span-1">
          <div className="my-5 p-5  block   rounded-lg border border-gray-200 shadow-lg">
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
              className="rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500"
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
