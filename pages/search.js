import { XCircleIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";

const PAGE_SIZE = 12;

export default function Search(props) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();
  const {
    query = "All",
    category = "All",
    brand = "All",
    price = "All",
    // eslint-disable-next-line no-unused-vars
    sort = "featured",
  } = router.query;

  // eslint-disable-next-line no-unused-vars
  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) router.query = page;
    if (searchQuery) router.searchQuery = searchQuery;
    if (sort) router.sort = sort;
    if (category) router.category = category;
    if (brand) router.brand = brand;
    if (price) router.price = price;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

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
      <Layout title={"Búsqueda"}>
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
          <section className="col-start-2 col-span-2">
            {products.length === 0 ? "No" : countProducts} Resultados
            {query !== "All" && query !== "" && " : " + query}
            {category !== "All" && " : " + category}
            {price !== "All" && " Precio : " + price}
            {brand !== "All" && " : " + brand}{" "}
            {(query !== "All" && query !== "") ||
            category !== "All" ||
            price !== "All" ||
            brand !== "All" ? (
              <button className="align-middle" onClick={() => router.push("/search")}>
                <XCircleIcon className="h-5 w-5"></XCircleIcon>
              </button>
            ) : null}
          </section>
          <section className="col-span-1">
            <label htmlFor="category">
              Categorias
              <select value={category} onChange={categoryHandler}>
                <option value="All">Todos los productos</option>
                {categories &&
                  categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </label>
          </section>
          <section className="col-span-2">
            <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
              {products.map((product) => (
                <ProductItem
                  product={product}
                  key={product.slug}
                  addToCartHandler={addToCartHandler}
                ></ProductItem>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE,
    page = query.page || 1,
    category = query.category || "",
    brand = query.brand || "",
    price = query.price || "",
    sort = query.sort || "",
    searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "All"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};

  const categoryFilter = category && category !== "All" ? { category } : {},
    brandFilter = brand && brand !== "All" ? { brand } : {},
    priceFilter =
      price && price !== "All"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {},
    order =
      sort === "featured"
        ? { featured: -1 }
        : sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
        ? { price: -1 }
        : sort === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

  const categories = await Product.find().distinct("category"),
    brands = await Product.find().distinct("brand"),
    productDocs = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
      },
      "-reviews"
    )
      .sort(order)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
  });

  await db.connect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
