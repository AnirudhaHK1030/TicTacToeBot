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
    turn(square.target.id, human)
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
}