let con = null;
let dbquiz = null;

module.exports = {
    setCon: function (conn) {
        con = conn;
    },

    setDbQuiz: function (quiz) {
        dbquiz = quiz;
    },

    // function gets all users
    getUsers: function (cb) {
        con.query('SELECT users.pid AS pid, users.onyen AS onyen, users.first_name AS first_name, users.last_name AS last_name, users.group_id AS group_id, groups.is_admin AS is_admin, user_section.section_id AS section_id, section.name AS name, groups.type AS type FROM users LEFT JOIN groups ON users.group_id = groups.group_id LEFT JOIN user_section ON users.pid = user_section.pid LEFT JOIN section ON user_section.section_id = section.id', function (err, result) {
            if (err) throw err;

            //console.log("Get Users:")
            //console.log(result);
            for (let i = 0; i < result.length; i++) {
                result[i].open_quiz = [];
                result[i].closed_quiz = [];
            }
            con.query('SELECT * FROM open_quiz INNER JOIN quiz ON open_quiz.quiz_id = quiz.quiz_id', function (err, result2) {
                if (err) throw err;
                //console.log("Get Open Quiz:")
                //console.log(result2);
                dbquiz.getQuizes((quizes) => {
                    for (let i = 0; i < result2.length; i++) {
                        for (let j = 0; j < result.length; j++) {
                            if (result2[i].user_id == result[j].pid) {
                                result[j].open_quiz.push(result2[i]);
                                break;
                            }
                        }
                    }
                    let pushQuiz = true;
                    for (let i = 0; i < result.length; i++) {
                        for (let j = 0; j < result[i].open_quiz.length; j++) {
                            for (let k = 0; k < quizes.length; k++) {
                                if (result[i].open_quiz[j].quiz_id != quizes[k].quiz_id) {
                                    for (let t = 0; t < result[i].closed_quiz.length; t++) {
                                        if (result[i].closed_quiz[t].quiz_id == quizes[k].quiz_id) {
                                            pushQuiz = false;
                                            break;
                                        }
                                    }
                                    if (pushQuiz) {
                                        result[i].closed_quiz.push(quizes[k]);
                                        pushQuiz = true;
                                    }
                                }
                            }
                        }
                        if (result[i].open_quiz.length == 0) {
                            result[i].closed_quiz = quizes;
                        }
                    }
                    //console.log("Final:")
                    //console.log(result);
                    cb(result);
                });
            })
        })
    },
    // function gets all sections
    getOnlySections: function (cb) {
        con.query('SELECT * FROM section', function (err, result) {
            if (err) throw err;
            cb(result);
        })
    },

    getSections: function (cb) {
        con.query('SELECT t1.id, t1.first_name, t1.last_name, t1.onyen, t1.pid, t1.name, t2.first_name AS ta_first, t2.last_name AS ta_last, t2.pid AS ta_pid FROM (SELECT id, first_name, last_name, onyen, users.pid, name, ta_id FROM section LEFT JOIN user_section ON section.id = user_section.section_id LEFT JOIN ta_section ON section.id = ta_section.section_id LEFT JOIN users ON users.pid = user_section.pid) AS t1 LEFT JOIN users t2 ON t1.ta_id = t2.pid', function (err, result) {
            if (err) throw err;
            //console.log("test3-----------------");
            //console.log(result[0]);
            let secorg = [];
            let appendnew = false;
            let idx = 0;

            for (let i = 0; i < result.length; i++) {
                if (i == 0) {
                    secorg.push({
                        id: result[i].id,
                        section_name: result[i].name,
                        ta_pid: result[i].ta_pid,
                        ta_name: result[i].ta_first + " " + result[i].ta_last,
                        students: []
                    });
                    continue;
                }
                for (let j = 0; j < secorg.length; j++) {
                    if (result[i].ta_pid == secorg[j].ta_pid) {
                        idx = j;
                        appendnew = false;
                        break;
                    } else if (result[i].ta_pid != secorg[j].ta_pid && j == (secorg.length - 1)) {
                        appendnew = true;
                        break;
                    }
                }
                if (appendnew) {
                    secorg.push({
                        id: result[i].id,
                        section_name: result[i].name,
                        ta_pid: result[i].ta_pid,
                        ta_name: result[i].ta_first + " " + result[i].ta_last,
                        students: []
                    });
                    secorg[secorg.length - 1].students.push({
                        name: result[i].first_name + " " + result[i].last_name,
                        onyen: result[i].onyen,
                        pid: result[i].pid
                    });
                } else {
                    secorg[idx].students.push({
                        name: result[i].first_name + " " + result[i].last_name,
                        onyen: result[i].onyen,
                        pid: result[i].pid
                    });
                }
                appendnew = false;
            }
            //console.log(secorg);
            cb(secorg);
        })
    },
    // function looks for user in DB.
    findUser: function (pid, cb) {
        con.query('SELECT * FROM users WHERE pid = ' + pid, function (err, result) {
            if (err) throw err;
            if (result[0]) {
                //console.log(result[0]);
                con.query('SELECT is_admin FROM groups WHERE group_id = "' + result[0].group_id + '"', function (err, result2) {
                    if (result2[0].is_admin == 1) {
                        result[0].is_admin = true;
                    } else {
                        result[0].is_admin = false;
                    }
                    cb(result[0]);
                })
            } else {
                //console.log("No user found.");
                cb(-1);
            }
        });
    },
    // Function changes a users section in user_section table.
    updateSection: function (pid, section, cb) {
        con.query('UPDATE user_section SET section_id = ' + section + ' WHERE pid = ' + pid, function (err, result) {
            if (err) throw err;
            //console.log(result.affectedRows, "ROWS");
            if (result.affectedRows == 0) {
                con.query('INSERT INTO user_section (pid, section_id) VALUES (' + pid + ',' + section + ')', function (err, result) {
                    if (err) throw err;
                    cb("OK2");
                })
            } else {
                cb("OK");
            }
        })
    },
    // Function inserts multiple new users into the DB.
    insertUsers: function (usersArray, cb) {
        con.query('INSERT IGNORE INTO users (pid, onyen, first_name, last_name, group_id) values ?', [usersArray], function (err, result) {
            if (err) throw err;
            //console.log("INSERT USERS", result);
            cb();
        })
    },
    // Function deletes users from the users table.
    deleteUsers: function (usersArray, cb) {
        //console.log(usersArray);
        let ArrayTA = [];
        let regular = [];
        for (let i = 0; i < usersArray.length; i++) {
            if (usersArray[i].isTA == 'true') {
                ArrayTA.push(usersArray[i].id);
            }
            regular.push(usersArray[i].id);

        }
        //console.log(ArrayTA);
        //console.log(regular);
        if (ArrayTA.length != 0) {
            con.query('SELECT section.id FROM section INNER JOIN ta_section ON section.id = ta_section.section_id INNER JOIN users ON ta_section.ta_id = users.pid WHERE (users.pid) IN (?)', [ArrayTA], function (err, result) {
                if (err) throw err;
                //console.log("RESULT HERE", result);
                let secId = [];
                for (let i = 0; i < result.length; i++) {
                    secId.push(result[i].id);
                }
                //console.log(secId);
                con.query("UPDATE user_section SET section_id = -1 WHERE id = " + id, function (err, result) {
                    if (err) throw err;
                    con.query('DELETE FROM section WHERE (id) IN (?)', [secId], function (err, result) {
                        con.query('DELETE FROM users WHERE (pid) IN (?)', [regular], function (err, result) {
                            if (err) throw err;
                            cb();
                        })

                    })
                });
            })
        } else {
            con.query('DELETE FROM users WHERE (pid) IN (?)', [regular], function (err, result) {
                if (err) throw err;
                cb();
            })
        }
    },
    // Function deletes section and user and TA ties to said section.
    deleteSection: function (id, cb) {
        con.query("UPDATE user_section SET section_id = -1 WHERE section_id = " + id, function (err, result) {
            if (err) throw err;
            con.query("DELETE FROM section WHERE id = " + id, function (err, result) {
                if (err) throw err;
                cb();
            })
        })
    },
    //Resets quiz submissions for specified user.
    quizReset: function (id, usersArray, cb) {
        con.query('DELETE FROM quiz_submission WHERE (pid) IN (?) AND quiz_id = ' + id, [usersArray], function (err, result) {
            if (err) throw err;
            cb();
        });
    },
    // Function takes current Admin's info and creates a section. This function is for CSV upload of a section.
    createSection: function (taPID, sectionName, cb) {
        var sectionID;
        //console.log('INSERT INTO ta_section (ta_id, section_id) values ("' + taPID + '","' + sectionID + '")');
        con.query('INSERT INTO section (name) values ("' + sectionName + '")', function (err, result) {
            if (err) throw err;
        })
        //console.log(sectionName);
        //console.log('Select id from section where name = "' + sectionName + '"');
        con.query('Select id from section where name = "' + sectionName + '"', function (err, result2) {
            if (err) throw err;

            sectionID = result2[result2.length - 1]["id"];
            //console.log("Backend sectionIDDD");
            //console.log(sectionID);

            //inserting into ta_section
            //console.log('INSERT INTO ta_section (ta_id, section_id) values ("' + taPID + '","' + sectionID + '")');
            con.query('INSERT INTO ta_section (ta_id, section_id) values ("' + taPID + '","' + sectionID + '")', function (err, result3) {
                if (err) throw err;
                cb(sectionID);
            })

        })
    },

    // This function takes users and addes them to a section.
    addStudentsToSection: function (sectionEntryArray, cb) {
        //console.log('INSERT INTO user_section (pid, section_id) values ("' +studentPID+ '","' +sectionID+ '")');
        con.query('INSERT INTO user_section (pid, section_id) values ?', [sectionEntryArray], function (err, result3, sectionID) {
            if (err) throw err;
            cb();
        })
    },

    getUnassignedTAs: function (cb) {
        con.query("SELECT * FROM users WHERE group_id = 2 AND users.pid NOT IN (SELECT ta_id FROM ta_section)", function (err, result) {
            if (err) throw err;
            //console.log("Unassigned TAs", result);
            cb(result);
        })
    },

    // This function verifies a user is a type: admin.
    verifyAdmin: function (req, res, cb) {
        if (req.session.dat.user.is_admin) {
            cb(true);
        } else {
            res.redirect("/404");
        }
    },
    // function helps with user logins and creates session
    login: function (req, cb) {
        if (!req.session.dat) {
            req.session.dat = {};
            // current default user, on local.
            //req.headers.pid = "720462663";
            //req.headers.pid = "237";
            this.findUser(req.headers.pid, (user) => {
                req.session.dat.user = user;
                cb(user);
            })
        } else {
            cb(req.session.dat.user);
        }
    }
}
