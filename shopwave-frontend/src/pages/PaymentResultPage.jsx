import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";
import { Spinner } from "../components/common";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (success && sessionId) {
      setVerifying(true);
      api.get(`/payment/verify/${sessionId}`)
        .then((res) => { if (res.data.paid) setVerified(true); })
        .finally(() => setVerifying(false));
    }
  }, [success, sessionId]);

  if (verifying) return <div className="max-w-lg mx-auto px-4 py-20 text-center"><Spinner size="lg" /><p className="mt-4 text-gray-500">Verifying payment...</p></div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Your order has been placed and is being processed.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">View My Orders</Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">Your payment was cancelled. Your cart is still saved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cart" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Back to Cart</Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return null;
}
