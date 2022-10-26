/*
INSERT INTO department (department_name)
VALUES ("Purchasing"),
       ("Sales"),
       ("Accounting"),
       ("Legal"),
       ("IT");

INSERT INTO role_employee (title, salary, department_id)
VALUES ("Purchasing Manager",120000,1),
       ("Purchaser",90000,1),
       ("Salesperson",90000,2),
       ("Sales Lead",110000,2),
       ("Accountant",100000,3),
       ("Accounting Manager",120000,3),
       ("Lawyer",180000,4),
       ("Lead Engineer", 160000, 5);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brenda", "B.",1 ,null),
("Amy", "A.",2,1),
("Cassie", "C.",4,null),
("Drake", "D.",3,3),
("John" , "J.",6,null),
("Mike", "M.",5,5),
("Olivia", "O.",7,null),
("Sam", "S.", 8, null);

*/