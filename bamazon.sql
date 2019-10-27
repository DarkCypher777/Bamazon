DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT(4) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(20) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Nintendo Switch", "Game", 299.99, 350), 
(2, "Doom", "Game", 39.99, 200), 
(3, "Playstation 4", "Game", 299.99, 42), 
(4, "Long Table", "Furniture", 74.99, 23), 
(5, "1 lb bag of Smarties", "Food", 15, 16), 
(6, "Denim Pants", "Clothing", 46, 203), 
(7, "How to be a Code Master", "Book", 17, 30), 
(8, "John Wick", "Movie", 20, 27), 
(9, "Godzilla", "Movie", 20, 62), 
(10, "Learn to Javascript", "Book", 19.99, 74)