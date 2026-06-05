# ShopWave 🛒

A full-stack e-commerce platform built with the MERN stack, featuring a C2C marketplace where customers can buy and sell used products.

**Live Demo:** [https://shop-wave-gamma.vercel.app/] 
<img width="1918" height="1087" alt="image" src="https://github.com/user-attachments/assets/32be3690-85f1-432a-81de-f00ad61e7a70" />

**Backend API:** [https://shopwave-backend-wdbs.onrender.com]

---

## Features

- JWT authentication with role-based access (User / Admin)
- Product catalog with search, filter, sort, and pagination
- Shopping cart with persistent localStorage
- Stripe payment gateway integration (test mode)
- C2C Marketplace — customers can list and sell used products
- Admin dashboard — manage products, orders, and C2C listings
- Seller dashboard — track listings and earnings
- 10% platform commission on every C2C sale
- Responsive design with Tailwind CSS

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS, Axios

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Stripe, Cloudinary

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas

---

## Setup

### Backend
```bash
cd shopwave-backend
npm install
cp .env.example .env   # Fill in your credentials
npm run seed           # Seed database with 15 products
npm run dev            # Start server on port 5000
```

### Frontend
```bash
cd shopwave-frontend
npm install
cp .env.example .env   # Fill in API URL and Stripe key
npm start              # Start on port 3000
```

### Environment Variables

**Backend `.env`:**
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Test Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@shopwave.com | admin123 |
| User  | user@shopwave.com  | user123  |

**Stripe Test Card:** `4242 4242 4242 4242` — Any future date — Any CVV

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/products` | Get all products |
| POST | `/api/orders` | Place order |
| POST | `/api/payment/create-checkout-session` | Stripe checkout |
| GET | `/api/listings` | Get C2C marketplace listings |
| POST | `/api/listings` | Create new listing |
| PUT | `/api/listings/:id/status` | Admin approve/reject |

---

Made with ❤️ by Kajal
