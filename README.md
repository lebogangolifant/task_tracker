
# Task Tracker

![Task Tracker Logo](tasks-logo.png)

Simple user-friendly task management web app. Crafted with HTML, CSS, and JavaScript on the frontend, communicates with the backend using the Fetch API. Powered by Node.js and Express, the backend seamlessly integrates MongoDB via Mongoose.


## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Backend](#backend)
- [User Authentication](#user-authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add new tasks with a title, description, and due date.
- View a list of all tasks with relevant details.
- Filter tasks by status (pending/completed).
- Mark tasks as complete or incomplete.
- Update task details.
- Delete tasks.
- Dark mode for a comfortable viewing experience.
- Responsive design for various screen sizes.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following tools installed:

- Node.js and npm
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lebogangolifant/task-tracker.git
   ```

2. Install dependencies:

   ```bash
   cd task-tracker
   npm install
   ```

3. Set up MongoDB:

   - Make sure MongoDB is running.
   - Create a `.env` file in the project's root directory.
   - Add your MongoDB connection string to the `.env` file: 

     ```
     MONGO_URI=your-mongodb-connection-string
     ```

     Replace `your-mongodb-connection-string` with your actual MongoDB connection string.


## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Open the web app in your browser:

   ```bash
   http://localhost:3000/tasks
   ```

3. Add, manage, and track your tasks!

## API Endpoints

- **GET /tasks**: Retrieve all tasks.
- **GET /tasks/:taskId**: Retrieve a specific task by ID.
- **POST /tasks**: Add a new task.
- **PUT /tasks/:taskId**: Update an existing task.
- **DELETE /tasks/:taskId**: Delete a task.

#### **Example JSON for a Task:**
```json
{
  "_id": 1,
  "title": "Complete Project Proposal",
  "description": "Write a detailed project proposal for submission.",
  "due_date": "2023-11-28",
  "status": "pending"
}
```

## Frontend

- Built with HTML, CSS, and JavaScript.
- Utilizes the Fetch API for communication with the backend.

## Backend

- Built with Node.js and Express.
- Uses Mongoose for MongoDB integration.

## User Authentication

This version does not include user authentication. Feel free to add your preferred authentication mechanism.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).


