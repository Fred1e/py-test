const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost/frezra', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  status: String,
}));

const Post = mongoose.model('Post', new mongoose.Schema({
  author: String,
  content: String,
  timestamp: Date,
}));

const Group = mongoose.model('Group', new mongoose.Schema({
  name: String,
  description: String,
  members: [String],
}));

// Routes
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: 'User created successfully!' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ username: user.username }, 'secret_key');
  res.json({ token });
});

app.post('/update-status', async (req, res) => {
  const { username, status } = req.body;
  await User.findOneAndUpdate({ username }, { status });
  res.json({ message: 'Status updated successfully' });
});

app.post('/create-post', async (req, res) => {
  const { author, content } = req.body;
  const newPost = new Post({ author, content, timestamp: new Date() });
  await newPost.save();
  res.json({ message: 'Post created successfully' });
});

app.post('/create-group', async (req, res) => {
  const { name, description, members } = req.body;
  const newGroup = new Group({ name, description, members });
  await newGroup.save();
  res.json({ message: 'Group created successfully' });
});

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start Server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
