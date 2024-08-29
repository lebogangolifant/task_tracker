// Base relative URL for backend API
// const apiUrl = 'https://task-tracker-server-ab301d6e354a.herokuapp.com/tasks';

let apiUrl = '';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    apiUrl = 'http://localhost:3000';
} else {
    apiUrl = 'https://task-tracker-server-teal.vercel.app/';
}

// For local testing
// const apiUrl = '/tasks'; 
let tasks = [];

// Function to show the login form and hide other elements
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById("forgotPasswordForm").style.display = "none";
    document.getElementById('forgot-password-button').style.display = "none";
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('task-app').style.display = "none";
}

// Function to show the registration form and hide other elements
function showRegistrationForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById("task-app").style.display = "none";
}

// Function to show the main app content and hide login/registration forms
function showApp() {
    document.getElementById("task-app").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "none";
    document.querySelector(".welcome-message").style.display = "none";
    document.querySelector(".navigation-links").style.display = "none";
    document.querySelector('.nav-button').style.display = 'block';
}

// Function to show the forgot password form
function showForgotPasswordForm() {
    document.getElementById('forgotPasswordForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('task-app').style.display = 'none';
}

// Function to handle user login
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            // Extract the token from the response
            return response.json();
        } else {
            throw new Error('Invalid credentials');
        }
    })
    .then(data => {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        // Show the main application content
        showApp();
    })
    .catch(error => {
        console.error('Error logging in:', error);
        // Display error message to the user
        alert('Login failed. Please check your credentials and try again.');
    });
}

// Function to handle user registration
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => {
        if (response.ok) {
            // Show the main application content
            showApp();
        } else {
            throw new Error('Registration failed');
        }
    })
    .then(data => {
    })
    .catch(error => {
        console.error('Error registering user:', error);
        // Display error message to the user
        alert('Registration failed. Please try again later.');
    });
}

// Function to handle forgot password
function forgotPassword() {
    const username = document.getElementById('forgotUsername').value;
    const email = document.getElementById('forgotEmail').value;

    fetch(`${apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Reset password failed');
        }
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error resetting password:', error);
        alert('Reset password failed. Please try again later.');
    });
}

// Function to handle user logout
function logoutUser() {
    // Clear the token from localStorage
    document.getElementById("task-app").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.querySelector('.welcome-message').style.display = 'none';
    document.getElementById('forgot-password-button').style.display = "block";
}

// Function to render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // Fetch tasks from the backend
    fetch(`${apiUrl}/tasks`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(fetchedTasks => {
            tasks = fetchedTasks;
            applyFiltersAndSort(); // Apply filters and sort before rendering
            tasks.forEach(task => {
                const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p><strong>Due Date:</strong> ${formattedDueDate}</p>
                    <p class="height"><strong>Status:</strong> ${task.status}</p>
                    <div class="action-icons">
                         <i class="fas fa-trash fa-sm" title="Delete" onclick="deleteTask('${task._id}')"></i>
                         <i class="fas fa-check fa-sm" title="${task.status === 'pending' ? 'Mark Completed' : 'Mark Incomplete'}" onclick="toggleTaskStatus('${task._id}')"></i>
                        <i class="fa fa-edit fa-sm" title="Update" onclick="showUpdateForm('${task._id}')"></i>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}

// Function to update the digital clock with date and time
function updateDigitalClock() {
    const digitalClockElement = document.getElementById('digitalClock');
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const timeString = new Date().toLocaleTimeString('en-US', optionsTime);
    const dateString = new Date().toLocaleDateString('en-US', optionsDate);

    digitalClockElement.innerHTML = `
        <div id="time">${timeString}</div>
        <div id="date">${dateString}</div>
    `;
}

// Update the digital clock initially
updateDigitalClock();

// Set up interval to update the digital clock every second
setInterval(updateDigitalClock, 1000);


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
    document.getElementById('taskForm').style.display = 'flex';
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
    fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    console.log('Deleting task with ID:', taskId);
    // Make a DELETE request to delete the task
    fetch(`${apiUrl}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
}
    })
        .then(response => response.json())
        .then(() => {
            // Update the task list
            console.log('Task deleted successfully.');
            renderTasks();
        })
        .catch(error => console.error('Error deleting task:', error));
}

// Function to toggle task status (mark as completed or incomplete)
function toggleTaskStatus(taskId) {
    const taskToUpdate = tasks.find(task => task._id === taskId);

    if (taskToUpdate) {
        // Make a PUT request to update the task status
        fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

// Function to show the update form and overlay
function showUpdateForm() {
    const updateFormContainer = document.getElementById('updateFormContainer');
    const overlay = document.querySelector('.overlay');

    // Display the update form and overlay
    updateFormContainer.style.display = 'block';
    overlay.classList.add('active');
    overlay.style.display = 'block';
}

// Function to hide the update form and overlay
function hideUpdateForm() {
    const updateFormContainer = document.getElementById('updateFormContainer');
    const overlay = document.querySelector('.overlay');

    // Hide the update form and overlay
    updateFormContainer.style.display = 'none';
    overlay.classList.remove('active');
    overlay.style.display = 'none';
}

// Function to show update form for a task
function showUpdateForm(taskId) {
    const taskToUpdate = tasks.find(task => task._id === taskId);

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
    fetch(`${apiUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
