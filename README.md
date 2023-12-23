
# Task Tracker

![Task Tracker Logo](img/task_tracker_app.png)

A simple task management web application, that utilizes the RESTful API architectural style. The frontend is Built with HTML5, CSS3, and JavaScript. It communicates with the backend through the Fetch API, a JavaScript interface for accessing and manipulating parts of the protocol (requests and responses). The backend is powered by Node.js and Express, managing servers and routes. Seamless integration with MongoDB is achieved through Mongoose.


## Table of Contents

- [Features](#features)
- [Blog Post](#blog-post)
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

## Blog Post

An in-depth look at the [project development process](https://bit.ly/task_tracker_blog)

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
2. Navigate to
    ```bash
   http://localhost:3000/tasks
   ```
   in your browser to see data stored in  JSON files.

3. Open the web application ``index.html`` file in your browser.

4. Add, manage, and track your tasks!

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

- Built with HTML5, CSS3, and JavaScript.
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


