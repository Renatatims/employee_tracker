require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require('mysql2');
const consoleTable = require('console.table');

const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		port: 3306,
		password: process.env.DB_PASS,
		database: 'employees_db'
	},
	console.log(`Connected to the employees_db database.`)
);

/* // Query database
   db.query('SELECT * FROM department', function (err, results) {
   console.log(results);
 });*/
db.connect(function (err) {
	if (err) throw err
	console.log("Connected!")
	userInput();
});

const questions = [
	{
		type: 'list',
		message: "What would you like to do?",
		choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"],
		name: 'userChoice'

	}]

//DEPARTMENT question
const departmentQuestion = [
	{
		type: 'input',
		message: "What is the department's name?",
		name: 'departmentName',
	}
]



// ROLE questions
const roleQuestions = [
	{
		type: 'input',
		message: "What is the name of the role?",
		name: 'roleName',

	},
	{
		type: 'input',
		message: "What is the salary of the role?",
		name: 'roleSalary',

	},
	{
		type: 'input',
		message: "Which department does the role belong to?",
		name: 'roleDepartment',

	}
]
/*
	//EMPLOYEE questions
	{
		type: 'input',
		message: "What is the employee's first name?",
		name: 'employeeFirstName',
		when: function (answer) {
			return answer.userChoice === "Add an employee";
		}
	},
	{
		type: 'input',
		message: "What is the employee's last name?",
		name: 'employeeLastName',
		when: function (answer) {
			return answer.userChoice === "Add an employee";
		}
	},
	{
		type: 'input',
		message: "What is the employee's role?",
		name: 'employeeRole',
		when: function (answer) {
			return answer.userChoice === "Add an employee";
		}
	},
	{
		type: 'list',
		message: "Who is the employee's manager?",
		name: 'employeeManager',
		choices: ["Manager1", "Manager2", "Manager3"],
		when: function (answer) {
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
]*/


// User Input Function - return answers
function userInput() {
	return inquirer.prompt(questions)
		.then(function (value) {
			switch (value.userChoice) {
				case "View all departments":
					viewDepartments();
					break;
				case "View all roles":
					viewRoles();
					break;
				case "View all employees":
					viewEmployees();
					break;
				case "Add a department":
					addDepartment();
					break;
				case "Add a role":
					addRole();
					break;
			}
		})

};
// Function View Department - display department't table 
function viewDepartments() {
	db.query("SELECT * FROM department",
		function (err, res) {
			if (err) throw err
			console.table(res)
			userInput()
		})
}

// Function View Roles - display role's table 
function viewRoles() {
	db.query("SELECT * FROM role_employee",
		function (err, res) {
			if (err) throw err
			console.table(res)
			userInput()
		})
}

// Function View Employees - to display the employee's table 
function viewEmployees() {
	db.query("SELECT * FROM employee",
		function (err, res) {
			if (err) throw err
			console.table(res)
			userInput()
		})
}

// Function Add Department - to add a new department through user's input
function addDepartment() {
	return inquirer.prompt(departmentQuestion)
		.then(function (res) {
			db.query(
				"INSERT INTO department SET ? ",
				{
					department_name: res.departmentName

				},
				function (err) {
					if (err) throw err
					console.table(res);
					userInput();
				}
			)
		})
};


// Function Add Role

function addRole() {
	return inquirer.prompt(roleQuestions)
		.then((function (res) {
			db.query(
				"INSERT INTO role_employee SET ? ",
				{
					title: res.roleName,
					salary: res.roleSalary,
					department_id: res.roleDepartment //fix department id

				},
				function (err) {
					if (err) throw err
					console.table(res);
					userInput();
				}
			)
		}))
}

// Function Add Employee

//Function update Employee

//


