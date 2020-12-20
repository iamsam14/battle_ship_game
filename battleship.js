/**
 * Battleship
 * 
 * Instructions lol
 * 
 * populate a game board - X
 * 
 * keep track of guesses
 * 
 * hit/miss based on guess
 * 
 * keep track of turns
 * 
 * losing condition
 * 
 * 
 * STRETCH GOALS
 * 
 * display users board
 * 
 * let user pick positions
 * 
 * program different sized ships
 * 
 * give a certain algorithm for computer guesses
 */


/**
 * computer board set up - X
 * Player board set up - X
 * keeping track of guesses - 
 * if guess was already made... - 
 * 
 */

var readlineSync = require('readline-sync');

function createBoard(arr) {
  arr = Array(7).fill(0).map(() => Array(5).fill(0));
  return arr;
}

const compBoard = createBoard();
const userBoard = createBoard();
const sampleBoard = createBoard();

const playerBoard = Array.from(compBoard);
const computerBoard = Array.from(userBoard);

// returns an array with two arrays, which will be the y and x coordinates we later use to populate our board with "ships"
const computerShipPositions = function() {
  function rowRNG() {
    return Math.floor(Math.random() * 7)
  }
  function columnRNG() {
    return Math.floor(Math.random() * 5)
  }
  let x_cache = {};
  let y_cache = {};
  let row = [];
  let column = [];
  for(let i = 0; i < 4; i++) {
    column[i] = columnRNG();
    row[i] = rowRNG();
    while(x_cache[column[i]]) {
      column[i] = columnRNG();
    }
    while(y_cache[row[i]]) {
      row[i] = rowRNG();
    }
    x_cache[column[i]] = true;
    y_cache[row[i]] = true
  }
  return [row,column]
}

// Store the return of those coordinates into variable to use for set up of computer's 'board'
const computerCoordinatesArray = computerShipPositions();

// takes two arrays of coordinates which we pair together to populate 'board' with ships
function setUpBoard(y_axis, x_axis, board) {
  for(let i = 0; i < y_axis.length; i++) {
    let y = y_axis[i];
    let x = x_axis[i]
    board[y][x] = 1
  }
}

console.log(computerBoard);

// placeholder for all coordinates
let player_y_axis = [];
let player_x_axis = [];

function getCoordinatesFromPlayer() {
// Player will now set up board
// explain to player first number must be 1 - 7 for row and 1 - 5 for column
// show player board with examples and 3 prepopulated "ships" and explain thier coordinates
// allow player to enter one number at a time for minimum confusion

// populate each arr with the coordinates accordingly
const exampleBoard = Array.from(sampleBoard);

// ask for y of 1
yOfFirstShip = readlineSync.questionInt('what is the Y-axis(row) of the first ship you wish to place?\nPlease choose between 1 and 7\n')
player_y_axis = [...player_y_axis, yOfFirstShip - 1]
// askfor x of 1
xOfFirstShip = readlineSync.questionInt('what is the X-axis(column) of the first ship you wish to place?\nPlease choose between 1 and 5\n')
player_x_axis = [...player_x_axis, xOfFirstShip - 1]
exampleBoard[player_y_axis[0]][player_x_axis[0]] = 1
console.log(exampleBoard)

// ask for y of 2
yOfSecondShip = readlineSync.questionInt('what is the Y-axis(row) of the Second ship you wish to place?\nPlease choose between 1 and 7\n')
player_y_axis = [...player_y_axis, yOfSecondShip - 1]
// askfor x of 2
xOfSecondShip = readlineSync.questionInt('what is the X-axis(column) of the Second ship you wish to place?\nPlease choose between 1 and 5\n')
player_x_axis = [...player_x_axis, xOfSecondShip - 1]
exampleBoard[player_y_axis[1]][player_x_axis[1]] = 1
console.log(exampleBoard)

// ask for y of 3
yOfThirdShip = readlineSync.questionInt('what is the Y-axis(row) of the Third ship you wish to place?\nPlease choose between 1 and 7\n')
player_y_axis = [...player_y_axis, yOfThirdShip - 1]
// askfor x of 3
xOfThirdShip = readlineSync.questionInt('what is the X-axis(column) of the Third ship you wish to place?\nPlease choose between 1 and 5\n')
player_x_axis = [...player_x_axis, xOfThirdShip - 1]
exampleBoard[player_y_axis[2]][player_x_axis[2]] = 1
console.log(exampleBoard)

// ask for y of 4
yOfFourthShip = readlineSync.questionInt('what is the Y-axis(row) of the fourth ship you wish to place?\nPlease choose between 1 and 7\n')
player_y_axis = [...player_y_axis, yOfFourthShip - 1]
// askfor x of 4
xOfFourthShip = readlineSync.questionInt('what is the X-axis(column) of the fourth ship you wish to place?\nPlease choose between 1 and 5\n')
player_x_axis = [...player_x_axis, xOfFourthShip - 1]
exampleBoard[player_y_axis[3]][player_x_axis[3]] = 1
setUpBoard(player_y_axis, player_x_axis, playerBoard); 
console.log('Great your board is set up!')
console.log(playerBoard)
}
getCoordinatesFromPlayer();
// STRETCH GOAL: Allow user to change ONE pair of coordinates rather than have to start over completely || Allow user to see the board be populated as they choose coordinates to ensure they make the right choices
// Show player their populated board


// sets up board by running both functions in succession
  setUpBoard(computerCoordinatesArray[0], computerCoordinatesArray[1], computerBoard)

































