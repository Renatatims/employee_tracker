require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require('mysql2');
const consoleTable = require('console.table');
const cfonts = require('cfonts');


//MySQL - Create Connection
const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		port: 3306,
		password: process.env.DB_PASS,
		database: 'employees_db'
	},
	//console.log(`Connected to the employees_db database.`)
	cfonts.say('Employee Manager', {
		font: 'block',              // define the font face
		align: 'left',              // define text alignment
		colors: ['blue'],         // define all colors
		background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
		letterSpacing: 1,           // define letter spacing
		lineHeight: 1,              // define the line height
		space: true,                // define if the output text should have empty lines on top and on the bottom
		maxLength: '0',             // define how many character can be on one line
		gradient: false,            // define your two gradient colors
		independentGradient: false, // define if you want to recalculate the gradient for each new line
		transitionGradient: false,  // define if this is a transition between colors directly
		env: 'node'                 // define the environment cfonts is being executed in
	})
);

db.connect(function (err) {
	if (err) throw err
	console.log("Connected!")
	userInput();
});

//MAIN question
const questions = [
	{
		type: 'list',
		message: "What would you like to do?",
		choices: [
			"View all departments", 
			"Add a department", 
			"Delete a department",
			"View all roles", 
			"Add a role", 
			"View all employees",   
			"Add an employee", 
			"Update an employee role", 
			"View Total Budget", 
			],
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
		type: 'number',
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
				case "View Total Budget":
					totalBudget();
					break;
				case "Delete a department":
					deleteDepartments();
					break;
				case "Delete Role":
					deleteRoles();
					break;

			}
		})

};
// Function View Department - display department't table 
async function viewDepartments() {
	//db.query("SELECT department.id AS id, department.department_name AS name FROM department")
	const res = await db.promise().query("SELECT department.id AS id, department.department_name AS name FROM department")
	console.table(res[0])
	userInput()
};


// Function View Roles - display role's table 
function viewRoles() {
	db.query("SELECT role_employee.id, role_employee.title, department.department_name AS department, role_employee.salary AS salary FROM role_employee INNER JOIN department ON role_employee.department_id = department.id ",
		function (err, res) {
			if (err) throw err
			console.table(res)
			userInput()
		})
}

// Function View Employees - to display the employee's table 
function viewEmployees() {
	db.query("SELECT employee.id, employee.first_name, employee.last_name, role_employee.title, department.department_name AS department, role_employee.salary, CONCAT(empManager.first_name, ' ' ,empManager.last_name) AS manager FROM employee INNER JOIN role_employee on role_employee.id = employee.role_id INNER JOIN department on department.id = role_employee.department_id LEFT JOIN employee empManager ON employee.manager_id = empManager.id",
		//"SELECT * FROM employee JOIN role_employee ON employee.role_id = role_employee.id JOIN department ON role_employee.department_id = department.id",
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
					//console.table(res);
					console.log(`Added ${res.departmentName} to the database`)
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
							//console.table(res);
							console.log(`Added ${res.roleName} to the database`)
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
									console.log(`Added ${res.employeeFirstName} ${res.employeeLastName} to the database`)
									//console.log (`Manger ${res.employeeManager} selected`);
									//console.log (employee[0]);
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
			message: "Which employee's role needs to update?",
			name: "id",
			choices: employeeQuestions[0]

		},
		{
			type: "list",
			message: "Which is the employee's new role?",
			name: "role_id",
			choices: roleQuestions[0]
		}

	])
	await db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id])
	console.log("Updated employee's role");
	userInput();
}

// Total Budget
async function totalBudget() {
	//db.query("SELECT role_employee.salary SUM(role_employee.salary) AS Budget FROM role_employee")
	const totalB = await db.promise().query("SELECT SUM(role_employee.salary) AS Total_Budget FROM role_employee")
	console.log('\n');
	console.table(totalB[0]);
	userInput();
}


// Delete Departments
async function deleteDepartments() {
	const answer = await inquirer.prompt([
		{
			name: "deleteDepartment",
			type: "input",
			message: "Please type the department you would like to delete"
		}

	])
	if (answer) {
		await db.promise().query(`DELETE FROM department WHERE department_name="${answer.deleteDepartment}"`)
		console.log(`The following department was deleted: ${answer.deleteDepartment}`);
		userInput();
	}

};

