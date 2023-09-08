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
            addEmployee();
            break;
          case 'Update Employee Role':
            updateEmployee();
            break;
          case 'View All Roles':
            connection.query('SELECT * FROM roles', function (err, results) {
                if (err) {
                  console.error(err);
                  return;
                }
              
                console.table(results); 
                startApp();
              });
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

  function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee`s first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee`s last name?'
        },
        {
            type: 'list',
            name: 'roleChoice',
            message: 'What is the employee`s role?',
            choices: , 
        },
        {
            type: 'list',
            name: 'managerChoice',
            message: 'Who is the employee`s manager?',
            choices: , 
        },
    ])
  }

  function addRole() {
    // Fetch department names from the database
    const departmentQuery = 'SELECT department_name FROM department';

    connection.query(departmentQuery, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        const departmentChoices = results.map((result) => result.department_name);

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
                    choices: departmentChoices, 
                },
            ])
            .then((answers) => {
                const roleName = answers.role;
                const roleSalary = parseFloat(answers.salary);
                const departmentName = answers.departmentChoice;

                // Check if the role already exists in the chosen department
                const checkRoleQuery = 'SELECT * FROM roles WHERE title = ? AND department_id = (SELECT id FROM department WHERE department_name = ?)';
                
                connection.query(checkRoleQuery, [roleName, departmentName], (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    if (results.length > 0) {
                        console.log(`Role "${roleName}" already exists in the department "${departmentName}".`);
                    } else {
                        // Role doesn't exist, add it to the database
                        const addRoleQuery = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE department_name = ?))';

                        connection.query(addRoleQuery, [roleName, roleSalary, departmentName], (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(`Role "${roleName}" added successfully to the department "${departmentName}".`);
                        });
                    }
                    startApp();
                });
            });
    });
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
            } else {
                // Department doesn't exist, add it to the database
                const addQuery = 'INSERT INTO department (department_name) VALUES (?)';

                connection.query(addQuery, [departmentName], (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`Department "${departmentName}" added successfully.`);
                });
            }
            startApp();
        });
    });
}

module.exports = {
    connection,
};
