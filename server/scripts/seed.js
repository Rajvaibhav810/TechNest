/**
 * TechNest Database Seed Script
 *
 * Usage: npm run seed
 *
 * Creates:
 *   - Admin user (credentials from .env: ADMIN_EMAIL, ADMIN_PASSWORD)
 *   - 12 demo tech products with reliable Unsplash image URLs
 *
 * WARNING: This script clears existing products and the admin user before re-seeding.
 *          Do NOT run in production without understanding this.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  {
    name: 'ASUS ROG Strix G16 Gaming Laptop',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop',
    price: 149999,
    category: 'Laptops',
    description:
      'Powered by Intel Core i9 and NVIDIA RTX 4080, the ROG Strix G16 delivers uncompromising gaming performance. Features a 165Hz QHD display, 32GB DDR5 RAM, and an advanced thermal system for sustained peak performance.',
    stock: 15,
  },
  {
    name: 'Apple MacBook Pro 16-inch M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
    price: 249999,
    category: 'Laptops',
    description:
      'The M3 Max chip transforms the MacBook Pro into a powerhouse for professional workflows. With up to 128GB unified memory and 40-core GPU, it handles 8K video editing, 3D rendering, and complex ML tasks effortlessly.',
    stock: 8,
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
    price: 29999,
    category: 'Headphones',
    description:
      "Industry-leading noise cancellation with 8 mics and Auto NC Optimizer. 30-hour battery life, multipoint connection for two devices simultaneously, and Sony's acclaimed LDAC high-res audio support.",
    stock: 42,
  },
  {
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
    price: 15999,
    category: 'Keyboards',
    description:
      'A premium QMK/VIA wireless mechanical keyboard with a gasket-mounted design and a full aluminum body for a deep, satisfying typing feel. Supports Bluetooth 5.1 and hot-swappable switches.',
    stock: 30,
  },
  {
    name: 'Logitech G Pro X Superlight 2',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop',
    price: 12999,
    category: 'Mouse',
    description:
      'At just 60g, this ultra-lightweight wireless gaming mouse features the HERO 2 sensor with up to 32,000 DPI. Trusted by esports professionals worldwide for its precision, reliability, and LIGHTSPEED wireless technology.',
    stock: 55,
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop',
    price: 9999,
    category: 'Mouse',
    description:
      'The iconic ergonomic shape refined for pro gaming. Features the Focus Pro 30K optical sensor with Razer HyperSpeed Wireless at sub-1ms latency. 90-hour battery life ensures uninterrupted gaming sessions.',
    stock: 68,
  },
  {
    name: 'Corsair K100 RGB Optical-Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1595044778969-be5fee4e2d8e?w=800&auto=format&fit=crop',
    price: 19999,
    category: 'Keyboards',
    description:
      'The pinnacle of Corsair keyboard engineering. Optical-mechanical switches with 0.4mm actuation, per-key RGB iCUE lighting, a 6-zone light edge, and an iCUE control wheel for intuitive media and lighting control.',
    stock: 20,
  },
  {
    name: 'ASUS TUF Gaming VG279QM 280Hz Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
    price: 39999,
    category: 'Gaming',
    description:
      'A 27-inch Full HD IPS gaming monitor with an extreme 280Hz refresh rate and 1ms GTG response time. ELMB Sync technology enables blur-reduction and Adaptive-Sync simultaneously for crystal-clear visuals.',
    stock: 12,
  },
  {
    name: 'HyperX Cloud Alpha Wireless Headset',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
    price: 17999,
    category: 'Headphones',
    description:
      'Up to 300 hours of battery life in a premium wireless gaming headset. Dual chamber drivers separate bass from mids and highs for distinct, clear audio. Compatible with PC, PS4, and PS5.',
    stock: 25,
  },
  {
    name: 'Elgato Stream Deck MK.2',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    price: 13999,
    category: 'Accessories',
    description:
      '15 customizable LCD keys for streamers and content creators. One-touch control of your streams, recordings, and production tools. Integrates with OBS, Twitch, YouTube, Twitter, Discord, and hundreds of apps.',
    stock: 35,
  },
  {
    name: 'Logitech MX Master 3S',
    image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop',
    price: 8999,
    category: 'Mouse',
    description:
      "The ultimate productivity mouse with Logitech's MagSpeed electromagnetic scrolling wheel for near-silent, ultra-fast scrolling. 8K DPI Darkfield sensor works on any surface including glass.",
    stock: 80,
  },
  {
    name: 'Razer BlackShark V2 X Gaming Headset',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop',
    price: 5999,
    category: 'Headphones',
    description:
      'Optimized for esports with TriForce 50mm drivers for clear highs, full mids, and powerful bass. The Cardioid microphone with HyperClear enhancement ensures crisp, team-focused communication.',
    stock: 100,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...\n');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Remove existing admin (will re-create)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    await User.deleteOne({ email: adminEmail });
    console.log('✅ Cleared existing admin account');

    // Create admin user (password is hashed via pre-save hook in User model)
    const admin = await User.create({
      name: 'TechNest Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`✅ Admin account created: ${admin.email}`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded\n`);

    console.log('🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────────');
    console.log(`Admin Email:    ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('─────────────────────────────────────────');
    console.log('\nProducts seeded:');
    createdProducts.forEach((p) => console.log(`  • ${p.name} (${p.category}) — ₹${p.price}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
