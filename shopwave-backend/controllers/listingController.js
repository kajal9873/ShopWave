const asyncHandler = require("express-async-handler");
const Listing = require("../models/listingModel");

// @desc    Create a new listing (seller)
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  const { name, description, price, category, condition, image } = req.body;

  if (!name || !description || !price || !category || !condition) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const commissionRate = 10;
  const sellerEarnings = price - (price * commissionRate) / 100;
  const platformCommission = (price * commissionRate) / 100;

  const listing = await Listing.create({
    seller: req.user._id,
    name,
    description,
    price,
    category,
    condition,
    image: image || "",
    commissionRate,
    sellerEarnings,
    platformCommission,
  });

  res.status(201).json({ success: true, listing });
});

// @desc    Get my listings (seller)
// @route   GET /api/listings/my
// @access  Private
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, listings });
});

// @desc    Get all approved listings (public marketplace)
// @route   GET /api/listings
// @access  Public
const getApprovedListings = asyncHandler(async (req, res) => {
  const { category, condition, sort } = req.query;
  const query = { status: "approved", isSold: false };

  if (category) query.category = category;
  if (condition) query.condition = condition;

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const listings = await Listing.find(query)
    .populate("seller", "name")
    .sort(sortOption);

  res.json({ success: true, listings });
});

// @desc    Get all listings (admin)
// @route   GET /api/listings/admin
// @access  Private/Admin
const getAllListings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};

  const listings = await Listing.find(query)
    .populate("seller", "name email")
    .sort({ createdAt: -1 });

  // Total commission earned
  const commissionData = await Listing.aggregate([
    { $match: { isSold: true } },
    { $group: { _id: null, totalCommission: { $sum: "$platformCommission" } } },
  ]);

  res.json({
    success: true,
    listings,
    totalCommission: commissionData[0]?.totalCommission || 0,
  });
});

// @desc    Approve or reject listing (admin)
// @route   PUT /api/listings/:id/status
// @access  Private/Admin
const updateListingStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error("Listing not found");
  }

  listing.status = status;
  if (adminNote) listing.adminNote = adminNote;
  await listing.save();

  res.json({ success: true, listing });
});

// @desc    Delete my listing (seller)
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error("Listing not found");
  }

  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  await listing.deleteOne();
  res.json({ success: true, message: "Listing removed" });
});

module.exports = {
  createListing,
  getMyListings,
  getApprovedListings,
  getAllListings,
  updateListingStatus,
  deleteListing,
};
