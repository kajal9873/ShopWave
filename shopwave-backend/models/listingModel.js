const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["Like New", "Good", "Fair"],
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    // Commission system
    commissionRate: {
      type: Number,
      default: 10, // 10%
    },
    sellerEarnings: {
      type: Number,
      default: 0,
    },
    platformCommission: {
      type: Number,
      default: 0,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    soldAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
