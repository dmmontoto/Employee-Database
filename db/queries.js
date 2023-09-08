// Import the database connection configuration from index.js
const connection = require('../index').connection; // Update the path as needed

// Function to retrieve all employees
function viewAllEmployees() {
  return new Promise((resolve, reject) => {
    // Define your SQL query to fetch all employees
    const query = 'SELECT * FROM employee';

    // Execute the query
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      // Resolve with the retrieved employee data
      resolve(results);
    });
  });
}

module.exports = {
  viewAllEmployees,
};
