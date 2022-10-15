import db from "../utils/db";
import Layout from "../components/Layout";
import Product from "../models/Product";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { Store } from "../utils/Store";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error(
        "Lo sentimos, este producto ya no se encuentra disponible por el momento"
      );
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Producto agregado al carrito");
  };

  return (
    <>
      <Layout title={"Home"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
