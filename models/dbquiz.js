let con = null;
module.exports = {

    setCon(conn) {
        con = conn;
    },

    getQuizes: function (cb) {
        con.query("SELECT * FROM Quiz", function (err, result, fields) {
            cb(result);
        })
    },

    getQuiz: function (quizid, cb) {
        con.query("SELECT * FROM Quiz INNER JOIN Questions ON Quiz.quiz_id = Questions.quiz_id INNER JOIN Answers ON Questions.question_id = Answers.question_id WHERE Questions.quiz_id = " + quizid, function (err, result, fields) {
            if (err) throw err;
            let questions = result;
            console.log("QUESTIONS")
            console.log(questions);
            //console.log(questions)
            result = {
                questlist: []
            }
            let answers = {
                questlist: []
            }

            i = 0;
            while (i < questions.length) {
                id = questions[i].question_id;
                idx = result.questlist.push({
                    id: id,
                    question: questions[i].question,
                    answers: []
                }) - 1;
                if (questions[i].correct_answer >= 1) {
                    answers.questlist.push({
                        id: id,
                        answer_id: questions[i].answer_id
                    });
                } else {
                    answers.questlist.push({
                        id: id,
                        answer_id: null
                    });
                }
                result.questlist[idx].answers.push({
                    text: questions[i].answer,
                    ans_id: questions[i].answer_id
                });
                i++;
                while (questions[i] != undefined && questions[i].question_id == id) {
                    console.log("TEST", questions[i].correct_answer, i);
                    if (questions[i].correct_answer >= 1) {
                        answers.questlist[idx].answer_id = questions[i].answer_id;
                    }
                    //result.questlist.answer_id = (parseInt(questions[i].correct_answer) >= 1) ? questions[i].answer_id : null;
                    result.questlist[idx].answers.push({
                        text: questions[i].answer,
                        ans_id: questions[i].answer_id
                    });
                    i++;
                    console.log("TEST2", questions[i], id, i)
                }
            }
            cb(result, answers)
        });
    },

    postQuiz: function (name, startdate, duedate, questions, cb) {
        let quizdat = [
            [name, startdate, duedate]
        ]
        con.query("INSERT INTO Quiz (quiz_name, start_date, due_date) VALUES ?", [quizdat], function (err, result, fields) {
            console.log("111");
            if (err) throw err;
            let quizId = result.insertId;
            let questlist = [];
            for (let i = 0; i < questions.length; i++) {
                questlist.push([questions[i].question_html, result.insertId]);
            }
            console.log(questlist);
            con.query("INSERT INTO Questions (question, quiz_id) VALUES ?", [questlist], function (err, result, fields) {
                console.log("222");
                if (err) throw err;
                let anslist = [];
                for (let i = 0; i < questions.length; i++) {
                    for (let j = 0; j < questions[i].answers.length; j++) {
                        let correctinp = (questions[i].answers[j].correct === 'true') ? 1 : 0;
                        anslist.push([questions[i].answers[j].text, correctinp, (result.insertId + i)]);
                    }
                }
                console.log(anslist);
                con.query("INSERT INTO Answers (answer, correct_answer, question_id) VALUES ?", [anslist], function (err, result, fields) {
                    console.log("333");
                    if (err) throw err;
                    console.log("Quiz " + name + " successfully submitted.");
                    cb(quizId);
                })
            })
        })
    }
}
