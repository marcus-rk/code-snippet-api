// npm install * --save
const express = require("express");   // Express framework for handling HTTP requests
const mysql = require("mysql2");      // MySQL database driver
const cors = require("cors");         // CORS middleware for handling cross-origin resource sharing
const path = require("path");         // Path module for working with file and directory paths

// Importing MySQL password from external file (.gitignore)
const password = require('./password');

// Initializing Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(cors()); // Enable CORS to avoid network security restrictions

// Creating a MySQL connection to code_snippet db
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: password,
    database:"code_snippet"
});

// All files within the public folder will be served automatically
// when you access the root path http://localhost:3000/
// For details, refer to: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to retrieve all users (excluding passwords)
app.get('/users/all',(req, res)=>{
    connection.query('SELECT user_id, username, created_at FROM `user`',(error, results)=>{
        res.send(results);
    });
});

// Endpoint to create a new user
app.post('/users/new', (req, res) => {
    // Extracting username and password from the request body
    const username = req.body.username.toString();
    const password = req.body.password.toString();

    // Checking if the username already exists
    connection.query('SELECT username FROM `user` WHERE username = ?',
        [username],
        (error, results) => {
            if (results.length > 0) {
                res.status(403).send('Username already exists');
            } else {
                // Inserting a new user into the database
                connection.query('INSERT INTO `user` (username, `password`) VALUES (?, ?)',
                    [username, password],
                    (error, results) => {
                        if (error) {
                            console.error('Error inserting user:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            res.status(200).send(results);
                        }
                    });
            }
        });
});

// Endpoint to retrieve all code snippets (title, author, author_id, language, code, date, snippet_id)
app.get('/code-snippets/all',(req, res)=>{
    connection.query('SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, CS.code_snippet AS `code`, CS.created_at AS `date`, CS.snippet_id FROM code_snippet AS CS INNER JOIN `user` AS U ON CS.user_id = U.user_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id',(error, results)=>{
        res.send(results);
    });
});

// Endpoint to create a new code snippet
app.post('/code-snippets/new',(req, res)=>{
    // Extracting values from the request body
    const title = req.body.title;
    const language_id = req.body.language_id;
    const code_snippet = req.body.code_snippet;
    const user_id = req.body.user_id;

    // Inserting a new code snippet into the database
    connection.query('INSERT INTO code_snippet (user_id, title, code_snippet, language_id) VALUES (?, ?, ?, ?)',
        [user_id, title, code_snippet, language_id],
        (error, results) => {
            if (error) {
                console.error('Error inserting code-snippet:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                res.status(200).send(results);
            }
        });
});

// Endpoint to mark a code snippet as a favorite for a specific user
app.post('/code-snippet-faves/new',(req, res)=>{
    // Extracting values from the request body
    const user_id = req.body.user_id;
    const snippet_id = req.body.snippet_id;

    // Adding a new favorite code snippet entry to the database
    connection.query('INSERT INTO code_snippet_fave (user_id, snippet_id) VALUES (?, ?)',
        [user_id, snippet_id],
        (error, results) => {
            if (error) {
                console.error('Error inserting fave code-snippet:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                res.status(200).send(results);
            }
        });
});

// Endpoint to remove a code snippet from favorites
app.post('/code-snippet-faves/remove',(req, res)=>{
    // Extracting the snippet_id from the request body
    const snippet_id = req.body.snippet_id;

    // Deleting the favorite code snippet entry from the database
    connection.query('DELETE FROM code_snippet_fave WHERE snippet_id = ?',
        [snippet_id],
        (error, results) => {
            if (error) {
                console.error('Error removing fave code-snippet:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                res.status(200).send(results);
            }
        });
});

// Endpoint to retrieve favorite code snippets for a specific user
app.get('/:id/code-snippet-faves',(req, res)=>{
    // Extracting user id from the request parameters
    const idFromUser = req.params.id;

    // Query to get favorite code snippets for the specified user
    connection.query('SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, CS.code_snippet AS `code`, CS.snippet_id FROM code_snippet_fave AS CSF INNER JOIN code_snippet AS CS ON CSF.snippet_id = CS.snippet_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id INNER JOIN `user` AS U ON CS.user_id = U.user_id WHERE CSF.user_id = ?',
        [idFromUser],
        (error, results)=>{
        res.send(results);
    });
});

// Endpoint to retrieve all programming languages
app.get('/programming_languages/all',(req, res)=>{
    connection.query('SELECT * FROM programming_language',(error, results)=>{
        res.send(results);
    });
});

// Default route to handle 404 errors for unmatched API endpoints
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

// Starting the Express server on the specified port (3000)
app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});