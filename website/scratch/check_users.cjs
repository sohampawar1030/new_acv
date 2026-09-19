const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

connection.query("SELECT id, name, email, role FROM users", (err, results) => {
  if (err) console.error(err);
  console.table(results);
  process.exit();
});
