import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import { placeOrder } from "../store/slices/ordersSlice";
import { EmptyState } from "../components/common";
import { useState } from "react";
import { toast } from "react-toastify";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 40;

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "India" });
  const [step, setStep] = useState(1); // 1 = cart, 2 = shipping

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shippingCost = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user) { navigate("/login"); return; }
    if (!shipping.address || !shipping.city || !shipping.postalCode) {
      toast.error("Please fill all shipping fields");
      return;
    }

    const result = await dispatch(placeOrder({
      orderItems: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      shippingAddress: shipping,
    }));

    if (!result.error) {
      // Redirect to Stripe
      const orderId = result.payload._id;
      const payRes = await fetch(`${process.env.REACT_APP_API_URL}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const payData = await payRes.json();
      if (payData.url) {
        dispatch(clearCart());
        window.location.href = payData.url;
      } else {
        toast.error("Payment session failed");
      }
    } else {
      toast.error(result.payload);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products to get started"
          action={<Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Cart", "Shipping", "Payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i ? "bg-blue-600 text-white" : step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? "font-semibold" : "text-gray-500"}`}>{s}</span>
            {i < 2 && <span className="text-gray-300 mx-1">→</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items / Shipping */}
        <div className="lg:col-span-2 space-y-3">
          {step === 1 ? (
            <>
              {items.map((item) => (
                <div key={item.product} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }} />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="font-medium text-sm text-gray-900 hover:text-blue-600 line-clamp-2">{item.name}</Link>
                    <p className="text-blue-600 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))} className="px-3 py-2 hover:bg-gray-100">-</button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: Math.min(item.stock, item.quantity + 1) }))} className="px-3 py-2 hover:bg-gray-100">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => dispatch(removeFromCart(item.product))} className="text-red-400 text-xs hover:text-red-600 mt-1">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={() => dispatch(clearCart())} className="text-sm text-red-400 hover:text-red-600 mt-2">Clear Cart</button>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} placeholder="123 Main St, Apartment 4B" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} placeholder="Mumbai" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} placeholder="400001" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
              </div>
              {subtotal < SHIPPING_THRESHOLD && <p className="text-xs text-gray-400">Add ₹{(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping</p>}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {step === 1 ? (
              <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Proceed to Shipping →
              </button>
            ) : (
              <div className="space-y-2">
                <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {loading ? "Processing..." : "Pay with Stripe →"}
                </button>
                <button onClick={() => setStep(1)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">← Back to Cart</button>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
