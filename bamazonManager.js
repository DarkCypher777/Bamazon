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
        choices: ["Products on Sale", "Low Inventory", "Restock Inventory", "Add New Product"] //"Remove Existing Product"
    }]).then(function (answer) {
        switch (answer.action) {
            case "Products on Sale":
                displayInventory();
                break;
            case "Low Inventory":
                displayLowInventory();
                break;
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

function displayLowInventory() {
    queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Low Inventory Items (below 100): ');
        console.log('................................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + '  //  ';
            strOut += 'Product Name: ' + data[i].product_name + '  //  ';
            strOut += 'Department: ' + data[i].department_name + '  //  ';
            strOut += 'Price: $' + data[i].price + '  //  ';
            strOut += 'Quantity: ' + data[i].stock_quantity + '\n';
            console.log(strOut);
        }
        console.log("---------------------------------------------------------------------\n");
        connection.end();
    })
}

function restockRequest() {
    inquirer.prompt([{
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item ID for quantity update.',
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?',
            filter: Number
        }
    ]).then(function (input) {
        var item = input.item_id;
        var addQuantity = input.quantity;
        var queryStr = 'SELECT * FROM products WHERE ?';
        connection.query(queryStr, {
            item_id: item
        }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                addInventory();

            } else {
                var productData = data[0];
                console.log('Updating Inventory...');
                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
                connection.query(updateQueryStr, function (err, data) {
                    if (err) throw err;
                    console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
                    console.log("\n---------------------------------------------------------------------\n");
                    connection.end();
                })
            }
        })
    })
}

// Add New Product
function addRequest() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "Add ID Number"
    }, {
        name: "Name",
        type: "input",
        message: "What is the name of the product?"
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
        var name = answer.Name;
        var category = answer.Category;
        var price = answer.Price;
        var quantity = answer.Quantity;
        console.log(name);
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)", [name, category, price, quantity]);
        displayInventory();
    });
};

// Remove Product [WIP]
// function removeRequest() {
//     inquirer.prompt([{
//         name: "ID",
//         type: "input",
//         message: "What is the id number of the item you wish to remove?"
//     }]).then(function (answer) {
//         var id = answer.ID;
//         removeInventory(id);
//     });
// };

// function removeInventory(id) {
//     connection.query("DELETE FROM Products Where item_id = ?" + id);
//     displayInventory();
// };

displayInventory();