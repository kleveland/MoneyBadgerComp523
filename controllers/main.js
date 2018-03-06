module.exports = function (app, questions) {

    app.get('/', (req, res) => {
        console.log(questions);
        res.render('index', questions);
    })

    app.post('/submit/quiz', (req, res) => {
        console.log("RECIEVED ANSWER", req.body);
        for (let i = 0; i < questions.questlist.length; i++) {
            if (questions.questlist[i].id == req.body.question) {
                if (questions.questlist[i].answer_id == req.body.answer_choice) {
                    res.send({
                        correct: true,
                        answer_id: req.body.answer_choice
                    })
                } else {
                    res.send({
                        correct: false,
                        answer_id: req.body.answer_choice
                    })
                }
            }
        }

    })

    //other routes..
}
