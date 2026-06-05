import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../store/slices/productsSlice";
import ProductCard from "../components/product/ProductCard";
import { Spinner, Alert } from "../components/common";

const CATEGORY_ICONS = {
  Electronics: "💻",
  Clothing: "👕",
  Books: "📚",
  Home: "🏠",
  Sports: "⚽",
  Beauty: "✨",
  Other: "📦",
};

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, categories, loading, error, pages, total } = useSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: "newest",
    page: 1,
  });

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;
    params.page = filters.page;
    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  useEffect(() => {
    const s = searchParams.get("search");
    const c = searchParams.get("category");
    setFilters((f) => ({ ...f, search: s || "", category: c || "", page: 1 }));
  }, [searchParams]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              🎉 Free shipping on orders above ₹500
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Everything You Need,<br/>At Best Prices 🛒</h1>
            <p className="text-blue-100 text-sm">15+ premium products | Genuine brands | Fast delivery</p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="bg-white bg-opacity-15 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">15+</p>
              <p className="text-xs text-blue-100">Products</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex flex-wrap gap-4 mt-6">
          {[
            { icon: "🔒", text: "Secure Payments" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "↩️", text: "Easy Returns" },
            { icon: "⭐", text: "Top Rated Products" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 bg-white bg-opacity-15 rounded-lg px-3 py-1.5 text-sm">
              <span>{b.icon}</span>
              <span className="font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <button
          onClick={() => setFilter("category", "")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${!filters.category ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}
        >
          🛍️ All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter("category", c)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${filters.category === c ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}
          >
            {CATEGORY_ICONS[c]} {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setFilter("category", "")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${!filters.category ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    🛍️ All Categories
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setFilter("category", c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${filters.category === c ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      {CATEGORY_ICONS[c]} {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
              <select
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Deals box */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3 text-center">
              <p className="text-lg">🔥</p>
              <p className="text-xs font-bold text-orange-700 mt-1">Today's Deals</p>
              <p className="text-xs text-orange-600 mt-0.5">Up to 50% off!</p>
            </div>

            {(filters.search || filters.category) && (
              <button
                onClick={() => { setFilters({ search: "", category: "", sort: "newest", page: 1 }); setSearchParams({}); }}
                className="mt-4 w-full text-sm text-red-500 hover:text-red-700 py-1"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-600">
              {total > 0 ? (
                <span><span className="font-semibold text-gray-900">{total} products</span> found</span>
              ) : "No products"}
              {filters.search && <span className="text-blue-600 font-medium"> for "{filters.search}"</span>}
              {filters.category && <span className="text-blue-600 font-medium"> in {filters.category}</span>}
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Free shipping above ₹500
            </div>
          </div>

          <Alert type="error" message={error} />

          {loading ? (
            <Spinner size="lg" />
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm">Try changing your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={filters.page === 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))} className={`px-4 py-2 border rounded-lg text-sm ${filters.page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button disabled={filters.page === pages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Why ShopWave section */}
      <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">Why Shop With Us?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: "🏷️", title: "Best Prices", desc: "We price-match and offer genuine discounts on every product" },
            { icon: "🚚", title: "Fast Delivery", desc: "Free shipping above ₹500. Express delivery available" },
            { icon: "✅", title: "100% Genuine", desc: "All products are verified authentic from authorized sellers" },
            { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free return policy on all orders" },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
