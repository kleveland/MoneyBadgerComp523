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



    getUserQuizes: function (pid, cb) {
        con.query("SELECT * FROM quiz INNER JOIN quiz_submission ON quiz.quiz_id = quiz_submission.quiz_id WHERE pid = " + pid, function (err, result, fields) {
            cb(result);
        })
    },

    getOpenQuizes: function (user, cb) {
        con.query("SELECT DISTINCT * FROM quiz INNER JOIN open_quiz ON quiz.quiz_id = open_quiz.quiz_id WHERE user_id = " + user, function (err, result) {
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

    getQuizAnswers: function (quizid, cb) {
        con.query("SELECT * FROM questions INNER JOIN answers ON questions.question_id = answers.question_id WHERE answers.correct_answer = 1 AND questions.quiz_id = " + quizid, function (err, result, fields) {
            if (err) throw err;
            console.log("QUIZ ANSWERS");
            console.log(result);
            cb(result);
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
                result.quiz_name = questions[0].quiz_name;
                result.quiz_id = questions[0].quiz_id;
                answers.quiz_name = questions[0].quiz_name;
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

    saveQuiz: function (id, name, questions, deleted, cb) {
        con.query('UPDATE quiz SET quiz_name = "' + name + '", creation_date=NOW() WHERE quiz_id = ' + id, function (err, result) {
            if (err) throw err;
            let del = [];
            for (let i = 0; i < deleted.length; i++) {
                del.push([deleted[i]]);
            }
            console.log("questions", del);
            con.query('DELETE FROM questions WHERE question_id = ?', [del], function (err, result) {
                if(del.length != 0) {
                    if (err) throw err;
                }
                console.log("Deleted questions.");
                let updateq = [];
                let updatea = [];
                let newq = [];
                let newa = [];
                /*for (let i = 0; i < questions.length; i++) {
                    if (questions[i].id) {
                        updateq.push(questions[i]);
                    } else {
                        newq.push(questions[i]);
                    }
                }*/
                console.log(updateq);
                console.log(updatea);
                console.log(newq);
                console.log(newa);
                let updateqstr = '';
                let updateastr = '';
                let newqstr = '';
                let newastr = '';
                for (let i = 0; i < questions.length; i++) {
                    if(questions[i].id) {
                        (function() {
                            con.query('UPDATE questions SET question = "' + questions[i].question_html + '",quiz_id = ' + id + ' WHERE question_id = ' + questions[i].id, function(err, result) {
                                if(err) throw err;
                                console.log("RESULT", i, result);
                                for(let j=0; j<questions[i].answers.length; j++) {
                                    if(questions[i].answers[j].id) {
                                        (function() {
                                            let cor = 0;
                                            if(questions[i].answers[j].correct) {
                                                cor = 1;
                                            } else {
                                                cor = 0;
                                            }
                                            con.query('UPDATE answers SET answer = "' + questions[i].answers[j].text + '", correct_answer = '+ cor + ' WHERE answer_id = ' + questions[i].answers[j].id, function(err, result) {
                                                if(err) throw err;
                                                //WIP
                                            })
                                        })();
                                    }
                                }
                            })
                        })();
                    } else {
                        (function() {
                            con.query('INSERT INTO questions (question,quiz_id) VALUES ("' + questions[i].question_html + '",' + id + ')', function(err, result) {
                                if(err) throw err;
                                console.log("RESULT2", i, result);
                                for(let j=0; j<questions[i].answers.length; j++) {

                                }
                            })
                        })();
                    }
                }
                con.query(updateqstr, function (err, result) {
                    if (err) throw err;
                    console.log("Updated questions.");
                    let correct = 0;
                    for (let i = 0; i < updatea.length; i++) {
                        if (updatea[i].correct) {
                            correct = 1;
                        } else {
                            correct = 0;
                        }
                        updateastr += 'UPDATE answers SET text = "' + updatea[i].text + '", correct_answer = ' + correct + ' WHERE question_id = ' + updatea[i].id + ';';
                    }
                    con.query(updateastr, function (err, result) {
                        if (err) throw err;
                        console.log("Updated answers.");
                        for (let i = 0; i < newq.length; i++) {
                            (function () {
                                con.query('INSERT INTO questions (question, quiz_id) VALUES ("' + newq[i].question_html + '", ' + id + ');', function (err, result) {
                                    if (err) throw err;
                                    let correctans = 0;
                                    for (let j = 0; j < newq[i].answers.length; j++) {
                                        if (newq[i].answers[j].correct) {
                                            correctans = 1;
                                        } else {
                                            correctans = 0;
                                        }
                                        con.query('INSERT INTO answers (answer, correct_answer, question_id) VALUES (?)', [newq[i].answers[j].text, correctans, result.insertId], function (err, result) {
                                            if (err) throw err;

                                        })
                                    }
                                });
                            })();
                        }

                    });
                })
            })

            let quest = [];
            for (let i = 0; i < questions.length; i++) {
                quest.push()
            }
            cb(result.insertId);
        })
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

        con.query("INSERT IGNORE INTO open_quiz (user_id, quiz_id) VALUES ?", [vals], function (err, result, fields) {
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

    deleteQuizes: function (quizes, cb) {
        console.log("QUIZES", quizes);
        con.query("DELETE FROM quiz WHERE (quiz_id) IN (?)", [quizes], function (err, result) {
            if (err) throw err;
            cb();
        })
    },

    exportQuizes: function (quizes, cb) {
        console.log("QUIZES", quizes);
        con.query("SELECT * FROM users INNER JOIN quiz_submission ON users.pid = quiz_submission.pid INNER JOIN quiz ON quiz_submission.quiz_id = quiz.quiz_id WHERE quiz.quiz_id IN (?)", [quizes], function (err, result) {
            if (err) throw err;
            console.log(result);
            let grades = [];
            let students = [];
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < grades.length; j++) {
                    //console.log("i:",i,"j",j,"pid",result[i].pid);
                    if (grades[j].quiz_id == result[i].quiz_id) {
                        //console.log("PUSH1", result[i].quiz_id);
                        grades[j].grades.push({
                            score: result[i].score,
                            pid: result[i].pid
                        });
                        if (grades[j].total < result[i].total) {
                            grades[j].total = result[i].total;
                        }
                        break;
                    }
                    if (j == grades.length - 1) {
                        grades.push({
                            quiz_id: result[i].quiz_id,
                            name: result[i].quiz_name,
                            total: result[i].total,
                            grades: []
                        });
                        //console.log("PUSH2", result[i].quiz_id);
                        grades[grades.length - 1].grades.push({
                            score: result[i].score,
                            pid: result[i].pid
                        })
                        break;
                    }
                }
                if (grades.length == 0) {
                    grades.push({
                        quiz_id: result[i].quiz_id,
                        name: result[i].quiz_name,
                        total: result[i].total,
                        grades: []
                    });
                    //console.log("PUSH3", result[i].quiz_id);
                    grades[grades.length - 1].grades.push({
                        score: result[i].score,
                        pid: result[i].pid
                    });
                }
                for (let j = 0; j < students.length; j++) {
                    if (students[j].pid == result[i].pid) {
                        break;
                    }
                    if (j == students.length - 1) {
                        students.push({
                            pid: result[i].pid,
                            onyen: result[i].onyen,
                            name: result[i].last_name + ", " + result[i].first_name
                        });
                    }
                }

                if (students.length == 0) {
                    students.push({
                        pid: result[i].pid,
                        onyen: result[i].onyen,
                        name: result[i].last_name + ", " + result[i].first_name
                    });

                }
            }
            console.log("GRADES");
            console.log(grades);
            console.log("STUDENTS");
            console.log(students);
            /*
            {
              onyen: "",
              name: "",
              pid: xx
            }
            {
              quiz_id: xx,
              name: "",
              total: xx,
              grades, [xx, xx, xx, ..]
            }
            */
            cb(grades, students);
        })
    },

    quizSubmission: function (pid, quizid, questions, cb) {
        console.log("QUESTION FOMRAT", questions);
        con.query("INSERT INTO quiz_submission (pid, quiz_id, timestamp, total) VALUES (" + pid + "," + quizid + ",NOW(), (SELECT SUM(tot) - COUNT(*) FROM (SELECT COUNT(*) AS tot FROM questions INNER JOIN answers ON questions.question_id = answers.question_id WHERE questions.quiz_id = " + quizid + " GROUP BY questions.question_id) AS t1)) ON DUPLICATE KEY UPDATE timestamp=NOW()", function (err, result, fields) {
            if (err) throw err;
            let subId = result.insertId;
            let correctInp = questions.correct ? 1 : 0;
            con.query("INSERT IGNORE INTO quiz_submission_answers (submission_id, question_id, answer_id, correct) VALUES (?)", [[parseInt(result.insertId), parseInt(questions.quest_id), parseInt(questions.answer_id), parseInt(correctInp)]],
                function (err, result, fields) {
                    if (err) throw err;
                    con.query("UPDATE quiz_submission SET score = (SELECT SUM(val1-val2) AS score FROM (SELECT questions.question_id AS question_id,COUNT(*) AS val1 FROM questions INNER JOIN answers ON questions.question_id = answers.question_id WHERE quiz_id = " + quizid + " GROUP BY questions.question_id) AS t1 INNER JOIN (SELECT quiz_submission_answers.question_id AS question_id,COUNT(*) AS val2 FROM quiz_submission_answers WHERE submission_id = " + subId + " GROUP BY quiz_submission_answers.question_id) AS t2 ON t1.question_id = t2.question_id) WHERE pid = " + pid + " AND quiz_id = " + quizid, function (err, result, fields) {
                        if (err) throw err;
                        console.log("SCORE", result);
                        console.log("Submission of question success.");
                        cb(result.insertId);
                    })
                });
        })
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
