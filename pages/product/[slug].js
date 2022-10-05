import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import data from "../../utils/data";
import { useContext } from "react";
import { Store } from "../../utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store),
    router = useRouter(),
    { query } = useRouter(),
    { slug } = query,
    product = data.products.find((x) => x.slug === slug);

  if (!product) {
    return <h1>Producto no encontrado</h1>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === slug),
      quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert(
        "Lo sentimos, este producto ya no se encuentra disponible por el momento"
      );
      return;
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
          <div className="card p-5 rounded-md shadow-sm shadow-lg">
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
