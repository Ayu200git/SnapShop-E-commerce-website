interface Props {
  product: any;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.title}
        className="grid h-40 mx-auto mb-3 object-contain"
      />
      <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
      <p className="text-gray-600 mb-2">${product.price}</p>
      <button className="bg-blue-500 text-white w-full py-1 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
