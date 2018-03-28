module.exports = function (app, dbquiz) {

    app.get('/', (req, res) => {
        dbquiz.getQuestions((result, answers) => {
            req.session.questions = result;
            req.session.answers = answers;
            console.log(req.session.questions);
            req.session.questions.onyen = req.headers.uid;
            req.session.questions.pid = req.headers.pid;
            console.log(req.headers);
            if (!req.session.questions.onyen) {
                req.session.questions.onyen = "default";
                req.session.questions.pid = "default pid";
            }
            console.log(req.session.questions.onyen);
            res.render('index', req.session.questions);
        })
    })

    app.post('/submit/quiz', (req, res) => {
        console.log("RECIEVED ANSWER", req.body);

        for (let i = 0; i < req.session.questions.questlist.length; i++) {
            if (req.session.questions.questlist[i].id == req.body.question) {
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
                    req.session.answers.questlist[i].ansresponse.attempts++;
                    req.session.answers.questlist[i].ansresponse.correct = false;
                    res.send(req.session.answers.questlist[i].ansresponse);
                }
            }
        }

    })

    //other routes..
}
