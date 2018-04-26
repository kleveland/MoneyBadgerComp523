const express = require('express'),
    path = require('path'),
    mysql = require('mysql'),
    app = express(),
    bodyparser = require('body-parser'),
    session = require('express-session'),
    multer = require('multer'),
    csv = require('fast-csv'),
    fs = require('fs');

// dependency needed for csv upload.
var upload = multer({storage: multer.memoryStorage()}).any();

app.set('view engine', 'pug'); // set view engine to PUG
app.use(bodyparser.json()); // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'testsecrettestsecrettestsecret',
    cookie: {
        maxAge: 60000
    }
}))
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



// Info about loca DB connection
let config = {
    ip: "localhost",
    port: 3000,
    database: {
        host: "localhost",
        user: "root",
        password: "root",
        database: "523",
        port: "8889"
    }
};

// DO NOT CHANGE!!!!
config.port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
config.ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

if (process.env.OPENSHIFT_MYSQL_PASSWORD) {
    config.database.host = process.env.MYSQL_SERVICE_HOST;
    config.database.port = process.env.MYSQL_SERVICE_PORT;
    config.database.user = process.env.OPENSHIFT_MYSQL_USER;
    config.database.password = process.env.OPENSHIFT_MYSQL_PASSWORD;
    config.database.database = process.env.OPENSHIFT_MYSQL_DATABASE;
}


console.log(config);
// Creating connection with DB
var con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port
});
// TESTING DB connection
con.query("SELECT * FROM questions", function (err, result, fields) {
    if (err) {
        console.log("Could not connect to host", config.database.host);
        throw err;
    }
})

let serv = app.listen(config.port, config.ip, () => console.log('Example app listening ' + config.ip + ':' + config.port + '!'))

// Files from models. Functions for DB access and changes.
const dbquiz = require('./models/dbquiz.js'),
      dbuser = require('./models/dbuser.js');
dbuser.setCon(con);
dbuser.setDbQuiz(dbquiz);
dbquiz.setCon(con);

// controller files.
require('./controllers/main.js')(app, dbquiz, dbuser);
require('./controllers/admin.js')(app, dbquiz, dbuser, upload, csv,fs);
