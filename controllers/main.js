module.exports = function (app, questions, answers) {

    app.get('/', (req, res) => {
        console.log(questions);
        questions.onyen = req.headers.uid;
        questions.pid = req.headers.pid;
        console.log(req.headers);
        if (!questions.onyen) {
            questions.onyen = "default";
            questions.pid = "default pid";
        }
        console.log(questions.onyen);
        res.render('index', questions);
    })

    app.post('/submit/quiz', (req, res) => {
        console.log("RECIEVED ANSWER", req.body);

        for (let i = 0; i < questions.questlist.length; i++) {
            if (questions.questlist[i].id == req.body.question) {
                if (!answers.questlist[i].ansresponse) {
                    answers.questlist[i].ansresponse = {
                        attempts: 0,
                        correct: true,
                        answer_id: req.body.answer_choice
                    }
                }
                answers.questlist[i].ansresponse.answer_id = req.body.answer_choice;
                if (answers.questlist[i].answer_id == req.body.answer_choice) {
                    answers.questlist[i].ansresponse.correct = true;
                    res.send(answers.questlist[i].ansresponse)
                } else {
                    answers.questlist[i].ansresponse.attempts++;
                    answers.questlist[i].ansresponse.correct = false;
                    res.send(answers.questlist[i].ansresponse);
                }
            }
        }

    })

    //other routes..
}
