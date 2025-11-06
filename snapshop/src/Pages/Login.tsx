import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../serviceProvider/hook";
import { login } from "../serviceProvider/slices/authSlice";
import { buttonClass } from "../theme";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      dispatch(
        login({
          user: {
            name: email.split("@")[0],
            email,
          },
          token: "fake-fakestoreapi-token-12345",
        })
      );

      navigate("/products");
    } else {
      alert("Please enter valid credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="surface rounded-2xl px-8 pt-8 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center brand">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="input mb-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="input mb-4"
          required
        />

        <button type="submit" className={`${buttonClass("primary")} w-full`}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
