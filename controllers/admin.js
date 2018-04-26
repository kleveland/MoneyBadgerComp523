module.exports = function (app, dbquiz, dbuser, upload, csv, fs) {

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

            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.postQuiz(req.body.name, req.body.questions, (quizid) => {
                    console.log("Quiz ID", quizid);
                    res.sendStatus(200);
                });
            })
        });
    });

    app.get('/admin/viewQuiz', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {

                dbquiz.getQuizes((quizes) => {
                    req.session.dat.quizes = quizes;
                    res.render("viewQuiz", req.session.dat);
                    req.session.dat.quizes = null;
                    console.log("AFTER view");
                });
            });
        });
    });

    app.get('/admin/manageQuiz/:id', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.getQuiz(req.params.id, (quiz) => {
                    dbquiz.getQuizAnswers(req.params.id, (answers) => {
                        let qlist = quiz.questlist;
                        let correct = false;
                        let questions = [];
                        for (let i = 0; i < qlist.length; i++) {
                            questions.push({
                                question_html: qlist[i].question
                            });
                            for (let j = 0; j < qlist[i].answers.length; j++) {
                                if (!questions[questions.length - 1].answers) {
                                    questions[questions.length - 1].answers = [];
                                }
                                if (answers[i].answer_id == qlist[i].answers[j].ans_id) {
                                    correct = true;
                                } else {
                                    correct = false;
                                }
                                questions[questions.length - 1].answers.push({
                                    text: qlist[i].answers[j].text,
                                    correct: correct
                                });
                            }
                        }
                        console.log(questions);
                        req.session.dat.editquiz = quiz;
                        req.session.dat.editquiz.questions = JSON.stringify(questions);
                        console.log(quiz);
                        res.render("manageQuiz", req.session.dat);
                        req.session.dat.editquiz = null;
                    })
                })
            });
        });
    })

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
    });

    app.post("/admin/addUser", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                //code for getting data from front end and putting it into correct type list
                req.body.newUser[0] = parseInt(req.body.newUser[0]);
                req.body.newUser[4] = parseInt(req.body.newUser[4]);
                console.log(req.body.newUser)

                dbuser.insertUsers([req.body.newUser], () => {
                    console.log("new Manual User: " + req.body.newUser[1] + " Added to Users table")
                    var sectionAddArray = [];

                    sectionAddArray.push([parseInt(req.body.newUser[0]), parseInt(req.body.sectionID)]);
                    console.log(sectionAddArray);
                    if (req.body.newUser[4] != 3) {
                        res.end();
                    } else {
                        dbuser.addStudentsToSection(sectionAddArray, () => {
                            console.log("Students added to section in DB");
                            res.end();
                        });
                    }

                });
            });
        });
    })

    app.post("/admin/deleteUser", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                //code for getting data from front end and putting it into correct type list
                //then send to deleteUser function on dbuser
                console.log(req.body.checkedUsers);
                dbuser.deleteUsers(req.body.checkedUsers, () => {
                    res.end();
                });
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

    app.post('/admin/getUnassignedTAs', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbuser.getUnassignedTAs((tas) => {
                    console.log("Handling TA route");
                    res.send(tas);
                })
            });
        });
    })

    app.post('/admin/deleteQuizes', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.deleteQuizes(req.body.quizes, () => {
                    console.log("Deleted Quizes");
                    res.end();
                })
            });
        });
    })


    app.get('/admin/exportQuizes', (req, res) => {
        res.status(200).download("./uploads/temp/export.csv");
    });


    app.post('/admin/exportQuizes', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                dbquiz.exportQuizes(req.body.quizes, (grades, students) => {
                    let strbody = "";
                    let studententry = [];
                    let header = "";
                    header += "Student ID,Student Name,PID";
                    for (let i = 0; i < students.length; i++) {
                        studententry.push(students[i].onyen + ",\"" + students[i].name + "\"," + students[i].pid);
                    }
                    for (let i = 0; i < grades.length; i++) {
                        header += "," + grades[i].name + " [" + grades[i].total + "]";
                    }
                    for (let i = 0; i < students.length; i++) {
                        console.log("STUDENT", students[i].name);
                        for (let j = 0; j < grades.length; j++) {
                            console.log("GRADES", grades[j].name, grades[j].grades);
                            for (let k = 0; k < grades[j].grades.length; k++) {
                                console.log(k, grades[j].grades[k]);
                                if (grades[j].grades[k].pid == students[i].pid) {
                                    studententry[i] += "," + grades[j].grades[k].score;
                                }
                            }
                        }
                    }
                    strbody += header + '\n';
                    strbody += studententry.join('\n');
                    console.log(strbody);
                    let fileName = "export.csv";
                    var savedFilePath = './uploads/temp/' + fileName; // in some convenient temporary file folder
                    fs.writeFile(savedFilePath, strbody, function () {
                        res.status(200).download(savedFilePath, fileName);
                    });
                })
            });
        });
    })


    app.post('/admin/csvImport', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    }
                    console.log("TA ID", req.body.ta);
                    var taPID = req.body.ta;
                    var fileName = req.files[0]["originalname"].slice(0, -4);
                    var csvString = req.files[0]["buffer"].toString()
                    var csvHead = csvString.split('\r\n');
                    if (csvHead[0] != 'Student ID,Student Name,PID') {
                        console.log("Incorrect CSV header format!\n Must be in format: Student ID,Student Name,PID");
                        console.log(csvHead[0]);
                        res.end();

                    } else {

                        console.log("File is uploaded");
                        res.end("File is uploaded");
                        let newUsers = [];
                        csv.fromString(csvString, {
                                headers: true
                            })
                            .on("data", function (data) {
                                newUsers.push(data);
                            })
                            .on("end", function () {
                                //the new user objects are in this array.
                                console.log(taPID);

                                //send to DB here
                                dbuser.createSection(taPID, fileName, (sectionID) => {
                                    console.log("done with section creation");

                                    //adding users to DB
                                    console.log(newUsers);
                                    var studentEntryArray = [];
                                    var sectionEntryArray = [];
                                    for (i = 0; i < newUsers.length; i++) {
                                        name = newUsers[i]["Student Name"].split(",");
                                        studentEntryArray.push([parseInt(newUsers[i]["PID"]), newUsers[i]["Student ID"], name[1], name[0], 3])
                                        sectionEntryArray.push([parseInt(newUsers[i]["PID"]), sectionID]);
                                    }
                                    console.log(studentEntryArray);
                                    console.log("admin.js Section ID");
                                    console.log(sectionID);


                                    dbuser.insertUsers(studentEntryArray, () => {
                                        console.log("Students added to DB");
                                        dbuser.addStudentsToSection(sectionEntryArray, () => {
                                            console.log("Students added to section in DB");
                                            res.end();
                                        })

                                    });
                                })

                            });
                    }
                });
                //console.log(newUsers);

            });
        });
    })
}
