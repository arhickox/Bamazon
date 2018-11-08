var mysql = require('mysql');
var inquirer = require('inquirer');

// Connection to MYSQL Database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

//connect to the MYSQL server
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query('SELECT * FROM products', function (err, results) {
        inquirer
            .prompt([
                {
                    //Question: What do you want to buy?
                    name: 'selection',
                    type: 'input',
                    message: 'What item would you like to buy? (Input ID)'
                },
                {
                    //Question: How many do you want to buy?
                    name: 'amount',
                    type: 'input',
                    message: 'How many would you like to buy?'
                }

            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                //check if the asked amount excedes available quantity
                //If it doesn't excede, reduce quantity by amount
                if (chosenItem.stock_quantity > parseInt(answer.amount)) {
                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [
                            stock_quantity: stock_quantity - answer.amount
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log('Item(s) Purchased. Database Quantity Updated.');
                            start();
                        }
                    );
                //if it excedes, post error message 
                } else {
                    console.log('Your amount exceeded the quantity available, please try again.');
                    start();
                }

            });
    });
}
