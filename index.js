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
    "Add Department",
    "Add Role",
    "Add Employee",
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

    case "Add Department":
      Add_Department();
      break;

    case "Add Role":
      Add_Role();
      break;

    case "Add Employee":
      Add_Employee();
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
  CONCAT(manager.first_name, ' ', manager.last_name) AS
  manager,
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
  LEFT JOIN employee manager ON
  manager.id = employee.manager_id;`;
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

let input;
function Add_Employee() {
  const query = `SELECT id, title FROM role WHERE title NOT LIKE '%Manager%';`;
  Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    })
    .then((rolesData) => {
      const roles = rolesData.map(
        (item) => `Role title: ${item.title}, Role ID: ${item.id}`
      );

      return inquirer.prompt([
        {
          name: "first_name",
          type: "input",
          message: "Employee's first name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "Employee's last name?",
        },
        {
          name: "role",
          type: "list",
          message: "Employee's role id?",
          choices: roles,
        },
      ]);
    })
    .then((answer) => {
      input = answer;
      const query2 = `SELECT
      manager.id as manager_id,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
      WHERE manager.id IS NOT NULL
      GROUP BY manager_id;`;
      return new Promise((resolve, reject) => {
        connection.query(query2, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    })
    .then((managersData) => {
      const managers = managersData.map(
        (item) => `${item.manager_name} ID:${item.manager_id}`
      );

      return inquirer.prompt([
        {
          name: "manager",
          type: "list",
          message: "Which manager is the employee under?",
          choices: [...managers, "None"],
        },
      ]);
    })
    .then((answer) => {
      const query = `INSERT INTO employee
      (first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?, ?)`;
      connection.query(
        query,
        [
          input.first_name,
          input.last_name,
          input.role.split("ID: ")[1],
          answer.manager.split("ID:")[1],
        ],
        (err, data) => {
          if (err) throw err;
          console.log(
            `Added ${input.first_name} ${input.last_name} to the ERP`
          );
          View_Employees();
        }
      );
    });
}


function Update_Employee_Role() {
  const query = `SELECT first_name, last_name FROM employee;`;
  connection.query(query, (err, data) => {
    const employees = data.map(
      (item) => `${item.first_name} ${item.last_name}`
    );
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee you wanna update?",
          choices: employees,
        },
      ])
      .then((answer) => {

        const selectedEmployee = answer.employee.split(" ");
        const firstName = selectedEmployee[0];
        const lastName = selectedEmployee[1];
        const query = `SELECT title FROM role;`;
        connection.query(query, (err, data) => {
          // mapping all roles
          const roles = data.map((item) => item.title);
          // select new role
          inquirer
            .prompt({
              name: "role",
              type: "list",
              message: "What is the employee's new role?",
              choices: roles,
            })
            .then((answer) => {
              const query = `SELECT id FROM role WHERE title = ?`;
              connection.query(query, [answer.role], (err, data) => {
                if (err) throw err;
                const roleId = data[0].id;
                const query = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
                connection.query(
                  query,
                  [roleId, firstName, lastName],
                  (err, data) => {
                    if (err) throw err;
                    console.log(
                      `Updated ${firstName} ${lastName} to ${answer.role} role.`
                    );
                    View_Employees();
                  }
                );
              });
            });
        });
      });
  });
}


// Exit Home Page
function Exit() {
  console.log("Thank you!");
  connection.end();
}

homePage();
