import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createListing } from "../store/slices/listingsSlice";
import { Alert } from "../components/common";
import { toast } from "react-toastify";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"];
const CONDITIONS = [
  { value: "Like New", desc: "Barely used, no visible wear", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "Good", desc: "Minor signs of use, fully functional", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "Fair", desc: "Visible wear but works perfectly", color: "text-orange-600 bg-orange-50 border-orange-200" },
];

export default function SellProductPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.listings);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "Electronics",
    condition: "Good", image: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const price = Number(form.price) || 0;
  const commission = Math.round(price * 10 / 100);
  const earnings = price - commission;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createListing({ ...form, price: Number(form.price) }));
    if (!result.error) setSubmitted(true);
    else toast.error(result.payload);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Listing Submitted!</h1>
        <p className="text-gray-500 mb-2">Your product has been sent for admin review.</p>
        <p className="text-gray-400 text-sm mb-8">It will go live once approved (usually within 24 hours).</p>
        <div className="flex gap-3 justify-center">
          <Link to="/seller/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">View My Listings</Link>
          <Link to="/marketplace" className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Browse Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sell Your Product</h1>
        <p className="text-gray-500 text-sm">List your used item and earn money. We charge only 10% commission per sale.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <Alert type="error" message={error} />
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. iPhone 12 Pro 256GB Space Gray"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows={4} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your product — age, usage, any defects, accessories included..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Price (₹) *</label>
                  <input required type="number" min="1" value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 15000"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <div className="space-y-2">
                  {CONDITIONS.map((c) => (
                    <label key={c.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.condition === c.value ? c.color : "border-gray-200 hover:bg-gray-50"}`}>
                      <input type="radio" name="condition" value={c.value}
                        checked={form.condition === c.value}
                        onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                        className="shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{c.value}</p>
                        <p className="text-xs text-gray-500">{c.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image URL input with preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Photo URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://i.imgur.com/your-image.jpg"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Live preview */}
                {form.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 h-48 bg-gray-50">
                    <img src={form.image} alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                )}

                {/* How to get image URL */}
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1.5">📸 How to add your photo:</p>
                  <ol className="text-xs text-blue-700 space-y-1">
                    <li>1. Go to <a href="https://uploadimgur.com" target="_blank" rel="noreferrer" className="underline font-medium">uploadimgur.com</a> (free, no account needed)</li>
                    <li>2. drag & drop the product photo</li>
                    <li>3. You will get a url → "Copy the image url"</li>
                    <li>4. Paste the link above</li>
                  </ol>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? "Submitting..." : "Submit for Review →"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">💰 Your Earnings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Your price</span><span>₹{price.toLocaleString() || "—"}</span></div>
              <div className="flex justify-between text-red-500"><span>Platform fee (10%)</span><span>- ₹{commission.toLocaleString() || "—"}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-green-600 text-base">
                <span>You receive</span><span>₹{earnings.toLocaleString() || "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-semibold text-blue-900 mb-3">How it works</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              {["Submit your listing","Admin reviews within 24hrs","Listing goes live","Buyer purchases","You receive payment (minus 10%)"].map((s, i) => (
                <li key={i} className="flex gap-2"><span className="font-bold">{i+1}.</span>{s}</li>
              ))}
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-semibold text-amber-900 mb-2">💡 Tips to sell faster</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>✓ Add a clear product photo</li>
              <li>✓ Be honest about condition</li>
              <li>✓ Set competitive price</li>
              <li>✓ Write detailed description</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
