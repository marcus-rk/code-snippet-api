// npm install express --save
const express = require("express");

// npm install mysql2 --save
const mysql = require("mysql2");

// npm install cors --save
const cors = require("cors");

// npm install path --save
const path = require("path");

// password for MySQL from password.js that is on .gitignore
const password = require('./password');

const app = express();
const port = 3000;

app.use(cors()); // avoid network security restrictions
app.use(express.json());

// Creating connection to code-snippet database in MySQL
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: password,
    database:"code_snippet"
});

// All files within the public folder will be served automatically
// when you access the root path http://localhost:3000/
// documentation: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// Select all from user (except password)
app.get('/users',(req, res)=>{
    connection.query('SELECT user_id, username, created_at FROM `user`',(error, results)=>{
        res.send(results);
    });
});

// Creating a new user
app.post('/users/new', (req, res) => {
    const username = req.body.username.toString();
    const password = req.body.password.toString();

    connection.query('SELECT username FROM `user` WHERE username = ?',
        [username],
        (error, results) => {
            if (results.length > 0) {
                res.status(403).send('Username already exists');
            } else {
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

// Select all code snippets
// Select title, author, language, code and date
app.get('/code-snippets',(req, res)=>{
    connection.query('SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, CS.code_snippet AS `code`, CS.created_at AS `date`, CS.snippet_id FROM code_snippet AS CS INNER JOIN `user` AS U ON CS.user_id = U.user_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id',(error, results)=>{
        res.send(results);
    });
});

app.post('/code-snippets/new',(req, res)=>{
    const title = req.body.title;
    const language_id = req.body.language_id;
    const code_snippet = req.body.code_snippet;
    const user_id = req.body.user_id;

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

app.post('/code-snippet-faves/new',(req, res)=>{
    const user_id = req.body.user_id;
    const snippet_id = req.body.snippet_id;

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

app.post('/code-snippet-faves/remove',(req, res)=>{
    const snippet_id = req.body.snippet_id;

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

// Select fave code-snippets for specific user id
// Select title, author, language and code
app.get('/:id/code-snippet-faves',(req, res)=>{
    const idFromUser = req.params.id;

    connection.query('SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, CS.code_snippet AS `code`, CS.snippet_id FROM code_snippet_fave AS CSF INNER JOIN code_snippet AS CS ON CSF.snippet_id = CS.snippet_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id INNER JOIN `user` AS U ON CS.user_id = U.user_id WHERE CSF.user_id = ?',
        [idFromUser],
        (error, results)=>{
        res.send(results);
    });
});

// Select all from programming_language table
app.get('/programming_languages',(req, res)=>{
    connection.query('SELECT * FROM programming_language',(error, results)=>{
        res.send(results);
    });
});

// Send 404 error if no api-end-point match
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});