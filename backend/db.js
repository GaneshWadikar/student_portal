const mysql = require("mysql2");

// create the connection to database
const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "adcet_student_portal",
});

export { con };
