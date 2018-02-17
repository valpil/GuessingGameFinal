function generateWinningNumber(){
    return Math.floor(Math.random()*100)+1;
}

function shuffle(arr){
    var m = arr.length, t, i;
    //While there remain elements to shuffle...
    while (m) {
        //Pick a remaining element
        i = Math.floor(Math.random() * m--);
        //And swap it with the current element
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess < this.winningNumber) {
        return true;
    }
    return false;

}

Game.prototype.playersGuessSubmission = function(num){
    if (num < 1 || num > 100 || isNaN(num)) {
        $("#subtitle").text("Please enter a number to proceed.")
        throw "That is an invalid guess."
    }
    else {
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!"
    }
    if (this.pastGuesses.indexOf(this.playersGuess) !== -1){
        return "You have already guessed that number."
    }
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    if (this.pastGuesses.length === 5){
            return "You Lose."
    }
    if (this.difference() < 10) {
            return "You're burning up!"
    }
    if (this.difference() < 25) {
            return "You're lukewarm."
    }
    if (this.difference() < 50) {
            return "You're a bit chilly."
    }
    if (this.difference() < 100) {
            return "You're ice cold!"
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hintArray = shuffle([this.winningNumber, generateWinningNumber(),generateWinningNumber()]);
    return "The winning number is " + hintArray[0] + ", " + hintArray[1] + ", or " + hintArray[2];
}

function makeAGuess(game){
    var guess = +$('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(guess);
    $('#title').text(output);
    if(output === 'You Win!' || output === 'You Lose.'){
        $('#submit', '#hint').prop("disabled", true);
        $('#subtitle').text("Please hit 'Reset' to try again!")
    }
    else if(game.isLower()){
        $('#subtitle').text("Guess higher!")
    }
    else (
        $('#subtitle').text("Guess lower!")
    );
}

$(document).ready(function(){
    var game = new Game();
    $('#submit').click(function(){
        makeAGuess(game);
    });
    $("#player-input").keypress(function(e){
        if(e.keyCode === 13){
            makeAGuess(game);
        }
    })
    $('#reset').click(function(){
        game = new Game();
        $("#title").text("The Guessing Game");
        $("#subtitle").text("Guess a number between 1-100 below!");
        $(".guess").text("-");
        $('#submit', '#hint').prop("disabled", false);
    });
    $('#hint').click(function(){
        $('#title').text(game.provideHint());
        $('#subtitle').text("Choose wisely!");
        $(this).prop("disabled", true);
    });
});