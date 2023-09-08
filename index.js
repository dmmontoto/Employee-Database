require('dotenv').config();

const mysql = require('mysql2');
const inquirer = require('inquirer');
// const { getMenuOptions } = require('./queries');

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
            // Call the function to view all employees
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
            // Call the function to add a role
            break;
          case 'View All Departments':
            // Call the function to view all departments
            break;
          case 'Add Department':
            // Call the function to add a department
            break;
          case 'Quit':
            console.log('Ending session.');
            connection.end();
            break;
          default:
        }
      });
  }