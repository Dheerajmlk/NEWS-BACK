require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initCronJobs = require('./utils/cronJobs');

const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');

// ✅ CONNECT DB
connectDB();

const app = express();

// ✅ DEBUG LOGGER
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

// ✅ FINAL CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://news-front-naoyihq5q-dheerajs-projects-662fbfc6.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ HANDLE PREFLIGHT REQUESTS (CRITICAL FOR CORS)
app.options('*', cors());

// ✅ BODY PARSER
app.use(express.json());

// ✅ TEST ROUTE
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working ✅' });
});

// ✅ ROUTES
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

// ✅ ROOT
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// ✅ CRON JOBS
initCronJobs();

// ✅ ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// ✅ START SERVER
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});