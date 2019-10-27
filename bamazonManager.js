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

// Display Inventory
var displayInventory = function () {
    connection.query("Select * FROM products", function (err, res) {
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
        inquirerForUpdate();
    });
};

// Inventory Manager
function inquirerForUpdate() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose a command below to manage inventory",
        choices: ["Restock Inventory", "Add New Product", "Remove Existing Product"]
    }]).then(function (answer) {
        switch (answer.action) {
            case "Restock Inventory":
                restockRequest();
                break;
            case "Add New Product":
                addRequest();
                break;
            case "Remove Existing Product":
                removeRequest();
                break;
        }
    });
};

// Restock
function restockRequest() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "What's the item number of the item you want to restock?"
    }, {
        name: "Quantity",
        type: "input",
        message: "What is the quantity you would like to add?"
    }, ]).then(function (answer) {
        var quantityAdded = answer.Quantity;
        var ProductID = answer.ID;
        restockInventory(ProductID, quantityAdded);
    });
};

// Restock Inventory
function restockInventory(id, invQuantity) {
    connection.query("SELECT * FROM Products Where item_id = " + id, function (err, res) {
        if (err) throw err;
        connection.query("UPDATE Products SET stock_quantity" + stock_quantity + "WHERE item_id = " + item_id);
        displayInventory();
    });
};

function addRequest() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "Add ID Number"
    }, {
        name: "Name",
        type: "input",
        message: "What is the category for product?"
    }, {
        name: "Category",
        type: "input",
        message: "What is the category for product?"
    }, {
        name: "Price",
        type: "input",
        message: "What is the price for the item?"
    }, {
        name: "Quantity",
        type: "input",
        message: "What is the quantity you would like to add?"
    }, ]).then(function (answer) {
        var id = answer.id;
        var name = answers.Name;
        var category = answer.Category;
        var price = answer.Price;
        var quantity = answer.Quantity;
        buildNewItem(id, name, category, price, quantity);
    });
};

function buildNewItem(name, category, price, quantity) {
    connection.query('INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES("' + id + '","' + name + '","' + category + '",' + price + ',' + quantity + ')');
    displayInventory();
};

function removeRequest() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "What is the id number of the item you wish to remove?"
    }]).then(function (answer) {
        var id = answer.ID;
        removeInventory(id);
    });
};

function removeInventory(id) {
    connection.query("DELETE FROM Products Where item_id = " + id);
    displayInventory();
};

displayInventory();