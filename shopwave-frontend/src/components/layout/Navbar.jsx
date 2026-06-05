import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-600 shrink-0">🛒 ShopWave</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 text-sm">🔍</button>
          </div>
        </form>

        {/* Marketplace link */}
        <Link to="/marketplace" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 shrink-0">
          ♻️ <span>Used Market</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative shrink-0">
          <span className="text-2xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
          )}
        </Link>

        {/* User menu */}
        {user ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block">{user.name}</span>
              <span>▼</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">My Profile</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                <div className="border-t border-gray-100 my-1" />
                <Link to="/sell" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 text-purple-700">♻️ Sell a Product</Link>
                <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 text-purple-700">My Listings</Link>
                {user.role === "admin" && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <Link to="/admin/products" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 text-blue-700">Admin: Products</Link>
                    <Link to="/admin/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 text-blue-700">Admin: Orders</Link>
                    <Link to="/admin/listings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 text-blue-700">Admin: C2C Listings</Link>
                  </>
                )}
                <div className="border-t border-gray-100 my-1" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Login</Link>
            <Link to="/register" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
