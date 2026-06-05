import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/ordersSlice";
import { Spinner, Badge, EmptyState } from "../components/common";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Spinner /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {myOrders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="Place your first order and it will appear here"
          action={<Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Start Shopping</Link>}
        />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-sm">₹{order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Badge status={order.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <span className={`text-xs font-medium ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
                    {order.isPaid ? "✓ Paid" : "✗ Unpaid"}
                  </span>
                </div>
              </div>

              {/* Order items preview */}
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {order.orderItems.slice(0, 4).map((item) => (
                  <div key={item._id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }} />
                    <span className="text-xs text-gray-700 max-w-24 truncate">{item.name}</span>
                    <span className="text-xs text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <div className="flex items-center px-3 py-2 text-xs text-gray-400">
                    +{order.orderItems.length - 4} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
