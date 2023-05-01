INSERT INTO department (name)
VALUES  ('IT'),
        ('CS'),
        ('HR'),
        ('Shayona'),
        ('Outreach'),
        ('Facilities'),
        ('Sabha Vyavastha');


INSERT INTO role (title, salary, department_id)
VALUES  ('Developer', 500000, 1),
        ('BSA', 40000, 7),
        ('HSA', 70000, 2),
        ('TL', 10000, 6),
        ('Data Engineer', 1000, 3),
        ('Full Stack Engineer', 90000, 3),
        ('Front End Engineer', 130000, 4),
        ('TA', 70000, 4),
        ('Housekeeper', 160000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Himali', 'Panchal', 1, NULL),
        ('Shahnaz', 'Patel', 2, 1),
        ('Sheela', 'Devi', 3, NULL),
        ('Sunny', 'Rustom', 4, 3),
        ('Happy', 'Singh', 5, NULL),
        ('Mister', 'Bird', 6, 5),
        ('Paris', 'Chanel', 7, NULL),
        ('Kiran', 'Bedi', 8, 7),
        ('India', 'Johns', 1, NULL);
        ('Pooja', 'Patil', 2, NULL);
        ('Jenil', 'Narola', 4, NULL);
