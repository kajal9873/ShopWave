import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchListings } from "../store/slices/listingsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Spinner, StarRating } from "../components/common";
import { toast } from "react-toastify";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"];
const CONDITIONS = ["All", "Like New", "Good", "Fair"];

const CONDITION_COLORS = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Fair": "bg-orange-100 text-orange-700",
};

export default function MarketplacePage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.listings);
  const [filters, setFilters] = useState({ category: "", condition: "", sort: "newest" });

  useEffect(() => {
    const params = {};
    if (filters.category && filters.category !== "All") params.category = filters.category;
    if (filters.condition && filters.condition !== "All") params.condition = filters.condition;
    if (filters.sort) params.sort = filters.sort;
    dispatch(fetchListings(params));
  }, [dispatch, filters]);

  const handleAddToCart = (listing) => {
    dispatch(addToCart({
      product: listing._id,
      name: listing.name,
      image: listing.image || "",
      price: listing.price,
      stock: 1,
      quantity: 1,
      isC2C: true,
    }));
    toast.success("Added to cart! 🛒");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full">♻️ Used Marketplace</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Buy & Sell Second-Hand</h1>
        <p className="text-purple-100 text-sm mb-4">Genuine products from verified sellers. Save money, reduce waste.</p>
        <Link to="/sell" className="inline-block px-5 py-2.5 bg-white text-purple-700 font-semibold rounded-xl text-sm hover:bg-purple-50 transition-colors">
          + Sell Your Product
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20 space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <button onClick={() => setFilters((f) => ({ ...f, category: c === "All" ? "" : c }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${(filters.category === (c === "All" ? "" : c)) ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Condition</p>
              <ul className="space-y-1">
                {CONDITIONS.map((c) => (
                  <li key={c}>
                    <button onClick={() => setFilters((f) => ({ ...f, condition: c === "All" ? "" : c }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${(filters.condition === (c === "All" ? "" : c)) ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort</p>
              <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600"><span className="font-semibold">{items.length}</span> items available</p>
          </div>

          {loading ? <Spinner size="lg" /> : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to sell something!</p>
              <Link to="/sell" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Sell Your Product</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((listing) => (
                <div key={listing._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.name} className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${listing.category}`; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">📦</div>
                    )}
                    {/* Condition badge */}
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${CONDITION_COLORS[listing.condition]}`}>
                      {listing.condition}
                    </span>
                    {/* C2C badge */}
                    <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      ♻️ Used
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-1">{listing.category}</p>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">{listing.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{listing.description}</p>

                    {listing.seller?.name && (
                      <p className="text-xs text-gray-400 mb-3">Sold by: <span className="font-medium text-gray-600">{listing.seller.name}</span></p>
                    )}

                    <div className="mt-auto">
                      <p className="text-lg font-bold text-gray-900 mb-2">₹{listing.price.toLocaleString()}</p>
                      <button onClick={() => handleAddToCart(listing)}
                        className="w-full py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
