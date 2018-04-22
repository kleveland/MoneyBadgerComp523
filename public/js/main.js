console.log("Main test.");
function answerSubmit(correct, quest, ansid, ansnum, attempts) {
    if(correct == 0) {
        correct = false;
    } else if(correct == 1) {
        correct = true;
    }
    if (correct) {
        $("#ans" + ansid + " + .anschoice").css('color', 'green');
        $("#ans" + ansid + " + .anschoice").prepend('  ✔   ');
        $("#quest" + quest + " .attempts span").html(attempts);
        $("#quest" + quest + " .attempts span").removeClass("badge-danger");
        $("#quest" + quest + " .attempts span").addClass("badge-success");
        $("#quest" + quest + " .score").prepend("Score");
        console.log(ansnum - attempts);
        $("#quest" + quest + " .score span").html(ansnum - attempts);
        $('input[type=radio]#ans' + ansid).remove();

        $("#quest" + quest + " :input").prop("disabled", true);
    } else {
        $("#ans" + ansid + " + .anschoice").css('color', 'red');
        $("#ans" + ansid + " + .anschoice").prepend('   X    ');
        $("#quest" + quest + " .attempts span").html(attempts);
        $('input[type=radio]#ans' + ansid).remove();

    }
}
