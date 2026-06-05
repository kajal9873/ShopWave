const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // Build line items for Stripe
  // Note: Stripe images must be public HTTPS URLs - skip local/relative paths
  const lineItems = order.orderItems.map((item) => {
    const isPublicUrl = item.image && item.image.startsWith("https://");
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          // Only include images if they are public HTTPS URLs
          ...(isPublicUrl && { images: [item.image] }),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    };
  });

  // Add shipping if applicable
  if (order.shippingPrice > 0) {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Shipping & Handling" },
        unit_amount: Math.round(order.shippingPrice * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/payment-result?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-result?cancelled=true`,
    metadata: {
      orderId: orderId.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json({ success: true, sessionId: session.id, url: session.url });
});

// @desc    Verify payment after redirect
// @route   GET /api/payment/verify/:sessionId
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

  if (session.payment_status === "paid") {
    const order = await Order.findById(session.metadata.orderId);

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "processing";
      order.paymentResult = {
        stripePaymentId: session.payment_intent,
        status: "paid",
        paidAt: new Date(),
      };
      await order.save();
    }

    res.json({ success: true, paid: true, order });
  } else {
    res.json({ success: true, paid: false });
  }
});

module.exports = { createCheckoutSession, verifyPayment };
