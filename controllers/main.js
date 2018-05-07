module.exports = function (app, dbquiz, dbuser) {

    app.get('/', (req, res) => {
        dbuser.login(req, (user) => {
            console.log("USER", user);
            dbquiz.getOpenQuizes(req.session.dat.user.pid, req.session.dat.user.is_admin, (quizes) => {
                req.session.dat.quizes = quizes;
                var availableQuizzes = [];
                res.render('quizHome', req.session.dat);
            })
        });
    })
    app.get('/grades', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.getUserQuizes(req.session.dat.user.pid, (quizes) => {
                req.session.dat.quizes = quizes;
                console.log(quizes);
                res.render('quizlist', req.session.dat);
                req.session.dat.quizes = null;
            })
        });
    })

    app.get('/404', (req, res) => {
        res.send("404");
    })

    app.get('/notopen', (req,res) => {
        res.render("notopen", req.session.dat);
    })

    app.get('/quiz/:id', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.verifyQuizAccess(req.params.id, user.pid, req.session.dat.user.is_admin, (access) => {
                if (access) {
                    dbquiz.getQuiz(req.params.id, (result, answers) => {
                        req.session.dat.questions = result;
                        req.session.answers = answers;
                        dbquiz.quizGetSubmission(req.session.dat.user.pid, req.params.id, (submission) => {
                            console.log("SUBMISSION", submission);
                            for (let i = 0; i < req.session.dat.questions.questlist.length; i++) {
                                req.session.dat.questions.questlist[i].attempts = 0;
                                for (let j = 0; j < submission.length; j++) {
                                    if (submission[j].question_id == req.session.dat.questions.questlist[i].id) {
                                        for (let k = 0; k < req.session.dat.questions.questlist[i].answers.length; k++) {
                                            if (req.session.dat.questions.questlist[i].answers[k].ans_id == submission[j].answer_id) {
                                                req.session.dat.questions.questlist[i].attempts++;
                                                req.session.dat.questions.questlist[i].answers[k].submission = submission[j];
                                                req.session.dat.questions.questlist[i].answers[k].submission.new_attempts = req.session.dat.questions.questlist[i].attempts;
                                                req.session.dat.questions.questlist[i].answers[k].submission.ans_num = req.session.dat.questions.questlist[i].answers.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            console.log("DAT", req.session.dat);
                            console.log("QUESTIONS", req.session.dat.questions);
                            console.log(req.session.answers);
                            res.render('quizview', req.session.dat);
                        })
                    })
                } else {
                    res.redirect("/notopen");
                }
            })
        })
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/Shibboleth.sso/Logout?return=https://sso.unc.edu/idp/logout.jsp')
    })

    app.post('/submit/quiz', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.verifyQuizAccess(req.session.dat.questions.quiz_id, user.pid, req.session.dat.user.is_admin, (access) => {
                if (access) {
                    console.log("RECIEVED ANSWER", req.body);
                    console.log('Finished recording submission.');
                    console.log(req.session.dat.questions);
                    for (let i = 0; i < req.session.dat.questions.questlist.length; i++) {
                        if (req.session.dat.questions.questlist[i].id == req.body.question) {
                            /*if (!req.session.answers.questlist[i].ansresponse) {
                                req.session.answers.questlist[i].ansresponse = {
                                    attempts: 0,
                                    correct: false,
                                    answer_id: req.body.answer_choice,
                                    number_of_answers: req.session.dat.questions.questlist[i].answers.length
                                }
                            }
                            req.session.answers.questlist[i].ansresponse.answer_id = req.body.answer_choice;

                            if (req.session.answers.questlist[i].answer_id == req.body.answer_choice) {
                                req.session.answers.questlist[i].ansresponse.attempts++;
                                req.session.answers.questlist[i].ansresponse.correct = true;
                            } else {
                                console.log("THIS", req.body.answer_choice);
                                if (typeof req.body.answer_choice != "undefined") {
                                    req.session.answers.questlist[i].ansresponse.attempts++;
                                }
                                req.session.answers.questlist[i].ansresponse.correct = false;
                            }
                            dbquiz.quizSubmission(req.session.dat.user.pid, req.body.quiz, {
                                quest_id: req.body.question,
                                answer_id: req.body.answer_choice,
                                correct: req.session.answers.questlist[i].ansresponse.correct
                            }, () => {
                                res.send(req.session.answers.questlist[i].ansresponse);
                            });*/
                            let correct = false;
                            if (req.session.answers.questlist[i].answer_id == req.body.answer_choice) {
                                correct = true;
                            }
                            for (let j = 0; j < req.session.dat.questions.questlist[i].answers.length; j++) {
                                if (req.session.dat.questions.questlist[i].answers[j].ans_id == req.body.answer_choice) {
                                    let dat = {
                                        quest_id: req.body.question,
                                        answer_id: req.body.answer_choice,
                                        correct: correct
                                    };
                                    dbquiz.quizSubmission(req.session.dat.user.pid, req.body.quiz, dat, (id) => {
                                        dat.id = id;
                                        req.session.dat.questions.questlist[i].attempts++;
                                        req.session.dat.questions.questlist[i].answers[j].submission = dat;
                                        req.session.dat.questions.questlist[i].answers[j].submission.new_attempts = req.session.dat.questions.questlist[i].attempts;
                                        req.session.dat.questions.questlist[i].answers[j].submission.ans_num = req.session.dat.questions.questlist[i].answers.length;
                                        console.log("NEW SUBMISSION");
                                        console.log(req.session.dat.questions.questlist[i].answers[j].submission);
                                        res.send(req.session.dat.questions.questlist[i].answers[j].submission);
                                    });
                                }
                            }
                        }
                    }
                } else {
                    console.log("Temp. fail to post");
                    res.redirect('/notopen');
                }
            });

        })

    })

    //other routes..
}
