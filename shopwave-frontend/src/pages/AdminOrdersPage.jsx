import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/slices/ordersSlice";
import { Spinner, Badge } from "../components/common";
import { toast } from "react-toastify";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { allOrders, loading, totalRevenue } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const handleStatus = async (id, status) => {
    const result = await dispatch(updateOrderStatus({ id, status }));
    if (!result.error) toast.success("Status updated!");
    else toast.error(result.payload);
  };

  const stats = {
    total: allOrders.length,
    paid: allOrders.filter((o) => o.isPaid).length,
    delivered: allOrders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin: Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.total, color: "bg-blue-50 text-blue-700" },
          { label: "Total Revenue", value: `₹${totalRevenue?.toLocaleString() || 0}`, color: "bg-green-50 text-green-700" },
          { label: "Paid Orders", value: stats.paid, color: "bg-purple-50 text-purple-700" },
          { label: "Delivered", value: stats.delivered, color: "bg-orange-50 text-orange-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm opacity-75 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status", "Update"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.orderItems.length} items</td>
                    <td className="px-4 py-3 text-sm font-bold">₹{order.totalPrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
                        {order.isPaid ? "✓ Paid" : "✗ Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge status={order.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
