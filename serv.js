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


let config = {
    ip: "localhost",
    port: 3000,
    database: {
        host: "localhost",
        user: "root",
        password: "",
        database: "comp523",
        port: 3306
    }
};


/*let config = {
    ip: "localhost",
    port: 3000,
    database: {
        host: "localhost",
        user: "root",
        password: "root",
        database: "523",
        port: "8889"
    }
};*/


var con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port
});

let serv = app.listen(config.port, config.ip, () => console.log('Example app listening ' + config.ip + ':' + config.port + '!'))


function getQuestions(cb) {
    con.query("SELECT * FROM questions INNER JOIN answers ON questions.question_id = answers.question_id", function (err, result, fields) {
        if (err) throw err;
        questions = result;
        //console.log(questions)
        result = { questlist: [] }
        i = 0;
        while(i < questions.length) {
            id = questions[i].question_id;
            idx = result.questlist.push({ question: questions[i].question, answers: [] }) - 1;
            result.questlist[idx].answers.push(questions[i].answer);
            i++;
            while(questions[i] != undefined && questions[i].question_id == id) {
                result.questlist[idx].answers.push(questions[i].answer);
                i++;
            }
        }
        cb(result)
    });
}

let questions;

getQuestions((quest) => {
    questions = quest;
    //console.log(questions.questlist[0].answer);
})


app.get('/', (req, res) => {
    //console.log(questions);
    res.render('index', questions);
})
