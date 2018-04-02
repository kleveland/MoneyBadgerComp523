let con = null;
module.exports = {
    setCon: function (conn) {
        con = conn;
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
