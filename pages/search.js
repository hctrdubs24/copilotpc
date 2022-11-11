import { XCircleIcon } from "@heroicons/react/outline";
import {
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
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

const prices = [
  {
    name: "$1.00 a $50.00",
    value: "1-50",
  },
  {
    name: "$51.00 a $200.00",
    value: "51-200",
  },
  {
    name: "$201.00 a $1000.00",
    value: "201-1000",
  },
];

export default function Search(props) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
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
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
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
  // eslint-disable-next-line no-unused-vars
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
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
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-1">
          <section className="col-start-2 col-span-3">
            {products.length === 0 ? "No" : countProducts} resultados
            {query !== "all" && query !== "" && " : " + query}
            {category !== "all" && " : " + category}
            {brand !== "all" && " : " + brand}
            {price !== "all" && " : Price " + price}
            {(query !== "all" && query !== "") ||
            category !== "all" ||
            brand !== "all" ||
            price !== "all" ? (
              <button
                className="align-middle"
                onClick={() => router.push("/search")}
              >
                <XCircleIcon className="h-5 w-5"></XCircleIcon>
              </button>
            ) : null}
          </section>

          <section className="flex flex-col gap-3">
            <Grid item md={1}>
              <List>
                <ListItem>
                  <Box className={"w-full"}>
                    <Typography>Categorias</Typography>
                    <Select
                      fullWidth
                      value={category}
                      onChange={categoryHandler}
                    >
                      <MenuItem value="all">Todas las categorias</MenuItem>
                      {categories &&
                        categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                    </Select>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box className={"w-full"}>
                    <Typography>Marcas</Typography>
                    <Select value={brand} onChange={brandHandler} fullWidth>
                      <MenuItem value="all">Todas las marcas</MenuItem>
                      {brands &&
                        brands.map((brand) => (
                          <MenuItem key={brand} value={brand}>
                            {brand}
                          </MenuItem>
                        ))}
                    </Select>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box className={"w-full"}>
                    <Typography>Precios</Typography>
                    <Select value={price} onChange={priceHandler} fullWidth>
                      <MenuItem value="all">Todos los precios</MenuItem>
                      {prices.map((price) => (
                        <MenuItem key={price.value} value={price.value}>
                          {price.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box className={"w-full"}>
                    <Typography>Ordenar por: </Typography>
                    <Select value={sort} onChange={sortHandler} fullWidth>
                      <MenuItem value="featured">Populares</MenuItem>
                      <MenuItem value="lowest">Precio: Menor a Mayor</MenuItem>
                      <MenuItem value="highest">Precio: Mayor a Menor</MenuItem>
                      <MenuItem value="newest">Nuevos productos</MenuItem>
                    </Select>
                  </Box>
                </ListItem>
              </List>
            </Grid>
          </section>

          <section className="col-span-3">
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
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct("category");
  const brands = await Product.find().distinct("brand");
  const productDocs = await Product.find(
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
  await db.disconnect();

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
