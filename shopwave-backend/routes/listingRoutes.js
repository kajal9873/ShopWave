const express = require("express");
const router = express.Router();
const {
  createListing,
  getMyListings,
  getApprovedListings,
  getAllListings,
  updateListingStatus,
  deleteListing,
} = require("../controllers/listingController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getApprovedListings);
router.post("/", protect, createListing);
router.get("/my", protect, getMyListings);
router.get("/admin", protect, admin, getAllListings);
router.put("/:id/status", protect, admin, updateListingStatus);
router.delete("/:id", protect, deleteListing);

module.exports = router;
