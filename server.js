console.log("🔥 SERVER FILE LOADED");

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initCronJobs = require('./utils/cronJobs');


const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');

console.log("✅ ROUTES IMPORTED");

connectDB();

const app = express();


app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());


app.get('/test', (req, res) => {
  res.json({ message: 'Server is working ✅' });
});

app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

console.log("✅ ROUTES MOUNTED");


app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});


initCronJobs();




app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});