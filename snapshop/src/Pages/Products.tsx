import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../serviceProvider/hook";
import { fetchProducts } from "../serviceProvider/slices/productSlice";
import ProductCard from "../components/productCard";

const Products = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container-xl px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
