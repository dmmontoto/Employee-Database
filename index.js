require('dotenv').config();

const mysql = require('mysql2');
const inquirer = require('inquirer');

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
            'Delete Employee',
            'View All Roles',
            'Add Role',
            'View Department Budget',
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
          case 'Delete Employee':
            deleteEmployee();
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
          case 'View Department Budget':
            viewDepartmentBudget();
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
    // Fetch roles from the database and populate roleChoices
    const rolesQuery = 'SELECT id, title FROM roles';

    connection.query(rolesQuery, (err, rolesResults) => {
        if (err) {
            console.error(err);
            return;
        }

        const roleChoices = rolesResults.map((result) => result.title);

        // Fetch managers from the database and populate managerChoices
        const managersQuery = 'SELECT id, first_name, last_name FROM employee';

        connection.query(managersQuery, (err, managersResults) => {
            if (err) {
                console.error(err);
                return;
            }

            const managerChoices = managersResults.map((result) => `${result.first_name} ${result.last_name}`);

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employee`s first name?',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employee`s last name?',
                    },
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: 'What is the employee`s role?',
                        choices: roleChoices, 
                    },
                    {
                        type: 'list',
                        name: 'managerChoice',
                        message: 'Who is the employee`s manager?',
                        choices: managerChoices, 
                    },
                ])
                .then((answers) => {
                    const employeeFirstName = answers.firstName;
                    const employeeLastName = answers.lastName;
                    const employeeRoleName = answers.roleChoice; 

                    // Find the corresponding role_id based on the selected role name
                    const employeeRole = rolesResults.find((role) => role.title === employeeRoleName);

                    if (!employeeRole) {
                        console.error('Selected role does not exist.');
                        return;
                    }

                    const roleID = employeeRole.id;

                    const employeeManagerName = answers.managerChoice;

                    // Find the corresponding manager_id based on the selected manager name
                    const employeeManager = managersResults.find((manager) =>
                        `${manager.first_name} ${manager.last_name}` === employeeManagerName);

                    if (!employeeManager) {
                        console.error('Selected manager does not exist.');
                        return;
                    }

                    const managerID = employeeManager.id;

                    const insertQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

                    connection.query(insertQuery, [employeeFirstName, employeeLastName, roleID, managerID], (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(`Employee "${employeeFirstName} ${employeeLastName}" added successfully.`);
                            startApp();
                        }
                    );
                });
        });
    });
}

function updateEmployee() {
    // Fetch all employees and roles from the database
    const employeesQuery = 'SELECT id, first_name, last_name FROM employee';
    const rolesQuery = 'SELECT id, title FROM roles';

    connection.query(employeesQuery, (err, employeesResults) => {
        if (err) {
            console.error(err);
            return;
        }

        const employeeChoices = employeesResults.map((result) => `${result.first_name} ${result.last_name}`);

        connection.query(rolesQuery, (err, rolesResults) => {
            if (err) {
                console.error(err);
                return;
            }

            const roleChoices = rolesResults.map((result) => result.title);

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeChoice',
                        message: 'Which employee would you like to update?',
                        choices: employeeChoices,
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select the new role for the employee:',
                        choices: roleChoices,
                    },
                ])
                .then((answers) => {
                    const employeeFullName = answers.employeeChoice;
                    const [firstName, lastName] = employeeFullName.split(' ');

                    const newRoleName = answers.newRole;

                    // Find the corresponding role_id based on the selected role name
                    const newRole = rolesResults.find((role) => role.title === newRoleName);

                    if (!newRole) {
                        console.error('Selected role does not exist.');
                        return;
                    }
                    const newRoleID = newRole.id;

                    const updateQuery = 'UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?';
                    const params = [newRoleID, firstName, lastName];

                    connection.query(updateQuery, params, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        console.log(`Employee "${firstName} ${lastName}" role updated successfully to "${newRoleName}".`);
                        startApp();
                    });
                });
        });
    });
}

function deleteEmployee() {
    // Fetch all employees from the database
    const employeesQuery = 'SELECT id, first_name, last_name FROM employee';

    connection.query(employeesQuery, (err, employeesResults) => {
        if (err) {
            console.error(err);
            return;
        }

        const employeeChoices = employeesResults.map((result) => `${result.first_name} ${result.last_name}`);

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeChoice',
                    message: 'Select an employee to remove from database:',
                    choices: employeeChoices,
                },
            ])
            .then((answers) => {
                const employeeFullName = answers.employeeChoice;
                const [firstName, lastName] = employeeFullName.split(' ');

                // Delete the selected employee
                const deleteQuery = 'DELETE FROM employee WHERE first_name = ? AND last_name = ?';
                const params = [firstName, lastName];

                // Execute the delete query
                connection.query(deleteQuery, params, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(`Employee "${firstName} ${lastName}" has been deleted.`);
                    startApp();
                });
            });
    });
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

function viewDepartmentBudget() {
    // Fetch department names from the database
    const departmentQuery = 'SELECT id, department_name FROM department';

    connection.query(departmentQuery, (err, departmentResults) => {
        if (err) {
            console.error(err);
            return;
        }

        const departmentChoices = departmentResults.map((result) => ({
            name: result.department_name,
            value: result.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'departmentChoice',
                    message: 'Select a department to view the budget:',
                    choices: departmentChoices,
                },
            ])
            .then((answers) => {
                const selectedDepartmentId = answers.departmentChoice;

                // Query to calculate the total salary budget for the selected department
                const budgetQuery = 'SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?';

                connection.query(budgetQuery, [selectedDepartmentId], (err, budgetResult) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const totalBudget = budgetResult[0].total_budget || 0;

                    console.log(`The total utilized budget for the selected department is $${totalBudget}.`);
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