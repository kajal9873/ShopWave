import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">🛒 ShopWave</h3>
          <p className="text-sm text-gray-400">Your one-stop shop for everything. Quality products, fast delivery.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {["Electronics", "Clothing", "Books", "Home", "Sports"].map((c) => (
              <li key={c}>
                <Link to={`/?category=${c}`} className="hover:text-white transition-colors">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} ShopWave. Built with MERN Stack.
      </div>
    </footer>
  );
}
