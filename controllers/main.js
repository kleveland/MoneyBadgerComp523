module.exports = function (app, dbquiz, dbuser) {

    app.get('/', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.getQuizes((quizes) => {
              req.session.dat.quizes = quizes;
              var availableQuizzes = [];
                res.render('quizHome', req.session.dat);
            })
            /*dbquiz.getQuestions((result, answers) => {
                req.session.dat.questions = result;
                req.session.answers = answers;
                res.render('index', req.session.dat);
            })*/
        });
    })
    app.get('/grades', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.getQuizes((quizes) => {
                req.session.dat.quizes = quizes;
                res.render('quizlist', req.session.dat);
            })
            /*dbquiz.getQuestions((result, answers) => {
                req.session.dat.questions = result;
                req.session.answers = answers;
                res.render('index', req.session.dat);
            })*/
        });
    })

    app.get('/404', (req, res) => {
        res.send("404");
    })

    app.get('/quiz/:id', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.getQuiz(req.params.id, (result, answers) => {
                req.session.dat.questions = result;
                req.session.answers = answers;
                console.log(req.session.dat.questions);
                console.log(req.session.answers);
                res.render('quizview', req.session.dat);
            })
        })
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/Shibboleth.sso/Logout?return=https://sso.unc.edu/idp/logout.jsp')
    })

    app.post('/submit/quiz', (req, res) => {
        console.log("RECIEVED ANSWER", req.body);

        for (let i = 0; i < req.session.dat.questions.questlist.length; i++) {
            if (req.session.dat.questions.questlist[i].id == req.body.question) {
                if (!req.session.answers.questlist[i].ansresponse) {
                    req.session.answers.questlist[i].ansresponse = {
                        attempts: 0,
                        correct: true,
                        answer_id: req.body.answer_choice
                    }
                }
                req.session.answers.questlist[i].ansresponse.answer_id = req.body.answer_choice;
                if (req.session.answers.questlist[i].answer_id == req.body.answer_choice) {
                    req.session.answers.questlist[i].ansresponse.correct = true;
                    res.send(req.session.answers.questlist[i].ansresponse)
                } else {
                    console.log("THIS", req.body.answer_choice);
                    if(typeof req.body.answer_choice != "undefined"){
                       req.session.answers.questlist[i].ansresponse.attempts++;
                    }
                    req.session.answers.questlist[i].ansresponse.correct = false;
                    res.send(req.session.answers.questlist[i].ansresponse);
                }
            }
        }

    })

    //other routes..
}
