const express = require('express'),
      path = require('path'),
      mysql = require('mysql'),
      app = express();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "523",
  port:"8889"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM questions", function (err, result, fields) {
    if (err) throw err;
    questions = JSON.stringify(result);
    console.log(questions);
  });
  con.query("SELECT * FROM answers", function (err, result, fields) {
    if (err) throw err;
    answers = JSON.stringify(result);
    console.log(answers);
  });
});

app.get('/', (req, res) => {
    res.render('index');
})
