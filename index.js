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
      break;

    case "Update Employee Manager":
      Update_Employee_Manager();
      break;

    case "Add Department":
      Add_Department();
      break;

    case "Add Role":
      Add_Role();
      break;

    case "Add Employee":
      Add_Employee();
      break;

    case "Remove Employee":
      Remove_Employee();
      break;

    case "Remove Department":
      Remove_Department();
      break;

    case "Remove Role":
      Remove_Role();
      break;

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
  lead.id = employee.manager_id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}


//view employes by manager
function View_Employees_By_Manager() {
  const query = `SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  CONCAT(lead.first_name, ' ', lead.last_name) AS manager,
  role.title,
  department.name AS
  department
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee lead ON lead.id = employee.manager_id
  ORDER BY manager;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}



// view emp by dept
function View_Employees_By_Department() {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department's employees you wanna see?",
      choices: [
        "IT",
        "CS",
        "HR",
        "Shayona",
        "Outreach",
        "Facilities",
        "Sabha Vyavastha"
      ],
    })
    .then((answer) => {

      switch (answer.department) {
        case "IT":
          return myViewDept("IT");
        case "CS":
          return myViewDept("CS");
        case "HR":
          return myViewDept("HR");
        case "Shayona":
          return myViewDept("Shayona");
        case "Outreach":
          return myViewDept("Outreach");
        case "Facilities":
          return myViewDept("Facilities");
        case "Sabha Vyavastha":
          return myViewDept("Sabha Vyavastha");
      }
    });

  function myViewDept(department) {
    const query = `
     SELECT employee.id,
     employee.first_name,
     employee.last_name,
     role.title,
     department.name AS department
     FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     WHERE department.name = ?;`;
    connection.query(query, department, (err, data) => {
      if (err) throw err;
      console.table(data);
      homePage();
    });
  }
}


//View Total Utilized Budget for Department
function View_Total_Utilized_Budget_for_Department() {
  const query = `SELECT department.name AS department,
  SUM(role.salary) AS utilized_budget FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  GROUP BY department.name;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    homePage();
  });
}

// adding department
function Add_Department() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "Let us know the department name you wish to add",
      },
    ])
    .then((answer) => {
      const { dept } = answer;
      connection.query(
        `INSERT INTO department (name) VALUES (?)`,
        [dept],
        (err, res) => {
          if (err) throw err;
          console.log(
            `\n-------------------\n Department ${dept} is added!\n`
          );
          View_Departments();
        }
      );
    });
}


// adding roles
function Add_Role() {
  const query = `SELECT department.name FROM department`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    const departments = data.map((item) => `${item.name}`);
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Title of the Role?",
        },
        {
          type: "input",
          name: "salary",
          message: "Salary of the Role?",
        },
        {
          type: "list",
          name: "department_name",
          message: "Department?",
          choices: [...departments],
        },
      ])
      .then((answer) => {
        const { title, salary, department_name } = answer;
        connection.query(
          `INSERT INTO role (title, salary, department_id)
             SELECT ?, ?, department.id
             FROM department
             WHERE department.name = ?`,
          [title, salary, department_name],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n-------------------\n Role ${title} is added!\n`
            );
            View_Roles();
          }
        );
      });
  });
}




// Exit Home Page
function Exit() {
  console.log("Thank you!");
  connection.end();
}

homePage();
