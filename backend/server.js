import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import requestRoutes from './routes/requests.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for testing. In production, restrict to frontend domain.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VillageShare API is fully operational' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error occurred' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 VillageShare Backend Server is running!`);
  console.log(`👉 API Endpoint: http://localhost:${PORT}`);
  console.log(`📁 JSON DB Files location: ${path.join(__dirname, 'data')}`);
  console.log(`====================================================`);
});
