// call the reuqired modules
const inquirer = require("inquirer");
const connection = require("./db/connection.js");
require("console.table");

const homePage = () => {

inquirer.prompt({
  name: "first",
  type: "list",
  message: "What would you like to do",
  choices: [
    "View Departments",
    "View Roles",
    "View Employees",
    "View Employees By Manager",
    "View Employees By Department",
    "View Total Utilized Budget for Department",
    "Update Employee Role",
    "Update Employee Manager",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Remove Employee",
    "Remove Department",
    "Remove Role",
    "Exit"
  ]
})
.then((answer) => {
  // console.log(answer);
  switch (answer.first) {
    case "View Departments":
      View_Departments();
      break;

    case "View Roles":
      View_Roles();
      break;

    case "View Employees":
      View_Employees();
      break;

    case "View Employees By Manager":
      View_Employees_By_Manager();
      break;

    case "View Employees By Department":
      View_Employees_By_Department();
      break;

    case "View Total Utilized Budget for Department":
      View_Total_Utilized_Budget_for_Department();
      break;

    case "Update Employee Role":
      Update_Employee_Role();

    case "Update Employee Manager":
      Update_Employee_Manager();

    case "Add Department":
      Add_Department();

    case "Add Role":
      Add_Role();

    case "Add Employee":
      Add_Employee();

    case "Remove Employee":
      Remove_Employee();

    case "Remove Department":
      Remove_Department();

    case "Remove Role":
      Remove_Role();

    case "Exit":
      Exit();
      break;
  }
});
};

//view departments
function View_Departments() {
  const query = `SELECT
  department.id,
  department.name FROM
  department;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}

//view roles
function View_Roles() {
  const query = `SELECT
  role.id,
  role.title,
  role.salary,
  department.name AS department
  FROM role
  LEFT JOIN department ON
  role.department_id = department.id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}

//view employes
function View_Employees() {
  const query = `SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  CONCAT(lead.first_name, ' ', lead.last_name) AS
  Lead,
  role.title,
  department.name AS
  department,
  role.salary
   FROM
  employee
  LEFT JOIN role ON
  employee.role_id = role.id
  LEFT JOIN department ON
  role.department_id = department.id
  LEFT JOIN employee lead ON
  manager.id = employee.manager_id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}

// Exit Home Page
function Exit() {
  console.log("Thank you!");
  connection.end();
}

homePage();
