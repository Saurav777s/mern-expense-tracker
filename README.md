## 💸 MERN Expense Tracker

A full-stack expense tracker web application built using the MERN (MongoDB, Express, React, Node.js) stack. Users can manage their expenses with powerful features like real-time filtering, reporting, and authentication.

---

### 📌 Features

* 🔐 User registration & login (JWT-based authentication)
* 💰 Add, edit, delete expenses
* 📆 Filter by date range, category, or search term
* 📊 Dashboard with pie chart of categories
* 📈 Reports page with bar chart and CSV export
* 🕒 Expense history with pagination
* 🌗 Dark mode support
* 📱 Fully responsive for mobile and desktop
* 👤 User profile dropdown with logout, reset password, and delete account

---

### 🛠️ Tech Stack

**Frontend:**

* React
* React Router
* Axios
* Recharts
* Toastify
* CSS (custom styling)

**Backend:**

* Node.js
* Express.js
* MongoDB + Mongoose
* JSON Web Token (JWT)
* Bcrypt for password hashing

**Deployment:**

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas

---

### 📁 Project Structure


client/          # React frontend
├── pages/       # Main pages (Dashboard, Reports, History, etc.)
├── components/  # Shared UI components
├── context/     # Theme and auth context
└── utils/       # Axios config, helpers

server/          # Node + Express backend
├── models/      # Mongoose models
├── routes/      # API routes
├── controllers/ # Route logic
├── middleware/  # Auth middleware
└── config/      # DB connection


---

### ⚙️ Setup Instructions

1. **Clone the repo:**


   git clone https://github.com/your-username/mern-expense-tracker.git
   cd mern-expense-tracker
   

2. **Install frontend dependencies:**


   cd client
   npm install
  

3. **Install backend dependencies:**


   cd ../server
   npm install
  

4. **Set up environment variables:**

   * In /server/.env:

     
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
   

   * In /client/.env:

   
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     

5. **Run development servers:**

   * Frontend:

   
     npm start
   
   * Backend:

   
     npm run dev
     

---

### 🧪 Testing

* Unit tests (optional if added) for backend routes and components.
* Manual testing of flows like login, add/edit/delete expense, filtering, etc.

---

### 🚀 Live Demo

Frontend: [https://your-frontend.netlify.app](https://your-frontend.netlify.app)
Backend: [https://your-backend.onrender.com](https://your-backend.onrender.com)

---

### 📧 Contact

Created by Saurav L J — feel free to connect on LinkedIn - http://www.linkedin.com/in/saurav-l-j-b47a0b275

---


