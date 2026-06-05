import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, addReview } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Spinner, Alert, StarRating, Badge } from "../components/common";
import { toast } from "react-toastify";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      quantity: qty,
    }));
    toast.success("Added to cart! 🛒");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to review"); return; }
    setReviewLoading(true);
    const result = await dispatch(addReview({ id, data: reviewForm }));
    if (!result.error) {
      toast.success("Review added!");
      dispatch(fetchProductById(id));
      setReviewForm({ rating: 5, comment: "" });
    } else {
      toast.error(result.payload);
    }
    setReviewLoading(false);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><Alert type="error" message={error} /></div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Main product info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 h-80 lg:h-96">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">{product.name}</h1>
          <StarRating rating={product.rating} numReviews={product.numReviews} />

          <p className="text-3xl font-bold text-gray-900 mt-4 mb-2">₹{product.price.toLocaleString()}</p>

          <div className="flex items-center gap-2 mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">✓ In Stock ({product.stock} left)</span>
            ) : (
              <span className="text-red-500 text-sm font-medium">✗ Out of Stock</span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Actions */}
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-medium text-gray-700">Qty:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-lg">-</button>
                  <span className="px-4 py-2 font-medium text-sm">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 text-lg">+</button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold mb-6">Customer Reviews ({product.numReviews})</h2>

        {product.reviews?.length === 0 ? (
          <p className="text-gray-500 text-sm mb-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {product.reviews?.map((r) => (
              <div key={r._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write a review */}
        {user && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={reviewLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
