// npm install express --save
const express = require("express");

// npm install mysql2 --save
const mysql = require("mysql2");

// npm install cors --save
const cors = require("cors");

// npm install fs --save
const fs = require('fs');

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

app.get('/',(req, res)=>{
    connection.query('SELECT * FROM `user`',(error,results)=>{
        res.send(results);
    });
});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});