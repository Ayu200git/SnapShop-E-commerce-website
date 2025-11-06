import { useAppDispatch, useAppSelector } from "../serviceProvider/hook";
import { removeFromCart, clearCart } from "../serviceProvider/slices/cartSlice";
import { buttonClass } from "../theme";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="p-8 container-xl">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between surface rounded-xl px-4 py-3">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.title} className="w-16 h-16" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p>
                  ${item.price} × {item.quantity}
                </p>
              </div>
            </div>
            <button onClick={() => dispatch(removeFromCart(item.id))} className={buttonClass("danger")}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
        <button onClick={() => dispatch(clearCart())} className={buttonClass("danger")}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
