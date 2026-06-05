import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { StarRating } from "../common";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      quantity: 1,
    }));
    toast.success("Added to cart! 🛒");
  };

  const badgeColors = {
    Bestseller: "bg-orange-500",
    "Top Rated": "bg-purple-500",
    Sale: "bg-red-500",
    New: "bg-green-500",
    Premium: "bg-blue-700",
  };

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-52 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.category)}`;
            }}
          />

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-2 left-2 ${badgeColors[product.badge] || "bg-gray-500"} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {product.badge}
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Low stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-gray-400 mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.rating} numReviews={product.numReviews} />

          <div className="mt-auto pt-3">
            {/* Price row */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Savings */}
            {discount > 0 && (
              <p className="text-xs text-green-600 font-medium mb-2">
                You save ₹{(product.originalPrice - product.price).toLocaleString()}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
