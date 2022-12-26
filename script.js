var origBoard;  //array that keeps track of the board
const human = 'O';
const AI = 'X';
const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
]


const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
        
    }
}

function turnClick(square){
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, human)
        if(!checkWin(origBoard,human) && !checkTie()){
            turn(bestSpot(), AI);
        }
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player; 
    let gameWon = checkWin(origBoard, player)
    if(gameWon) gameOver(gameWon)
}

//Checks for a win by traversing through the winning combinations and sets gamewon. 
function checkWin(board, player){
    //reduce function goes through every element of the board array, returns a single value. a: accumulator that returns at the end.
    // a is initialized to [], e is the element of the board array we are going through, i is the index. 
    let plays = board.reduce((a,e,i) =>
    (e===player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let[index, win] of winCombinations.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index:index, player:player};
            break; 
        }
    }
    return gameWon;
}

//gets the winner, sets the winning 3 squares to blue if the user wins, else sets it to red if the AI wins.
//Sets the boxes unclickable after the game is over. 
function gameOver(gameWon){
    for(let index of winCombinations[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? "blue" : "red";
    }

    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You Win." : "You lose.")
}

//Looks for the best spot the AI can put an X in. 
function bestSpot(){
    return miniMax(origBoard, AI).index;
}


//Displays the winner after the game ends.
function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

//Function to check what squares are empty, helper for the AI to select its next move.
function emptySquares(){
    return origBoard.filter(s => typeof s =='number');
}

//Checks if the game is currently in a tie state or not. If not game keeps going, otherwise cant go on. 
function checkTie(){
    if(emptySquares().length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}


function miniMax(newBoard, player){
    //Get all available spots on the board.
    var availSpots = emptySquares(newBoard);
    //If the human wins, return -10, else return +10. If tie, return a 0.
    if(checkWin(newBoard, human)){
        return {score: -10}
    }
    else if(checkWin(newBoard, AI)){
        return {score: 10};
    }
    else if(availSpots.length == 0){
        return {score: 0};
    }

    var moves = [];     //Array stores all moves possible.
    for(var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];   
        newBoard[availSpots[i]] = player;

        if(player == AI){
            var result = miniMax(newBoard, human);
            move.score = result.score;  //the score for that move would be the score for the human winning which is -10.
        }
        else{
            var result = miniMax(newBoard, AI);
            move.score = result.score;  //the score for that move would be the score for the AI winning which is 10.
        }

        newBoard[availSpots[i]] = move.index;   //assign index to the newboard.
        moves.push(move);   
    }

    var bestMove;

    if(player === AI){
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; 
}
