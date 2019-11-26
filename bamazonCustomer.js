// Variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Pizzatime676",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
});

// Display Products
var displayProducts = function () {
    var query = "Select * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
            colWidths: [10, 25, 25, 10, 14]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push([
                res[i].item_id,
                res[i].product_name,
                res[i].department_name,
                res[i].price,
                res[i].stock_quantity
            ]);
        }
        console.log(displayTable.toString());
        purchasePrompt();
    });
};

// Purchase
function purchasePrompt() {
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "Please input item ID you wish to purchase.",
            filter: Number
        }, {
            name: "Quantity",
            type: "input",
            message: "How many items would you like to purchase?",
            filter: Number
        },

    ]).then(function (answers) {
        var quantityNeeded = answers.Quantity;
        var IDrequested = answers.ID;
        purchaseOrder(IDrequested, quantityNeeded);
    });
};

// Order
function purchaseOrder(ID, amountNeeded) {
    connection.query("SELECT * FROM products WHERE ?", {item_id: ID}, function (err, res) {
        if (err) throw err;
        if (amountNeeded <= res[0].stock_quantity) {
            var totalCost = res[0].price * amountNeeded;
            console.log("Yep its in stock!");
            console.log("Your total cost for " + amountNeeded + " " + res[0].product_name + " is " + totalCost + " Thanks now either buy something else or leave!");

            connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [amountNeeded, ID]);
        } else {
            console.log("Not enough in stock try another time " + res[0].product_name + "to complete your order.");
        };
        displayProducts();
    });
};

displayProducts();