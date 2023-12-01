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
const mongoUri = "mongodb+srv://task-trackerdb:H3gvVInCQVRZPAfP@task-tracker.m30bwok.mongodb.net/?retryWrites=true&w=majority"; 
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

// Sample data for initial tasks
let tasks = [
    { id: 1, title: 'Complete Project Proposal', description: 'Write a detailed project proposal for submission.', dueDate: '2023-12-01', status: 'pending' },
    // Add more tasks if needed
];

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
app.get('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Endpoint to add a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
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
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
    console.log('Updated tasks:', tasks); // Log the tasks array
    res.status(201).json(newTask);
});

// Endpoint to update an existing task
app.put('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const updatedTask = req.body;

    tasks = tasks.map(task => (task.id === taskId ? { ...task, ...updatedTask } : task));

    res.json({ success: true });
});

// Endpoint to delete a task
app.delete('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);

    tasks = tasks.filter(task => task.id !== taskId);

    res.json({ success: true });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
