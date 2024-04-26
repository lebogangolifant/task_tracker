//  Load the environment variables using dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to verify JWT token
function authenticateUser(req, res, next) {
  const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).json({ error: 'Authorization header not provided' });

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
}

// Enable CORS and use bodyParser for JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Define user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
});

// Create a User model
const User = mongoose.model('User', userSchema);

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
  userId: String,
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Route handler for the root path to send a response
app.get('/', (req, res) => {
    res.send('Welcome to the Task Tracker API');
});

// Route for user registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user to database
        const user = await User.create({ username, hashedPassword });
        await user.save();
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
        if (!user) return res.status(404).json({ error: 'User not found' });
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//  Protected route to get all tasks for authenticated users
app.get('/tasks', authenticateUser, async (req, res) => {
     try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Endpoint to get a specific task by ID
app.get('/tasks/:taskId', authenticateUser, async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const task = await Task.findOne({ _id: taskId, userId: req.user.id });
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Error fetching task' });
    }
});

// Endpoint to add a new task
app.post('/tasks', authenticateUser, async (req, res) => {
  const { title, description, dueDate, status } = req.body;
    const userId = req.user.id;

    try {
        const newTask = await Task.create({ title, description, dueDate, status, userId });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Error adding task' });
    }
});
  
// Endpoint to update an existing task
app.put('/tasks/:taskId', authenticateUser, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, dueDate, status } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: taskId, userId: req.user.id }, 
            { title, description, dueDate, status }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Endpoint to delete a task
app.delete('/tasks/:taskId', authenticateUser, async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
