const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require('mysql2');

const db = mysql.createConnection(
	{
	  host: 'localhost',
	  user: 'root',
	  password: process.env.DB_PASS,
	  database: 'employees_db'
	},
	console.log(`Connected to the employees_db database.`)
  );

  // Query database
	db.query('SELECT * FROM department', function (err, results) {
	console.log(results);
  });


const questions = [
	{
		type: 'list',
		message: "What would you like to do?",
		choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"],
		name: 'userChoice'

	},
    //DEPARTMENT questions
    {
		type: 'input',
		message: "What is the department's name?",
		name: 'departmentName',
		when: function (answer){
			return answer.userChoice === "Add a department";
		}
	},
    // ROLE questions
	{
		type: 'input',
		message: "What is the name of the role?",
		name: 'roleName',
		when: function (answer){
			return answer.userChoice === "Add a role";
		}
	},
    {
		type: 'input',
		message: "What is the salary of the role?",
		name: 'roleSalary',
		when: function (answer){
			return answer.userChoice === "Add a role";
		}
	},
    {
		type: 'input',
		message: "Which department does the role belong to?",
		name: 'roleDepartment',
		when: function (answer){
			return answer.userChoice === "Add a role";
		}
	},
    //EMPLOYEE questions
    {
		type: 'input',
		message: "What is the employee's first name?",
		name: 'employeeFirstName',
		when: function (answer){
			return answer.userChoice === "Add an employee";
		}
	},
    {
		type: 'input',
		message: "What is the employee's last name?",
		name: 'employeeLastName',
		when: function (answer){
			return answer.userChoice === "Add an employee";
		}
	},
    {
		type: 'input',
		message: "What is the employee's role?",
		name: 'employeeRole',
		when: function (answer){
			return answer.userChoice === "Add an employee";
		}
	},
    {
		type: 'list',
		message: "Who is the employee's manager?",
		name: 'employeeManager',
        choices: ["Manager1", "Manager2", "Manager3"],
		when: function (answer){
			return answer.userChoice === "Add an employee";
		}
	},
    //Back to main menu
	{
		type: 'list',
		message: "Please select another option",
		choices: ["Back to Main menu", "Exit application"],
		name: 'questionAdd',
	},
]


// User Input Function - return answers
function userInput() {
	return inquirer.prompt(questions);

};

userInput();

