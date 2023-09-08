require('dotenv').config();

const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { getMenuOptions } = require('./queries');

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