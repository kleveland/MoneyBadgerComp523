module.exports = function (app, dbuser) {

    app.get('/admin', (req, res) => {
        res.render('indexAdmin');
      });
    app.get('/createQuiz', (req, res) => {
        res.render('quizCreate');
        });

    app.post('/create/quiz', (req, res) => {
        console.log("RECIEVED ANSWER", req.body);
      });
    }
