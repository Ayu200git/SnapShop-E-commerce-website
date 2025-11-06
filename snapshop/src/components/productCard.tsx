import { useAppDispatch } from "../serviceProvider/hook";
import { addToCart } from "../serviceProvider/slices/cartSlice";
import type { Product } from "../types";
import { buttonClass } from "../theme";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {

  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    console.log("add to cart");
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <div className="card p-4 rounded-lg transition h-full flex flex-col">
      <img
        src={product.image}
        alt={product.title}
        className="grid h-40 mx-auto mb-3 object-contain"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
        <p className="muted mb-3">${product.price}</p>
      </div>
      <button onClick={handleAddToCart} className={`${buttonClass("primary")} w-full mt-auto`}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
