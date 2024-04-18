//  Load the environment variables using dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to verify JWT token
function authenticateUser(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
}

// Route for user registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user to database
        const user = await User.create({ username, hashedPassword });
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Fetch user from database
        const user = await User.findOne({ username });
        const user = { id: 1, username: 'example' };
        if (!user) return res.status(404).json({ error: 'User not found' });
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected route example
app.get('/tasks', authenticateUser, async (req, res) => {
    // Implementation for fetching tasks for authenticated user
});


// Enable CORS and use bodyParser for JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'default_connection_string';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: String,
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Route handler for the root path to send a response
app.get('/', (req, res) => {
    res.send('Welcome to the Task Tracker API');
});

// Endpoint to get all tasks
app.get('/tasks', async (req, res) => {
   try {
    const tasks = await Task.find();
    res.json(tasks);
   } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
   }
});

// Endpoint to get a specific task by ID
app.get('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;

    try {
      const task = await Task.findById(taskId);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// Endpoint to add a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    console.log('Received task data:', req.body);
    try {
      const savedTask = await newTask.save();
      console.log('Task added:', savedTask);
      res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error adding task:', error);  
      res.status(500).json({ error: 'Error adding task' });
    }
  });
  

// Endpoint to add a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);

    try {
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) { 
      res.status(500).json({ error: 'Error adding task' });
    }
  });
  
// Endpoint to update an existing task
app.put('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;

    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }  
});

// Endpoint to delete a task
app.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
