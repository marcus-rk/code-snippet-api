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

app.get('/users',(req, res)=>{
    connection.query('SELECT * FROM `user`',(error, results)=>{
        res.send(results);
    });
});

app.get('/code-snippets',(req, res)=>{
    connection.query('SELECT * FROM code_snippet',(error, results)=>{
        res.send(results);
    });
});

app.get('/code-snippet-faves',(req, res)=>{
    connection.query('SELECT * FROM code_snippet_fave',(error, results)=>{
        res.send(results);
    });
});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});