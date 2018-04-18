module.exports = function (app, dbquiz, dbuser, upload) {

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
                    dbquiz.getQuizes((quizes) => {
                        console.log("Test here2");
                        req.session.dat.sections = sections;
                        req.session.dat.quizes = quizes;
                        console.log('TESTING HERE 2');
                        console.log(req.session.dat.sections[0].students[0]);
                        res.render('manageSection', req.session.dat);
                        req.session.dat.sections = null;
                        req.session.dat.quizes = null;
                    })
                })
            })
        })
    });

    app.post('/admin/updateSec', (req, res) => {

        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbuser.updateSection(req.body.pid, req.body.section, (dat) => {
                    console.log("Quiz ID", dat);
                    res.sendStatus(200);
                })
            });
        });
    });

    app.post("/admin/openquiz", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.openQuiz(req.body.user, req.body.quiz_id, () => {
                    res.sendStatus(200);
                })
            });
        });
    })

    app.post("/admin/closequiz", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.closeQuiz(req.body.user, req.body.quiz_id, () => {
                    res.sendStatus(200);
                })
            });
        });
    })
    app.post('/admin/csv', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    }
                    console.log(req.files[0].originalname, req.files[0]);
                    //actions for file upload go here
                    res.end("File is uploaded");
                });
            });
        });
    })
}
