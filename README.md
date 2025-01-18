
# Todo Application - Node.js with MySQL

## Project Overview

This project is a **Todo Application** built using **Node.js**, **Express.js**, and **MySQL**. The application allows users to manage their daily tasks by adding, viewing, updating, and deleting todos.
The project demonstrates how to build a simple RESTful API with full CRUD (Create, Read, Update, Delete) operations while integrating it with a MySQL database.

## Features

- **Create Todos**: Users can create new todos with a title, priority, and status.
- **View Todos**: Users can view todos by filtering based on priority and status.
- **Update Todos**: Users can update the title, priority, or status of existing todos.
- **Delete Todos**: Users can delete a todo by providing its ID.
- **Search Functionality**: The app allows users to search for specific todos based on partial matches with the title, priority, and status.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for Node.js to handle HTTP requests.
- **MySQL**: Relational database to store todo data.
- **Postman**: For testing API routes and requests.

## Challenges Faced and How I Overcame Them

### 1. **Database Connection Issues**  
One of the initial struggles I faced was connecting the application to MySQL. The error messages were cryptic at times, and it took several attempts to ensure that the database was running and correctly configured. Eventually, I figured out that I had to ensure the database configuration was correct (username, password, port, etc.) and handle database connection errors more gracefully.

### 2. **Handling SQL Queries Properly**  
Writing SQL queries dynamically based on the request parameters (such as searching by status or priority) required me to be very careful with string concatenation and SQL injection prevention. I ensured the queries were parameterized and avoided inserting raw user input directly into SQL queries.

### 3. **Handling Missing Data for Todo Creation and Update**  
Initially, when some fields were missing while creating or updating todos, the application would throw errors or not behave as expected. I implemented validation to make sure that all fields (such as todo, priority, and status) were provided in the requests. This significantly improved the reliability of the API.

### 4. **CRUD Operations and Error Handling**  
The complexity of implementing all CRUD operations while ensuring correct error handling for scenarios like missing data, non-existent todo IDs, and database errors was challenging. I spent a considerable amount of time ensuring that all possible edge cases were handled, and appropriate HTTP status codes were returned with meaningful messages.

### 5. **Postman Testing**  
Testing the API using Postman was a valuable tool, but sometimes the requests did not execute as expected due to misconfigurations in the routes. Learning how to set up routes correctly and troubleshoot using Postman helped me ensure the application's correctness.

## API Endpoints

### `GET /todos/`
Fetch all todos. You can filter todos by `search_q`, `priority`, and `status` using query parameters.

**Example Request**:
```
GET /todos/?search_q=project&priority=HIGH&status=TO%20DO
```

### `POST /todos/`
Create a new todo.

**Request Body**:
```json
{
  "todo": "Complete project documentation",
  "priority": "HIGH",
  "status": "TO DO"
}
```

### `GET /todos/:todoId`
Fetch a specific todo by its ID.

**Example Request**:
```
GET /todos/1
```

### `PUT /todos/:todoId`
Update an existing todo by its ID. You can update the `todo`, `status`, or `priority`.

**Request Body**:
```json
{
  "todo": "Updated todo",
  "status": "IN PROGRESS",
  "priority": "MEDIUM"
}
```

### `DELETE /todos/:todoId`
Delete a todo by its ID.

**Example Request**:
```
DELETE /todos/1
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/sathwikavontela/SQL-project.git
   ```
   
2. Navigate to the project directory:
   ```
   cd SQL-project
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up MySQL:
   - Create a database named `todoApplication` in MySQL.
   - Ensure your database credentials (username, password, etc.) are correctly set in `app.js`.

5. Run the server:
   ```
   npm start
   ```

   The application will be available at `http://localhost:3000`.


