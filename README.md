# TechNest — Premium Full-Stack E-Commerce Store

TechNest is a responsive, feature-rich full-stack technology e-commerce application built for the **ACM Junior Webmaster Recruitment Round 2**. The platform allows users to search, filter, sort, and purchase next-generation tech gear, while providing admins with a complete dashboard for product CRUD operations and order fulfillment management.

---

## 🚀 Technology Stack

### Frontend
- **React 19** & **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS v4**: Modern, premium styling using utility classes and dynamic CSS custom properties.
- **React Router v6**: Dynamic client-side routing.
- **Axios**: Standard HTTP client with automatic request/response token interceptors.
- **Context API**: Global state management for authentication (`AuthContext`) and shopping cart persistence (`CartContext`).

### Backend
- **Node.js** & **Express.js**: REST API hosting with structured controllers, routes, and middleware.
- **JWT (JSON Web Tokens)**: Secure token-based authentication.
- **bcryptjs**: Password hashing (12 rounds) for database security.

### Database
- **MongoDB** & **Mongoose**: Document-based schema modeling, indexing, and validation.

---

## 🛠️ Project Structure

```
d:\ACM Final task\
├── client/              # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── assets/      # Static assets
│   │   ├── components/  # Reusable UI elements (Navbar, Footer, Modal, Cards, Badges)
│   │   ├── context/     # AuthContext and CartContext global state
│   │   ├── pages/       # Page components (Home, Shop, ProductDetail, Cart, Auth)
│   │   │   └── admin/   # Protected Admin view pages (Dashboard, Orders, Products CRUD)
│   │   ├── services/    # api.js Axios instance setup
│   │   ├── App.jsx      # Route definitions
│   │   └── main.jsx     # Frontend entry point
│   ├── index.html       # Google Fonts linkage
│   └── package.json     # Client-side script configuration
│
├── server/              # Node.js + Express.js Backend
│   ├── config/          # db.js Mongoose database configuration
│   ├── controllers/     # Controller logic (auth, products, orders)
│   ├── middleware/      # Authentication checks and schema validator triggers
│   ├── models/          # Mongoose Schemas (User, Product, Order)
│   ├── routes/          # RESTful Endpoint routing declarations
│   ├── scripts/         # seed.js initialization dataset
│   ├── utils/           # Helper wrappers (asyncHandler, standardized responses)
│   └── server.js        # Main server script with security middleware
│
├── README.md            # Project overview and run instructions
├── .gitignore           # File exclude listings
└── package.json         # Root package manager orchestrating client/server dev scripts
```

---

## 🔑 Environment Variables Setup

Before running the application, configure your credentials by creating `.env` files.

### Server Environment Configuration
Create `server/.env` with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@technest.com
ADMIN_PASSWORD=Admin@123456
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client Environment Configuration
Create `client/.env` with the API pointer:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏁 How to Run Locally

### 1. Install Dependencies
Run the installation script in the root directory to set up both frontend and backend libraries:
```bash
npm run install-all
```
*Alternatively, you can manually run `npm install` inside the root, `client/`, and `server/` directories.*

### 2. Seed the Database
Make sure your `server/.env` has a valid `MONGODB_URI` connection string, then run:
```bash
npm run seed
```
This script will:
- Clear existing products and admin user listings to prevent conflicts.
- Create an Admin user with credentials matching your `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.
- Seed 12 premium technology products with description texts and high-resolution Unsplash images.

### 3. Run Development Server
Start the frontend and backend servers concurrently with:
```bash
npm run dev
```
- **Frontend** will listen at: [http://localhost:5173](http://localhost:5173)
- **Backend API** will listen at: [http://localhost:5000](http://localhost:5000)

---

## 💡 Key REST Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Registers a new user.
- `POST /login`: Authenticates user credentials and returns a JWT.
- `GET /me`: Returns the logged-in user profile (requires Bearer Token).

### 📦 Products (`/api/products`)
- `GET /`: Lists all products (supports search, sort, and category queries).
- `GET /:id`: Retrieves detailed information for a single product.
- `POST /`: Creates a product (Admin only).
- `PUT /:id`: Modifies details for an existing product (Admin only).
- `DELETE /:id`: Deletes a product from database (Admin only).

### 🛒 Orders (`/api/orders`)
- `POST /`: Submits cart items, validates prices, decrements stock atomically, and creates order.
- `GET /`: Lists user orders (returns all orders if request originates from Admin account).
- `GET /:id`: Specific order analysis (restricted to order owner or Admin accounts).
- `PUT /:id/status`: Updates fulfillment stage (Admin only).

### 📊 Admin Analytics (`/api/admin`)
- `GET /stats`: Generates aggregated store statistics: total users, products, orders, revenues, and recent listings (Admin only).

---

## 🛡️ Challenges Faced & Solutions

### 1. Concurrent Stock Purchases (The Oversell Problem)
- **Problem**: When two users purchase the final item of a product at the exact same millisecond, read-then-write updates can result in both orders succeeding, making stock negative and leading to fulfillment errors.
- **Solution**: We implemented an **atomic update operation** in `server/controllers/orderController.js` using MongoDB's document-level locks. Instead of querying stock first and then updating, we execute:
  ```js
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } }, // Atomic constraint: stock must be >= ordered quantity
    { $inc: { stock: -quantity } },                // Atomic decrement
    { new: true, session }
  );
  ```
  If stock is insufficient, `findOneAndUpdate` returns `null` instantly, preventing race conditions. This is wrapped in a Mongoose Transaction Session so that if any single item in a multi-item checkout fails, all stock adjustments are rolled back, preserving database integrity.

### 2. Client Price and Data Trust Validation
- **Problem**: Frontend shopping carts shouldn't be trusted for unit prices or total amounts as developers can easily manipulate requests.
- **Solution**: The checkout endpoint (`POST /api/orders`) accepts only product IDs and requested quantities from the client. The backend queries MongoDB for the authoritative, server-stored prices and calculates the totals entirely on the server side.

### 3. Responsive Tables on Mobile View
- **Problem**: Standard HTML tables overflow horizontally on mobile layouts.
- **Solution**: Designed mobile-friendly list cards that flex on smaller viewports using Tailwind's layout helpers, and display tabular elements only on tablets and desktops.

---

## 🔮 Future Improvements
- **Wishlist**: Allow users to save their favorite tech items.
- **Live Payments**: Integrations with sandbox configurations of gateways like Razorpay or Stripe.
- **Reviews & Ratings**: Add user review submission forms and compute average rating stars.
