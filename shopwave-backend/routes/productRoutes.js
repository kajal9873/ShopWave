const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/categories", getCategories);
router.get("/", getProducts);
router.post("/", protect, admin, createProduct);

router.get("/:id", getProductById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
