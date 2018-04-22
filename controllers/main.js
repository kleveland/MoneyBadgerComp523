module.exports = function (app, dbquiz, dbuser) {

    app.get('/', (req, res) => {
        dbuser.login(req, (user) => {
            console.log("USER", user);
            dbquiz.getOpenQuizes(req.session.dat.user.pid, (quizes) => {
                req.session.dat.quizes = quizes;
                var availableQuizzes = [];
                res.render('quizHome', req.session.dat);
            })
        });
    })
    app.get('/grades', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.getQuizes((quizes) => {
                req.session.dat.quizes = quizes;
                res.render('quizlist', req.session.dat);
            })
        });
    })

    app.get('/404', (req, res) => {
        res.send("404");
    })

    app.get('/quiz/:id', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.verifyQuizAccess(req.params.id, user.pid, (access) => {
                if (access) {
                    dbquiz.getQuiz(req.params.id, (result, answers) => {
                        req.session.dat.questions = result;
                        req.session.answers = answers;
                        dbquiz.quizGetSubmission(req.session.dat.user.pid, req.params.id, (submission) => {
                            console.log("SUBMISSION", submission);
                            for(let i=0; i<req.session.dat.questions.questlist.length; i++) {
                                req.session.dat.questions.questlist[i].attempts = 0;
                                for(let j=0; j<submission.length; j++) {
                                    if(submission[j].question_id == req.session.dat.questions.questlist[i].id) {
                                        for(let k=0; k<req.session.dat.questions.questlist[i].answers.length; k++) {
                                            if(req.session.dat.questions.questlist[i].answers[k].ans_id == submission[j].answer_id) {
                                                req.session.dat.questions.questlist[i].attempts++;
                                                req.session.dat.questions.questlist[i].answers[k].submission = submission[j];
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
                    res.redirect("/404");
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
            dbquiz.verifyQuizAccess(req.session.dat.questions.quiz_id, user.pid, (access) => {
                if (access) {
                    console.log("RECIEVED ANSWER", req.body);
                    console.log('Finished recording submission.');
                    console.log(req.session.dat.questions);
                    for (let i = 0; i < req.session.dat.questions.questlist.length; i++) {
                        if (req.session.dat.questions.questlist[i].id == req.body.question) {
                            if (!req.session.answers.questlist[i].ansresponse) {
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
                            });
                        }
                    }
                } else {
                    console.log("Temp. fail to post");
                }
            });

        })

    })

    //other routes..
}
