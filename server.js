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

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});