import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./serviceProvider/hook";
import { restoreSession } from "./serviceProvider/slices/authSlice";
import Login from "./Pages/Login";
import Products from "./Pages/Products";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./Pages/cart";
import Layout from "./components/Layout";
import Wishlist from "./Pages/Wishlist";
import ProductDetails from "./Pages/ProductDetails";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/DashBoard";
// import Checkout from "./Pages/Checkout";
// import OrderSuccess from "./Pages/OrderSuccess";
// import MyOrders from "./Pages/MyOrders";
import Register from "./Pages/Register";
import AdminDashboard from "./Pages/AdminDashboard";
import UserList from "./Pages/User";
import ManageProducts from "./Pages/manageProducts";
import ManageCarts from "./Pages/manageCart";
 

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  
  return (
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Products/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products/> } />
            <Route path="/cart" element={<Cart />}/>
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/user" element={<UserList/>} />
            <Route path="/manageproducts" element={<ManageProducts/>} />
            <Route path="/managecart" element={<ManageCarts/>} />
            {/* <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} /> */}
            {/* <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} /> */}
            {/* <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} /> */}
            <Route path="/admin" element={<AdminDashboard/>} />
          </Routes>
        </Layout>  
    </Router>
  );
}

export default App;





