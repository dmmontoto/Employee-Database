INSERT INTO department (department_name) VALUES
('HR'),
('Finance'),
('Engineering');

INSERT INTO roles (title, salary, department_id) VALUES
('HR Manager', 75000.00, 1),
('Financial Analyst', 60000.00, 2),
('Software Engineer', 80000.00, 3),
('HR Assistant', 40000.00, 1),
('Accountant', 55000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),    
('Alice', 'Johnson', 3, NULL), 
('Bob', 'Wilson', 4, 1), 
('Zach', 'Wright', 4, 1),
('Eve', 'Brown', 5, 2);     
