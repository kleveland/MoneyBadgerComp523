module.exports = function (app, dbquiz, dbuser, upload, csv) {

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
    });

    app.post("/admin/addUser", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                //code for getting data from front end and putting it into correct type list

                dbuser.insertUsers(()=>{
                  res.sendStatus(200);

                });
            });
        });
    })

    app.post("/admin/deleteUser", (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                //code for getting data from front end and putting it into correct type list
                //then send to deleteUser function on dbuser

                dbuser.deleteUser(()=>{
                  res.sendStatus(200);
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


    app.post('/admin/csvImport', (req, res) => {
        dbuser.login(req, (user) => {
            dbuser.verifyAdmin(req, res, (adm) => {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    }
                    var taPID = req.session.dat.user["pid"];
                    var fileName = req.files[0]["originalname"].slice(0, -4);
                    var csvString = req.files[0]["buffer"].toString()
                    console.log("File is uploaded");
                    res.end("File is uploaded");
                    var newUsers = [];
                    csv
                     .fromString(csvString, {headers: true})
                     .on("data", function(data){
                         newUsers.push(data);
                     })
                     .on("end", function(){
                        //the new user objects are in this array.
                        console.log(taPID);

                        //send to DB here
                        dbuser.createSection(taPID,fileName,(sectionID) => {
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


                            dbuser.insertUsers(studentEntryArray,()=>{
                              console.log("Students added to DB");
                            dbuser.addStudentsToSection(sectionEntryArray,()=> {
                              console.log("Students added to section in DB");
                              res.redirect('back');
                            })

                          });
                        })

                        });

                     });
                     //console.log(newUsers);

                });
            });
    })
  }
