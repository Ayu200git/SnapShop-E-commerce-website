import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../serviceProvider/hook";
import { logout } from "../serviceProvider/slices/authSlice";
import logo from "../assets/snapshop.png";
import { buttonClass, badgeClass, getTheme, toggleTheme } from "../theme";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState(getTheme());

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="w-full flex items-center justify-between px-3 py-1.5 whitespace-nowrap flex-nowrap">
        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden ${buttonClass("ghost")}`}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link to="/" className="flex items-center gap-1.5 shrink-0 w-1/3">
          <img src={logo} alt="SnapShop Logo" className="object-contain" style={{ width: "20px", height: "20px" }} />
          <span className="text-lg brand">SnapShop</span>
        </Link>

        <div className="hidden md:flex w-1/3 items-center justify-center gap-6 font-medium min-w-0">
          <Link to="/products" className="hover:opacity-80 transition">Home</Link>
          <Link to="/products" className="hover:opacity-80 transition">Products</Link>
        </div>

        <div className="hidden md:flex items-center gap-4 font-medium w-1/3 justify-end">
          <Link to="/cart" className="relative inline-flex items-center hover:opacity-80 transition">
            <ShoppingCart size={18} className="mr-1" />
            Cart
            {cartCount > 0 && (<span className={`${badgeClass("danger")} absolute -top-2 -right-3`}>{cartCount}</span>)}
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className={buttonClass("danger")}>
              Logout
            </button>
          ) : (
            <Link to="/login" className={buttonClass("primary")}>
              Login
            </Link>
          )}
          <button
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={() => setMode(toggleTheme())}
            className={buttonClass("ghost")}
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden surface px-6 py-3 space-y-3">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block hover:opacity-80">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block hover:opacity-80">Products</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:opacity-80">
            <ShoppingCart size={20} />
            Cart
            {cartCount > 0 && (<span className={`${badgeClass("danger")} ml-2`}>{cartCount}</span>)}
          </Link>
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full btn btn-danger">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center btn btn-primary">Login</Link>
          )}
          <button
            aria-label="Toggle theme"
            onClick={() => { setMode(toggleTheme()); setMenuOpen(false); }}
            className="w-full btn btn-ghost"
          >
            {mode === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
