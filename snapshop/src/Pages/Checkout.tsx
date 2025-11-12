import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../serviceProvider/hook";
import { placeOrder } from "../serviceProvider/slices/orderSlice";
import { clearCart } from "../serviceProvider/slices/cartSlice";
import { buttonClass } from "../theme";
import type { OrderItem, OrderStatus } from "../types/Order"; 

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user); 

  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your shipping address!");
      return;
    }

    const orderPayload = {
      userId: user?.id || "guest-user", 
      items: cartItems.map<OrderItem>((item) => ({
        productId: String(item.id),
        name: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      address,
      paymentMethod,
      status: "pending" as OrderStatus,
    };

    try {
      await dispatch(placeOrder(orderPayload)).unwrap();
      dispatch(clearCart());
      navigate("/order-success");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter full address..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Cash on Delivery</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-1">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="font-semibold text-right mt-2">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className={buttonClass("primary") + " w-full mt-4"}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
