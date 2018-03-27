const express = require('express'),
    path = require('path'),
    mysql = require('mysql'),
    app = express(),
    bodyparser = require('body-parser');

app.set('view engine', 'pug');
app.use(bodyparser.json()); // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('./public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

/*
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
*/


let config = {
    ip: "localhost",
    port: 3000,
    database: {
        host: "localhost",
        user: "root",
        password: "",
        database: "comp523",
        port: "3306"
    }
};


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

var con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port
});

con.query("SELECT * FROM Questions", function(err, result, fields) {
    if(err) {
        console.log("Could not connect to host", config.database.host);
        throw err;
    }
})

let serv = app.listen(config.port, config.ip, () => console.log('Example app listening ' + config.ip + ':' + config.port + '!'))


function getQuestions(cb) {
    con.query("SELECT * FROM Questions INNER JOIN Answers ON Questions.question_id = Answers.question_id", function (err, result, fields) {
        if (err) throw err;
        questions = result;
        //console.log(questions)
        result = { questlist: [] }
        answers = { questlist: [] }

        i = 0;
        while(i < questions.length) {
            id = questions[i].question_id;
            idx = result.questlist.push({ id: id, question: questions[i].question, answers: [] }) - 1;
            answers.questlist.push({ id: id, answer_id: null });
            result.questlist[idx].answers.push({text: questions[i].answer, ans_id: questions[i].answer_id });
            i++;
            while(questions[i] != undefined && questions[i].question_id == id) {
                if(questions[i].correct_answer >= 1) {
                    answers.questlist[idx].answer_id = questions[i].answer_id;
                }
                //result.questlist.answer_id = (parseInt(questions[i].correct_answer) >= 1) ? questions[i].answer_id : null;
                result.questlist[idx].answers.push({text: questions[i].answer, ans_id: questions[i].answer_id });
                i++;
            }
        }
        cb(result)
    });
}

let questions;

getQuestions((quest) => {
    questions = quest;


require('./controllers/main.js')(app,questions,answers);

    //console.log(questions.questlist[0].answer);
})
