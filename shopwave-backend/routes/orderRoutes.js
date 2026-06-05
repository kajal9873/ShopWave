const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);

router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderPaid);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
