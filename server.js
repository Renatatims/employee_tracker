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

	}

]

//EMPLOYEE questions
const employeeQuestions = [
	{
		type: 'input',
		message: "What is the employee's first name?",
		name: 'employeeFirstName',
	},
	{
		type: 'input',
		message: "What is the employee's last name?",
		name: 'employeeLastName',
	},
]

/*
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
				case "Add an employee":
					addEmployee();
					break;
				case "Update an employee role":
					updateEmployee();
					break;

			}
		})

};
// Function View Department - display department't table 
async function viewDepartments() {
	db.query("SELECT * FROM department")
	const res = await db.promise().query("SELECT * FROM department")
	console.table(res[0])
	userInput()
};


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
	const departmentQ = {
		type: 'list',
		message: "Which department does the role belong to?",
		name: 'roleDepartment',

	}
	db.promise().query("SELECT id AS value, department_name AS name FROM department")
		.then(dept => {
			console.log(dept);
			departmentQ.choices = dept[0]
			roleQuestions.push(departmentQ)

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
		})
}

// Function Add Employee

function addEmployee() {
	const employeeRoleQ = {
		type: 'list',
		message: "What is the employee's role?",
		name: 'employeeRole',
	}

	const employeeManagerQ = {
		type: 'list',
		message: "Who is the employee's manager?",
		name: 'employeeManager',
	}

	db.promise().query("SELECT id AS value, title AS name FROM role_employee")
		.then(role => {
			employeeRoleQ.choices = role[0]
			employeeQuestions.push(employeeRoleQ)
			db.promise().query("SELECT id AS value, first_name AS name FROM employee")
				.then(employee => {
					employeeManagerQ.choices = employee[0]
					employeeQuestions.push(employeeManagerQ)
					return inquirer.prompt(employeeQuestions)
						.then((function (res) {
							db.query(
								"INSERT INTO employee SET ? ",
								{
									first_name: res.employeeFirstName,
									last_name: res.employeeLastName,
									role_id: res.employeeRole,
									manager_id: res.employeeManager


								},
								function (err) {
									if (err) throw err
									console.table(res);
									userInput();
								}
							)
						}))
				})
		})
}

//Function update Employee
async function updateEmployee() {
	const roleQuestions = await db.promise().query("SELECT id AS value, title AS name FROM role_employee")
	const employeeQuestions = await db.promise().query("SELECT id AS value, first_name AS name FROM employee")
	const answers = await inquirer.prompt([
		{
			type: "list",
			message: " What employee needs to update?",
			name: "id",
			choices: employeeQuestions[0]

		},
		{
			type: "list",
			message: " Which is the employee's new role?",
			name: "role_id",
			choices: roleQuestions[0]
		}

	])
	await db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id])
	console.log("Employee id");
	userInput();
}

//


