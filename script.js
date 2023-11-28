const apiUrl = 'http://localhost:3000/tasks';

// Function to render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // Fetch tasks from the backend
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Function to add a new task
function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    // Make a POST request to add the new task
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate, status: 'pending' }),
    })
        .then(response => response.json())
        .then((newTask) => {
            // Clear form fields
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            document.getElementById('dueDate').value = '';

            // Update the local tasks array with the new task
            addTask.push(newTask);

            // Update the task list
            renderTasks();
        })
        .catch(error => console.error('Error adding task:', error));
}

// Function to delete a task
function deleteTask(taskId) {
    // Make a DELETE request to delete the task
    fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(() => {
            // Update the task list
            renderTasks();
        })
        .catch(error => console.error('Error deleting task:', error));
}

// Initial rendering of tasks
renderTasks();
