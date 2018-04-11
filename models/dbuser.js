let con = null;
module.exports = {
    setCon: function (conn) {
        con = conn;
    },

    getUsers: function (cb) {
        con.query('SELECT * FROM users INNER JOIN groups ON users.group_id = groups.group_id INNER JOIN user_section ON users.pid = user_section.pid INNER JOIN section ON user_section.section_id = section.id', function (err, result) {
            if (err) throw err;

            console.log("Get Users:")
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                result[i].open_quiz = [];
            }
            con.query('SELECT * FROM open_quiz INNER JOIN quiz ON open_quiz.quiz_id = quiz.quiz_id', function (err, result2) {
                if (err) throw err;

                console.log("Get Open Quiz:")
                console.log(result2);
                for (let i = 0; i < result2.length; i++) {
                    for (let j = 0; j < result.length; j++) {
                        if (result2[i].user_id == result[j].pid) {
                            result[j].open_quiz.push(result2[i]);
                            break;
                        }
                    }
                }
                console.log("Final:")
                console.log(result);
                cb(result);
            })
        })
    },

    getOnlySections: function (cb) {
        con.query('SELECT * FROM section', function (err, result) {
            if (err) throw err;
            cb(result);
        })
    },
    getSections: function (cb) {
        con.query('SELECT t1.first_name, t1.last_name, t1.onyen, t1.pid, t1.name, t2.first_name AS ta_first, t2.last_name AS ta_last, t2.pid AS ta_pid  FROM (SELECT first_name, last_name, onyen, users.pid, name, ta_id FROM section INNER JOIN user_section ON section.id = user_section.section_id INNER JOIN ta_section ON section.id = ta_section.section_id INNER JOIN users ON users.pid = user_section.pid) AS t1 INNER JOIN users t2 ON t1.ta_id = t2.pid', function (err, result) {
            if (err) throw err;
            console.log("test3-----------------");
            let secorg = [];
            let appendnew = false;
            let idx = 0;

            for (let i = 0; i < result.length; i++) {
                if (i == 0) {
                    secorg.push({
                        id: i,
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
                        id: i,
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
            console.log(secorg);
            cb(secorg);
        })
    },

    findUser: function (pid, cb) {
        con.query('SELECT * FROM users WHERE pid = ' + pid, function (err, result) {
            if (err) throw err;
            if (result[0]) {
                console.log(result[0]);
                con.query('SELECT is_admin FROM groups WHERE group_id = "' + result[0].group_id + '"', function (err, result2) {
                    if (result2[0].is_admin == 1) {
                        result[0].is_admin = true;
                    } else {
                        result[0].is_admin = false;
                    }
                    cb(result[0]);
                })
            } else {
                console.log("No user found.");
                cb(-1);
            }
        });
    },

    enterUser: function (pid, uid, cb) {
        con.query('INSERT INTO users (pid, onyen, first_name, last_name, group_id) ?', [[pid, uid, "defaultfirst", "defaultlast", 0]], function (err, result) {
            if (err) throw err;

        })
    },

    verifyAdmin: function (req, res, cb) {
        if (req.session.dat.user.is_admin) {
            cb(true);
        } else {
            res.redirect("/404");
        }
    },

    login: function (req, cb) {
        if (!req.session.dat) {
            req.session.dat = {};
            req.headers.pid = "720466550";
            this.findUser(req.headers.pid, (user) => {
                req.session.dat.user = user;
                cb(user);
            })
        } else {
            cb(req.session.dat.user);
        }
    }
}
