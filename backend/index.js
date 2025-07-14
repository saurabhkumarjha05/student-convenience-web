const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // MongoDB connection
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const socketHandler = require('./socket/socketHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const lostRoutes = require('./routes/lostRoutes');
const userRoutes = require('./routes/userRoutes'); // 👤 User routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const noteRoutes = require('./routes/noteRoutes');
const forumRoutes = require('./routes/forumRoutes');
const lostItemRoutes = require('./routes/lostItemRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/assignments', express.static(path.join(__dirname, 'uploads/assignments')));
app.use('/uploads/chat', express.static(path.join(__dirname, 'uploads/chat')));

// Routes
app.use('/api/auth', authRoutes);       // 🔐 Auth routes
app.use('/api/lost', lostRoutes);       // 🎒 Lost & Found routes
app.use('/api/user', userRoutes);       // 👤 User routes
app.use('/api/assignment', assignmentRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/lostitem', lostItemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Health check root route
app.get('/', (req, res) => {
  res.send('✅ Student Convenience API is running');
});

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
