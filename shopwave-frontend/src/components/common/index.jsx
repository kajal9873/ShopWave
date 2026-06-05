import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-12 w-12" : "h-8 w-8";
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`${s} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}

export function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 border border-red-200 text-red-700",
    success: "bg-green-50 border border-green-200 text-green-700",
    info: "bg-blue-50 border border-blue-200 text-blue-700",
  };
  return (
    <div className={`${styles[type]} rounded-lg px-4 py-3 text-sm my-3`}>
      {message}
    </div>
  );
}

export function StarRating({ rating, numReviews }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-lg ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
      ))}
      {numReviews !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({numReviews})</span>
      )}
    </div>
  );
}

export function Badge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export function EmptyState({ icon = "📭", title, message, action }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {action}
    </div>
  );
}
