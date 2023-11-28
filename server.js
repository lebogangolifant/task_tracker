const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS and use bodyParser for JSON parsing
app.use(cors());
app.use(bodyParser.json());

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
app.get('/tasks', (req, res) => {
    res.json(tasks);
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
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
    console.log('Updated tasks:', tasks); // Log the tasks arrayadd
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
