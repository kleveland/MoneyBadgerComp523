module.exports = function (app, dbquiz, dbuser) {

    app.get('/admin', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                res.render('indexAdmin', req.session.dat);
            });
        })
    });

    app.get('/admin/createQuiz', (req, res) => {
        dbuser.login(req, (user) => {
            res.render('quizCreate', req.session.dat);
        });
    });

    app.post('/admin/addQuiz', (req, res) => {
        dbquiz.postQuiz(req.body.name, req.body.releaseDate, req.body.dueDate, req.body.questions, (quizid) => {
            console.log("Quiz ID", quizid);
            res.sendStatus(200);
        })
    });
}
