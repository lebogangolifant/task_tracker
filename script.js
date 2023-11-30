const apiUrl = 'http://localhost:3000/tasks';
let tasks = [];

// Function to render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // Fetch tasks from the backend
    fetch(apiUrl)
        .then(response => response.json())
        .then(fetchedTasks => {
            tasks = fetchedTasks;
            applyFiltersAndSort(); // Apply filters and sort before rendering
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate}</p>
                    <p class="height"><strong>Status:</strong> ${task.status}</p>
                    <div class="action-icons">
                         <i class="fas fa-trash fa-sm" title="Delete" onclick="deleteTask(${task.id})"></i>
                         <i class="fas fa-check fa-sm" title="${task.status === 'pending' ? 'Mark Completed' : 'Mark Incomplete'}" onclick="toggleTaskStatus(${task.id})"></i>
                        <i class="fa fa-edit fa-sm" title="Update" onclick="showUpdateForm(${task.id})"></i>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Function to apply filters and sort tasks
function applyFiltersAndSort() {
    const statusFilter = document.getElementById('statusFilter').value;
    const completedFilter = document.getElementById('completedFilter').checked;

    tasks = tasks.filter(task => {
        return (completedFilter || task.status === 'pending') && (statusFilter === 'all' || task.status === statusFilter);
    });

    const sortBy = document.getElementById('sortBy').value;
    if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'status') {
        tasks.sort((a, b) => a.status.localeCompare(b.status));
    }
}

// Function to show the task form
function showTaskForm() {
    document.getElementById('taskForm').style.display = 'flex'; // or 'block', depending on your styling
    document.getElementById('addTaskButton').style.display = 'none';
}

// Function to hide the task form
function hideTaskForm() {
    document.getElementById('taskForm').style.display = 'none';
    document.getElementById('addTaskButton').style.display = 'block';
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
            tasks.push(newTask);

            // Update the task list
            renderTasks();

            // Hide the task form
            hideTaskForm();

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

// Function to toggle task status (mark as completed or incomplete)
function toggleTaskStatus(taskId) {
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (taskToUpdate) {
        // Make a PUT request to update the task status
        fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: taskToUpdate.status === 'pending' ? 'completed' : 'pending' }),
        })
            .then(response => response.json())
            .then(() => {
                // Update the task list
                renderTasks();
            })
            .catch(error => console.error('Error updating task status:', error));
    }
}

// Function to show update form for a task
function showUpdateForm(taskId) {
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (taskToUpdate) {
        // Populate the form fields with the task details
        document.getElementById('updateTitle').value = taskToUpdate.title;
        document.getElementById('updateDescription').value = taskToUpdate.description;
        document.getElementById('updateDueDate').value = taskToUpdate.dueDate;

        // Show the update form
        document.getElementById('updateFormContainer').style.display = 'block';
        document.getElementById('updateTaskId').value = taskId;
    }
}

// Function to update an existing task
function updateTask() {
    const taskId = document.getElementById('updateTaskId').value;
    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDescription').value;
    const dueDate = document.getElementById('updateDueDate').value;

    // Make a PUT request to update the task
    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate }),
    })
        .then(response => response.json())
        .then(() => {
            // Hide the update form
            document.getElementById('updateFormContainer').style.display = 'none';

            // Update the task list
            renderTasks();
        })
        .catch(error => console.error('Error updating task:', error));
}

// Function to cancel the update
function cancelUpdate() {
    // Hide the update form
    document.getElementById('updateFormContainer').style.display = 'none';
}

// Initial rendering of tasks
renderTasks();
