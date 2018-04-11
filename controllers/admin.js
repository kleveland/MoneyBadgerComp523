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
            dbuser.verifyAdmin(req, res, (adm) => {
                res.render('quizCreate', req.session.dat);
            });
        });
    });

    app.post('/admin/addQuiz', (req, res) => {
        dbuser.login(req, (user) => {
            dbquiz.postQuiz(req.body.name, req.body.questions, (quizid) => {
                dbuser.verifyAdmin(req, res, (adm) => {
                    console.log("Quiz ID", quizid);
                    res.sendStatus(200);
                });
            })
        });
    });

    app.get('/admin/users', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbuser.getUsers((users) => {
                    console.log("Test here");
                    console.log(req.session.dat);
                    req.session.dat.users = users;
                    dbuser.getOnlySections((sections) => {
                        req.session.dat.sections = sections;
                        res.render('manageUser', req.session.dat);
                        req.session.dat.sections = null;
                        req.session.dat.users = null;
                    })
                })
            })
        })
    });

    app.get('/admin/sections', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbuser.getSections((sections) => {
                    console.log("Test here2");
                    console.log(req.session.dat);
                    req.session.dat.sections = sections;
                    res.render('manageSection', req.session.dat);
                    req.session.dat.sections = null;
                })
            })
        })
    })
}
