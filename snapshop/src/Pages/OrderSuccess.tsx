import { Link } from "react-router-dom";
import { useAppSelector } from "../serviceProvider/hook";

const OrderSuccess = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  const lastOrder = orders[orders.length - 1];

  if (!lastOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p>No recent order found.</p>
        <Link
          to="/products"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-semibold text-green-600 mb-2">
        🎉 Order Placed Successfully!
      </h2>
      <p>Your order ID: <strong>{lastOrder.id}</strong></p>
      <p>Estimated delivery: {estimatedDate.toDateString()}</p>

      <div className="mt-6 space-x-4">
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/products"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-amber-100 dark:text-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
