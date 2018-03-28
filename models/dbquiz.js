let con = null;
module.exports = {

    setCon(conn) {
        con = conn;
    },

    getQuestions: function (cb) {
        con.query("SELECT * FROM Questions INNER JOIN Answers ON Questions.question_id = Answers.question_id", function (err, result, fields) {
            if (err) throw err;
            let questions = result;
            //console.log(questions)
            result = {
                questlist: []
            }
            let answers = {
                questlist: []
            }

            i = 0;
            while (i < questions.length) {
                id = questions[i].question_id;
                idx = result.questlist.push({
                    id: id,
                    question: questions[i].question,
                    answers: []
                }) - 1;
                answers.questlist.push({
                    id: id,
                    answer_id: null
                });
                result.questlist[idx].answers.push({
                    text: questions[i].answer,
                    ans_id: questions[i].answer_id
                });
                i++;
                while (questions[i] != undefined && questions[i].question_id == id) {
                    if (questions[i].correct_answer >= 1) {
                        answers.questlist[idx].answer_id = questions[i].answer_id;
                    }
                    //result.questlist.answer_id = (parseInt(questions[i].correct_answer) >= 1) ? questions[i].answer_id : null;
                    result.questlist[idx].answers.push({
                        text: questions[i].answer,
                        ans_id: questions[i].answer_id
                    });
                    i++;
                }
            }
            cb(result, answers)
        });
    }
}
