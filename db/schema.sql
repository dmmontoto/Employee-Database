-- Drop the database if it exists
DROP DATABASE IF EXISTS employee_db;

-- Create the database
CREATE DATABASE employee_db;

-- Use the database
USE employee_db;

-- Create the department table
CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- Create the roles table
CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Create the employee table
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
