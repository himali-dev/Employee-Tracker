-- Database Creation
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

-- Pointing to employees database
USE employees;

-- Department Table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
