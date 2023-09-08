require('dotenv').config();

const mysql = require('mysql2');
const inquirer = require('inquirer');
const { viewAllEmployees } = require('./db/queries');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
    startApp();
});

function startApp() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'menuChoice',
          message: 'What would you like to do?',
          choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit', 
          ],
        },
      ])
      .then((answers) => {
        switch (answers.menuChoice) {
          case 'View All Employees':
            connection.query('SELECT * FROM employee', function (err, results) {
                if (err) {
                  console.error(err);
                  return;
                }
              
                console.table(results); 
                startApp();
              });
            break;
          case 'Add Employee':
            // Call the function to add an employee
            break;
          case 'Update Employee Role':
            // Call the function to update an employee's role
            break;
          case 'View All Roles':
            // Call the function to view all roles
            break;
          case 'Add Role':
            addRole();
            break;
          case 'View All Departments':
            connection.query('SELECT * FROM department', function (err, results) {
                if (err) {
                  console.error(err);
                  return;
                }
              
                console.table(results); 
                startApp();
              });
            break;
          case 'Add Department':
            addDepartment();
            break;
          case 'Quit':
            console.log('Ending session.');
            connection.end();
            break;
          default:
        }
      });
  }

function addRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'departmentChoice',
            message: 'Which department does the role belong to?',
            choices: [

            ],
          },
    ])
}

function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?'
        },
    ])
    .then((answers) => {
        const departmentName = answers.department;

        // Check if the department already exists
        const checkQuery = 'SELECT * FROM department WHERE department_name = ?';

        connection.query(checkQuery, [departmentName], (err, results) => {
            if (err) {
                console.error(err);
                return;
            }

            if (results.length > 0) {
                console.log(`Department "${departmentName}" already exists.`);
                startApp();
            } else {
                // Department doesn't exist, add it to the database
                const addQuery = 'INSERT INTO department (department_name) VALUES (?)';

                connection.query(addQuery, [departmentName], (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`Department "${departmentName}" added successfully.`);
                    startApp();
                });
            }
        });
    });
}

module.exports = {
    connection,
};
