//  Load the environment variables using dotenv
require('dotenv').config();

//  Load the environment variables using dotenv
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

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

// Define your task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: String,
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'default_connection_string';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your task schema
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
