import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./serviceProvider/hook";
import { restoreSession } from "./serviceProvider/slices/authSlice";
import Login from "./Pages/Login";
import Products from "./Pages/Products";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./Pages/cart";
import Layout from "./components/Layout";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



