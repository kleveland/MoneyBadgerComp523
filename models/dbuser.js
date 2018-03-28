let con = null;
module.exports = {
    setCon: function (conn) {
        con = conn;
    },

    findUser: function (pid, cb) {
        con.query('SELECT * FROM Users WHERE pid = ' + pid, function (err, result) {
            if (err) throw err;
            if(result[0]) {
                console.log(result[0]);
                cb(result[0]);
            } else {
                console.log("No user found.");
                cb(-1);
            }
        });
    },

    enterUser: function(pid, uid, cb) {
        con.query('INSERT INTO Users (pid, onyen, first_name, last_name, group_id) ?', [[pid, uid, "defaultfirst", "defaultlast", 0]], function(err, result) {
            if(err) throw err;

        })
    }
}
