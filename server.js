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
  switch (answer.start) {
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

    case "Exit":
      Exit();
      break;
  }
});





}
