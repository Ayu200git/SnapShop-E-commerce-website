import { useAppSelector } from "../serviceProvider/hook";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { orders } = useAppSelector((state) => state.orders);

  if (orders.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">You have no orders yet.</p>
        <Link
          to="/products"
          className="text-blue-600 hover:underline font-medium"
        >
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Order #{order.id}</h2>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">Placed on: {order.date}</p>
            <p className="text-sm mb-2">
              <strong>Address:</strong> {order.address}
            </p>
            <p className="text-sm mb-4">
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            <div className="border-t pt-3 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain rounded"
                    />
                    <span>{item.title}</span>
                  </div>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between font-medium">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
