import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import data from "../../utils/data";

export default function ProductScreen() {
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <h1>Produto no encontrado</h1>;
  }
  return (
    <Layout title={product.name}>
      <div className="py-2">
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
        <div>
          <div className="card p-5 rounded-md shadow-sm">
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
            <button className="primary-button rounded-md w-full bg-teal-400 py-2 border-end">
              Agregar a carrito
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
