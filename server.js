const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');  
const projectRoutes = require('./routes/projectRoutes');  
const reportBugMailRoutes = require('./routes/reportBugMailRoutes');  // ✅ Import sendMailRoutes

dotenv.config();
const app = express();

connectDB();  // Connect to MongoDB

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://webbrick-backend.onrender.com'],  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// ✅ Apply JSON Parsers ONLY for Non-Multipart Routes
app.use('/api/auth', express.json(), express.urlencoded({ extended: true }), authRoutes);
app.use('/api/projects', express.json(), express.urlencoded({ extended: true }), projectRoutes);

// ✅ Use Multer for the `/api/send-mail` Route
app.use('/api/send-mail', reportBugMailRoutes);  // 💡 No express.json() for this route

const contactMailRoutes = require('./routes/contactMailRoutes'); // ✅ Import

// ✅ Use for Contact Us Form
app.use('/api/contact', express.json(), express.urlencoded({ extended: true }), contactMailRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
