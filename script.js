//Things I can add, adjust, can do better
//1. Add a timer to the pc decision to give the impression the PC is thinking
//2. make the computer more intelligent by teaching it the rules and strategies of the game
//3. add difficulties
//4. Optimize code
//    a. optimize the methodes
//    b. optimize the objects
//    c. use jquery
//5. make a version with canvas instead of html table
//6. add sound

//View object is responsible for displaying the status of the game on the page
var view = {
    //display function will display X or O on the right location
    display : function(symbol, coordinates){
        var location = document.getElementById(coordinates);
        location.innerHTML = symbol;
        if(symbol == "O"){
            location.style.color = "white";
        }
    },
    //show message under the title the info about the player and the computer and
    //whether the player has won or lost.
    playInfo: function(playerSymbol, pcSymbol, gameStatus){
        var message = document.getElementById("playInfo");
        if(gameStatus === "WON"){
            message.innerHTML = "<u>You WON!</u> <br>Press restart to play again.";
        }
        else if(gameStatus === "LOST"){
            message.innerHTML = "<u>You LOST!</u> <br>Press restart to play again.";
        }
        else{
          message.innerHTML = "Player: " + playerSymbol + " Computer: " + pcSymbol;
        }
    }
};

//controller object is responsible for the controls (start button, mouseclicks)
//controller will communicate with the view and model object
var controller = {
    //startGame function will:
    //1. ask model to decide randomly which symbol the player and the pc has
    //2. send the playerSymbol, pcSymbol and status to the view object
    startGame: function(){
        var cellStatus = document.getElementsByTagName("td");
        for(var i = 0; i < cellStatus.length ; i++){
            cellStatus[i].onclick = test;
            cellStatus[i].style.color = "black";
        }

        function test(eventObj){
            var cell = eventObj.target;
            controller.readStatus(cell.id);
        }
        var buttonStatus = document.getElementById("startGame");
        buttonStatus.innerHTML = "Restart";
        model.clearBoard();
        model.pickRandom();
        view.playInfo(model.playerSymbol, model.pcSymbol, "BUSY");
    },

    //this is the handler that is invoked when the player clicks on a cell
    //the controller send an update to the view and the model
    readStatus: function(cellId){
        view.display(model.playerSymbol, cellId);
        var status = model.playerWon();
        if(status == 1){
           view.playInfo(model.playerSymbol, model.pcSymbol, "WON");
        }
        else if (status == 0){
           view.playInfo(model.playerSymbol, model.pcSymbol, "LOST");
        }
        else{
           view.playInfo(model.playerSymbol, model.pcSymbol, "BUSY");
        }
    }
};

//the model object is responsible for the algoritm of the game
//it will receive the location of the mousclick from the controller
//it will also return the status to the controller
var model = {
    playerSymbol: " ",
    pcSymbol: " ",
    symbols: ["X", "O"],
    moves: [" "," "," "," "," "," "," "," "," "],
    tdId: ["00","01","02","10","11","12","20","21","22"],

    //randomly choose the symbol for the player and computer
    pickRandom: function(){
        var randomIndex = Math.floor(Math.random()*2);
        this.playerSymbol = this.symbols[randomIndex];
        if(randomIndex == 1){
            this.pcSymbol = this.symbols[0];
        }
        else{
            this.pcSymbol = this.symbols[1];
        }
    },

    //reads the board and puts all the moves in the moves array for easier analyses
    readBoard: function(){
       var index = 0;
       for(var i = 0; i < 3 ; i++){
            for(var j = 0; j < 3 ; j++){
                var row = document.getElementById(i.toString() + j.toString());
                if(row.innerHTML === null){
                    this.moves[index] = " ";
                }
                else{
                    this.moves[index] = row.innerHTML;
                }
                index++;
            }
        }
    },

    //clear board function clears the moves array and gives message to the view
    //this is used to clear the board everytime you start a new game
    clearBoard: function(){
       var index = 0;
       for(var i = 0; i < 3 ; i++){
            for(var j = 0; j < 3 ; j++){
                var row = document.getElementById(i.toString() + j.toString());
                row.innerHTML = " ";
                this.moves[index] = row.innerHTML;
                index++;
            }
        }
    },

    //this function is responsible for the algorithm that the PC uses to make a move
    //based on what the player has chosen
    pcDecide: function(){
        var makeDecision = true;
        while(makeDecision){
            if(this.moves.indexOf(" ") != -1){
                var random = Math.floor(Math.random() * 9);
                if(this.moves[random] != "X" && this.moves[random] != "O"){
                    this.moves[random] = this.pcSymbol;
                    view.display(this.pcSymbol, this.tdId[random]);
                    makeDecision = false;
                }
            }
            else{
               makeDecision = false;

            }
        }
    },

    //function for checking if there are 3 X's or 3 O's in a row
    //this function should check for horizontal, vertical and diagonal rows
    checkRows: function(symbols){
        if(this.horizontalRows(symbols) || this.verticalRows(symbols) || this.diagonalRows(symbols)){
            return true;
        }
        else{
            return false;
        }
    },

    horizontalRows: function(symbols){

        var threeInRow = 0;
        var incr = 0;
        for(var j = 0; j < 3; j++){
          for(var i = incr; i < 3 + incr; i++){
                if(this.moves[i] === symbols){
                    threeInRow++;
                }
                if(threeInRow == 3){
                    return true;
                }
            }
            threeInRow = 0;
            incr = incr + 3;
        }
        return false;
    },

    verticalRows: function(symbols){
        if(this.moves[0] === symbols && this.moves[3] === symbols && this.moves[6] === symbols ||
          this.moves[1] === symbols && this.moves[4] === symbols && this.moves[7] === symbols ||
          this.moves[2] === symbols && this.moves[5] === symbols && this.moves[8] === symbols){
            return true;
        }
        else{
            return false;
        }
    },

    diagonalRows: function(symbols){
        if(this.moves[0] === symbols && this.moves[4] === symbols && this.moves[8] === symbols ||
          this.moves[2] === symbols && this.moves[4] === symbols && this.moves[6] === symbols){
            return true;
        }
        else{
            return false;
        }
    },

    //function that checks whether the player won or the computer
    //send message back to the controller
    playerWon: function(){
        this.readBoard();
        this.pcDecide();
        this.readBoard();
        if(this.checkRows(this.playerSymbol)){
            return 1;
        }
        else if(this.checkRows(this.pcSymbol)){
            return 0;
        }
        else{
            return -1;
        }
    }
}

function init(){
    var buttonStatus = document.getElementById("startGame");
    buttonStatus.onclick = controller.startGame;
}

window.onload = init;
