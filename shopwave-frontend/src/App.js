import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store from "./store/store";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProtectedRoute } from "./components/common";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminListingsPage from "./pages/AdminListingsPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import MarketplacePage from "./pages/MarketplacePage";
import SellProductPage from "./pages/SellProductPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/payment-result" element={<PaymentResultPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />

              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/sell" element={<ProtectedRoute><SellProductPage /></ProtectedRoute>} />
              <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>} />

              <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/listings" element={<ProtectedRoute adminOnly><AdminListingsPage /></ProtectedRoute>} />

              <Route path="*" element={
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">404</div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Page not found</h2>
                  <a href="/" className="text-blue-600 hover:underline">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="light" />
      </Router>
    </Provider>
  );
}

export default App;
