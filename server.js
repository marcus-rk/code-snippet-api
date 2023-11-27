// npm install express --save
const express = require("express");
// npm install mysql2 --save
const mysql = require("mysql2");
// npm install cors --save
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // avoid network security restrictions

//Host, user, password database
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: passwordFromFile,
    database:"pokemon"
});

app.get('/',(req, res)=>{
    connection.query('SELECT `name` FROM pokemon',(error,results)=>{
        res.send(results);
    });
});

app.get('/pokemon/:name/', (req,res)=>{
    const pokemonUserRequest = req.params.name;
    connection.query('SELECT * FROM pokemon WHERE ´name´ = ?',
        [pokemonUserRequest],
        (error, results)=>{
            res.send(results);
        });

});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});