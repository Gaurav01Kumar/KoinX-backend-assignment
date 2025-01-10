import dotenv from "dotenv"
dotenv.config();
import cors from 'cors';
import express from 'express';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import priceUpdateJob from './jobs/priceUpdateJob.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST',], 
  credentials: true 
}));
// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Start background job
priceUpdateJob.start();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});