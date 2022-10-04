/* eslint-disable-next-line @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function ProductItem({ product }) {
  return (
    <div className="card">
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
        <button
          className="primary-button rounded-md bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400  active:bg-teal-500"
          type="button"
        >
          Agregar a Carrito
        </button>
      </div>
    </div>
  );
}
