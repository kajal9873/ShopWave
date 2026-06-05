const express = require("express");
const router = express.Router();
const { upload, cloudinary } = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post(
  "/",
  protect,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }
    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  })
);

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Private
router.delete(
  "/:public_id",
  protect,
  asyncHandler(async (req, res) => {
    const public_id = decodeURIComponent(req.params.public_id);
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, message: "Image deleted" });
  })
);

module.exports = router;
