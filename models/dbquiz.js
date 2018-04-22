let con = null;

module.exports = {

    setCon(conn) {
        con = conn;
    },

    getQuizes: function (cb) {
        con.query("SELECT * FROM quiz", function (err, result, fields) {
            cb(result);
        })
    },

    getOpenQuizes: function (user, cb) {
        con.query("SELECT * FROM quiz INNER JOIN open_quiz ON quiz.quiz_id = open_quiz.quiz_id WHERE user_id = " + user, function (err, result) {
            if (err) throw err;
            cb(result);
        });
    },

    verifyQuizAccess: function (quizid, pid, cb) {
        con.query("SELECT * FROM open_quiz WHERE quiz_id = " + quizid + " AND user_id = " + pid, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                cb(true);
            } else {
                cb(false);
            }
        })
    },

    getQuiz: function (quizid, cb) {
        con.query("SELECT * FROM quiz INNER JOIN questions ON quiz.quiz_id = questions.quiz_id INNER JOIN answers ON questions.question_id = answers.question_id WHERE questions.quiz_id = " + quizid, function (err, result, fields) {
            if (err) throw err;
            let questions = result;
            console.log("QUESTIONS");
            console.log(questions);
            //console.log(questions)
            result = {
                questlist: []
            }
            let answers = {
                questlist: []
            }
            if (questions.length >= 1) {
                result.quiz_id = questions[0].quiz_id;
                answers.quiz_id = questions[0].quiz_id;
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

    postQuiz: function (name, questions, cb) {
        let quizdat = [
            [name]
        ]
        con.query("INSERT INTO quiz (quiz_name) VALUES ?", [quizdat], function (err, result, fields) {
            console.log("111");
            if (err) throw err;
            let quizId = result.insertId;
            let questlist = [];
            for (let i = 0; i < questions.length; i++) {
                questlist.push([questions[i].question_html, result.insertId]);
            }
            console.log(questlist);
            con.query("INSERT INTO questions (question, quiz_id) VALUES ?", [questlist], function (err, result, fields) {
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
                con.query("INSERT INTO answers (answer, correct_answer, question_id) VALUES ?", [anslist], function (err, result, fields) {
                    console.log("333");
                    if (err) throw err;
                    console.log("Quiz " + name + " successfully submitted.");
                    cb(quizId);
                })
            })
        })
    },

    openQuiz: function (pid, quiz, cb) {
        let vals = [];
        if (Array.isArray(pid) && pid.length > 1) {
            for (let i = 0; i < pid.length; i++) {
                vals.push([pid[i], quiz]);
            }
        } else {
            vals.push([pid, quiz]);
        }
        console.log(vals);

        con.query("INSERT INTO open_quiz (user_id, quiz_id) VALUES ?", [vals], function (err, result, fields) {
            if (err) throw err;
            console.log("Opened Quiz!");
            cb();
        })
    },

    closeQuiz: function (pid, quiz, cb) {
        let vals = [];
        if (Array.isArray(pid) && pid.length > 1) {
            for (let i = 0; i < pid.length; i++) {
                vals.push([pid[i], quiz]);
            }
        } else {
            vals.push([pid, quiz]);
        }
        console.log(vals);
        con.query("DELETE FROM open_quiz WHERE (user_id,quiz_id) IN (?)", [vals], function (err, result, fields) {
            if (err) throw err;
            console.log("Closed Quiz!");
            cb();
        })
    },

    quizSubmission: function (pid, quizid, questions, cb) {
        console.log("QUESTION FOMRAT", questions);
        con.query("INSERT INTO quiz_submission (pid, quiz_id, timestamp) VALUES (" + pid + "," + quizid + ",NOW()) ON DUPLICATE KEY UPDATE timestamp=NOW()", function (err, result, fields) {
            if (err) throw err;
            let correctInp = questions.correct ? 1 : 0;
            con.query("INSERT IGNORE INTO quiz_submission_answers (submission_id, question_id, answer_id, correct) VALUES (?)", [[parseInt(result.insertId), parseInt(questions.quest_id), parseInt(questions.answer_id), parseInt(correctInp)]],
                function (err, result, fields) {
                    if (err) throw err;
                    console.log("Submission of question success.");
                    cb();
                })
        });
    },

    quizGetSubmission: function (pid, quizid, cb) {
        con.query("SELECT * FROM quiz_submission_answers WHERE submission_id = (SELECT DISTINCT id FROM quiz_submission WHERE quiz_id = " + quizid + " AND pid = " + pid + ")", function (err, result, fields) {
            if (err) throw err;
            console.log("Recieved get submission.");
            console.log(result);
            cb(result);
        })
    }
}
