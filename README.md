# 🧠 News Backend API

A scalable backend built with Node.js, Express, and MongoDB that fetches, stores, and serves news data from external APIs.

This backend powers both the frontend news website and the admin panel.

---

## 🚀 Live API

👉 https://news-back-ppy0.onrender.com

---

## 📌 Overview

This backend acts as a central API service that:

- Fetches news from GNews API
- Stores it in MongoDB
- Provides filtered and paginated data
- Handles admin authentication (JWT)
- Supports cron jobs for automatic updates

---

## 🛠 Tech Stack

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB (Mongoose)
- 🔐 JWT Authentication
- 🌐 Axios
- ⏱ Node-Cron
- 🛡 CORS Middleware

---

## ✨ Features

- 📰 Fetch news from GNews API  
- 💾 Store news in MongoDB  
- 🔍 Search news by keyword  
- 📂 Category-based filtering  
- 📄 Pagination support  
- 🔐 Admin authentication (JWT)  
- ⏱ Automatic news fetching using cron jobs  
- 🚫 Duplicate article prevention  
- ⚡ RESTful API  

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```env
PORT=5050
MONGODB_URI=your_mongodb_connection_string
GNEWS_API_KEY=your_gnews_api_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@news.com
ADMIN_PASSWORD=adminpassword