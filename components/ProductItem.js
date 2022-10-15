/* eslint-disable-next-line @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import Image from "next/image";

// eslint-disable-next-line no-unused-vars
export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card shadow-lg">
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            width={540}
            height={540}
            layout="responsive"
            className="rounded"
          ></Image>
          {/* <img
            src={product.image}
            alt={product.name}
            className="rounded shadow"
          /> */}
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        {/* <button
          className="primary-button rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500"
          type="button"
          onClick={addToCartHandler}
        >
          Agregar a Carrito
        </button> */}

        <button
          className="primary-button rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500"
          type="button"
        >
          <Link href={`/product/${product.slug}`}>Ver detalles</Link>
        </button>
      </div>
    </div>
  );
}
