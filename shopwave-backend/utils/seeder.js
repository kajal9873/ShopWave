const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/userModel");
const Product = require("../models/productModel");

const users = [
  { name: "Admin User", email: "admin@shopwave.com", password: "admin123", role: "admin" },
  { name: "Test User", email: "user@shopwave.com", password: "user123", role: "user" },
];

// Images stored locally in frontend/public/images/
const BASE = "/images";

const products = [
  {
    name: "Apple iPhone 15 (128GB)",
    description: "Latest iPhone with A16 Bionic chip, 48MP main camera, Dynamic Island, USB-C connector, and all-day battery life.",
    price: 79999, originalPrice: 89999, category: "Electronics",
    image: `${BASE}/iphone15.jpg`,
    stock: 25, rating: 4.8, numReviews: 120, badge: "Bestseller",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation, 30-hour battery life, multipoint connection and crystal clear calls.",
    price: 24999, originalPrice: 29999, category: "Electronics",
    image: `${BASE}/sony-headphones.jpg`,
    stock: 40, rating: 4.7, numReviews: 89, badge: "Top Rated",
  },
  {
    name: "MacBook Air M2 (8GB/256GB)",
    description: "Supercharged by M2 chip. 13.6-inch Liquid Retina display, 1080p camera, MagSafe charging, fanless design.",
    price: 114900, originalPrice: 119900, category: "Electronics",
    image: `${BASE}/macbook-air.jpg`,
    stock: 15, rating: 4.9, numReviews: 200, badge: "Premium",
  },
  {
    name: "Nike Air Max 270",
    description: "Nike's largest heel Air unit for all-day comfort. Lightweight engineered mesh upper for breathability.",
    price: 12995, originalPrice: 14995, category: "Clothing",
    image: `${BASE}/nike-airmax.jpg`,
    stock: 60, rating: 4.5, numReviews: 350, badge: "Sale",
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: "Classic slim-fit stretch denim jeans. Sits below the waist, fitted through thigh and leg.",
    price: 3499, originalPrice: 4499, category: "Clothing",
    image: `${BASE}/levis-jeans.jpg`,
    stock: 80, rating: 4.3, numReviews: 180, badge: "Sale",
  },
  {
    name: "Atomic Habits - James Clear",
    description: "#1 NYT Bestseller. Build good habits, break bad ones. Over 15 million copies sold worldwide.",
    price: 499, originalPrice: 799, category: "Books",
    image: `${BASE}/atomic-habits.jpg`,
    stock: 200, rating: 4.9, numReviews: 1200, badge: "Bestseller",
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. 3 million+ copies sold.",
    price: 399, originalPrice: 599, category: "Books",
    image: `${BASE}/psych-money.jpg`,
    stock: 150, rating: 4.7, numReviews: 890, badge: "New",
  },
  {
    name: "Instant Pot Duo 7-in-1 (6L)",
    description: "Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer in one.",
    price: 7999, originalPrice: 9999, category: "Home",
    image: `${BASE}/instant-pot.jpg`,
    stock: 35, rating: 4.6, numReviews: 420, badge: "Sale",
  },
  {
    name: "Premium Yoga Mat 6mm",
    description: "Non-slip TPE yoga mat with carry strap. Eco-friendly, sweat-resistant, perfect for home workouts.",
    price: 1499, originalPrice: 1999, category: "Sports",
    image: `${BASE}/yoga-mat.jpg`,
    stock: 100, rating: 4.5, numReviews: 250, badge: "New",
  },
  {
    name: "Adjustable Dumbbell Set 5-25kg",
    description: "Space-saving home gym dumbbells. Replaces 9 pairs, quick-change mechanism, comfortable grip.",
    price: 15999, originalPrice: 19999, category: "Sports",
    image: `${BASE}/dumbbells.jpg`,
    stock: 18, rating: 4.7, numReviews: 130, badge: "Bestseller",
  },
  {
    name: "Samsung 55\" 4K Smart TV",
    description: "Crystal UHD 4K display, HDR, Alexa & Google assistant built-in, AirSlim design, Universal Guide.",
    price: 54999, originalPrice: 69999, category: "Electronics",
    image: `${BASE}/samsung-tv.jpg`,
    stock: 12, rating: 4.5, numReviews: 310, badge: "Sale",
  },
  {
    name: "Neutrogena Hydro Boost Gel",
    description: "Hyaluronic acid water gel moisturizer. Oil-free, non-comedogenic, absorbs instantly, 24hr hydration.",
    price: 899, originalPrice: 1199, category: "Beauty",
    image: `${BASE}/neutrogena.jpg`,
    stock: 90, rating: 4.6, numReviews: 560, badge: "Top Rated",
  },
  {
    name: "boAt Airdopes 141 TWS Earbuds",
    description: "42hrs total playback, ENx noise cancellation for calls, IPX4 water resistance, gaming mode.",
    price: 1299, originalPrice: 2999, category: "Electronics",
    image: `${BASE}/boat-earbuds.jpg`,
    stock: 120, rating: 4.2, numReviews: 4500, badge: "Sale",
  },
  {
    name: "The Alchemist - Paulo Coelho",
    description: "Magical story about following your dreams. 25th anniversary edition. 65 million copies sold.",
    price: 299, originalPrice: 399, category: "Books",
    image: `${BASE}/alchemist.jpg`,
    stock: 300, rating: 4.8, numReviews: 2100, badge: "Bestseller",
  },
  {
    name: "IKEA POÄNG Armchair",
    description: "Layer-glued bent birch frame with comfortable cushion. Classic Scandinavian design, max load 110kg.",
    price: 8999, originalPrice: 10999, category: "Home",
    image: `${BASE}/ikea-chair.jpg`,
    stock: 20, rating: 4.4, numReviews: 95, badge: "New",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");
    await User.deleteMany();
    await Product.deleteMany();
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0];
    const productsWithAdmin = products.map((p) => ({ ...p, createdBy: adminUser._id }));
    await Product.create(productsWithAdmin);
    console.log("✅ Seeded! Admin: admin@shopwave.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    await User.deleteMany(); await Product.deleteMany();
    console.log("Destroyed!"); process.exit(0);
  });
} else { seedData(); }
