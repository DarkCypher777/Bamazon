// Variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
});