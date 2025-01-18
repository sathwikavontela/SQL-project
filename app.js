const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const databaseConfig = {
    user: 'root',
    password: 'sidduammulu',
    host: 'localhost',
    port: 3306,
    database: 'todoApplication',
};

let connection;

const connectToDatabase = async () => {
    try {
        connection = await mysql.createConnection(databaseConfig);
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);
    }
};

const createTable = async()=>{
    const createTableQuery = `CREATE TABLE IF NOT EXISTS todo(id INTEGER AUTO_INCREMENT PRIMARY KEY,todo TEXT NOT NULL,priority TEXT NOT NULL, status TEXT NOT NULL);`;
    try{
        await connection.query(createTableQuery);
        console.log("todo table create successfully");
    }
    catch(e){
        console.log("error while creating table:",e.message);
    }
}

const initializeServer = async () => {
    await connectToDatabase();
    await createTable();

    app.listen(3000, () => {
        console.log('Server running at http://localhost:3000');
    });
};

initializeServer();


app.get('/todos/',async(request,response)=>{
    
    const {search_q="TO DO",priority,status} = request.query;

    let getTodosQuery = '';
    switch(true)
    {
        case search_q!==undefined:
            getTodosQuery = `SELECT * FROM todo WHERE 
            todo LIKE '%${search_q}%'
            AND status = '${status}'
            AND priority = '${priority}'
            ;`
            break;
        case priority!==undefined:
            getTodosQuery = `SELECT * FROM todo WHERE 
            todo LIKE '%${search_q}%'
            AND priority = '${priority}'
            ;`
            break;
        case status!==undefined:
            getTodosQuery = `SELECT * FROM todo WHERE 
            todo LIKE '%${search_q}%'
            AND status = '${status}'
            ;`
            break;
        default:
            getTodosQuery = `SELECT * FROM todo WHERE 
            todo LIKE '%${search_q}%'
            ;`
            break;
    }
    try {
        const [rows] = await connection.query(getTodosQuery); 
        console.log(rows);
        response.json(rows); 
    } catch (error) {
        console.log("Error executing query:", error.message);
        response.status(500).send('Error retrieving data');
    }

})

app.post('/todos/', async (request, response) => {
    try {
        const { todo, priority, status } = request.body;
        //console.log(request.body);
        if(!todo || !priority || !status)
        {
            return response.status(400).send('All fields are required');
        }

        const [LastInsertedQuery] = await connection.query(`SELECT MAX(id) as id FROM todo;`);

        //console.log(LastInsertedQuery);

        const newId = LastInsertedQuery[0].id ? LastInsertedQuery[0].id+1:1;

        //console.log(newId)
        const postTodoQuery = `
          INSERT INTO todo (id, todo, priority, status)
          VALUES (${newId}, '${todo}', '${priority}', '${status}');
        `;
        //console.log('Post Query:', postTodoQuery); 
        await connection.query(postTodoQuery);
        response.send('Todo Successfully Added');
    } catch (error) {
        response.status(400).send('Error inserting data');
        
    }
   
  });
  
app.get('/todos/:todoId',async(request,response)=>{
    try {
        const {todoId} = request.params;
        //console.log(todoId);
        if(!todoId)
        {

            return response.status(401).send('All fields are required');
        }
        const getTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`;
       
        const [returnedTodo] = await connection.query(getTodoQuery);
        if(returnedTodo.length===0)
        {
            return response.status(400).send(`todo with id ${todoId} not found`);
        }

        // console.log(returnedTodo);

         response.status(200).send(returnedTodo);
        
    } catch (error) {
        response.status(501).send(error,'Error while fetching');
        
    }


})

app.put('/todos/:todoId',async(request,response)=>{
    const {todoId} = request.params;
    const {todo,status,priority}=request.body;
    const updatedFields = [];
    if (status) {
        updatedFields.push(`status = '${status}'`);
    }
    if (todo) {
        updatedFields.push(`todo = '${todo}'`);
    }
    if (priority) {
        updatedFields.push(`priority = '${priority}'`);
    }
    const updateTodoQuery = `UPDATE todo
     SET ${updatedFields.join(', ')}
     where id = '${todoId}' ;`
    
     try {
        const [result] = await connection.query(updateTodoQuery);

        if (result.affectedRows === 0) {
            return response.status(400).send(`Todo with ID "${todoId}" not found`);
        }

        if (status) {
            response.status(200).send("Status successfully updated");
        } else if (todo) {
            response.status(200).send("Todo successfully updated");
        } else if (priority) {
            response.status(200).send("Priority successfully updated");
        }
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal server error');
    }

 })

 app.delete('/todos/:todoId', async (request, response) => {
    try {
        const { todoId } = request.params;
        const deleteRowQuery = `DELETE FROM todo WHERE id = '${todoId}';`;
        const [result] = await connection.query(deleteRowQuery);

        if (result.affectedRows === 0) {
            return response.status(404).send(`Todo with ID ${todoId} not found`);
        }

        response.status(200).send("Row deleted successfully");

    } catch (error) {
        console.error(error);
        response.status(500).send("Error while deleting");
    }
});

module.exports = app;
