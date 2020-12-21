const readlineSync = require('readline-sync');

function gameInstructions() {
  console.log('****Welcome to Battle Terminal!!****\n');
  console.log("You shall be tested in this terminal battle against \na computer to see who reigns supreme!!\n\n");
  console.log("The game board looks like this");
  console.log(createBoard());
  console.log("Zeros will be empty space in our terminal sea");
  console.log("Ones will be your 'battle ships'\n\n");
  console.log("Starting from the TOP LEFT position the board's \ncoordinates will be 1,1");
  console.log("The first coordinate, Y, will increase as you go \ndownwards on the board meaning the coordinates for \nthe space under the TOP LEFT space will be 2,1")
  console.log("The second coordinate, X, will increase as you go \nright on the board meaning the coordinates for the space \nright of the TOP LEFT space will be 1,2")
  console.log("Count carefully if you wish to win!\n\n\n")
}

gameInstructions();

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
// Default parameter of 4 meaning computerShipCoordinates() returns an array with 4 elements in row and column
const computerShipCoordinates = function(num = 4) {
  // random number generator for Y axis
  function rowRNG() {
    return Math.floor(Math.random() * 7)
  }
  // random number generator for X axis
  function columnRNG() {
    return Math.floor(Math.random() * 5)
  }
  // Keeping track of previous coordinates allows for a more spread out ship positioning for the computer
  let x_cache = {};
  let y_cache = {};
  let row = [];
  let column = [];

  for(let i = 0; i < num; i++) {
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
const computerCoordinatesArray = computerShipCoordinates();

// takes two arrays of coordinates which we pair together to populate 'board' with ships
function setUpBoard(y_axis, x_axis, board) {
  for(let i = 0; i < y_axis.length; i++) {
    let y = y_axis[i];
    let x = x_axis[i]
    board[y][x] = 1
  }
}

// DEBUG EDGCASE: set up board 2,1;1,2;2,1; - done

function getCoordinatesFromPlayer() {

  // populate each arr with the coordinates accordingly
  const exampleBoard = Array.from(sampleBoard);

  // placeholder for all coordinates
  let player_y_axis = [];
  let player_x_axis = [];

  const shipOrdinals = ['First', 'Second', 'Third', 'Fourth'];
  const shipCoordinates = [];

  shipOrdinals.forEach(ship => {
    let yCoordinate, xCoordinate;
    let uniqueCoordinateSet;

    do {
     uniqueCoordinateSet = true;
     // get y coordinate that is a number in bounds
     do {
        yCoordinate = readlineSync.questionInt(`What is the Y-axis(row) of the ${ship} ship you   wish to place?\nPlease choose between 1 and 7\n`);
     } while ((typeof yCoordinate !== 'number' || yCoordinate < 1 || yCoordinate > 7))
     // get x coordinate that is a number in bounds
     do {
       xCoordinate = readlineSync.questionInt(`What is the X-axis(column) of the ${ship} ship     you wish to place?\nPlease choose between 1 and 5\n`);
     } while (typeof xCoordinate !== 'number' || xCoordinate < 1 || xCoordinate > 5)

      // check if coordinate set has already been used for another ship
      shipCoordinates.forEach(shipObj => {
        if (shipObj.y === yCoordinate && shipObj.x === xCoordinate) {
          uniqueCoordinateSet = false;
        }
      })
    } while (!uniqueCoordinateSet)

    player_y_axis.push(yCoordinate - 1);
    player_x_axis.push(xCoordinate - 1);

    shipCoordinates.push({y: yCoordinate, x: xCoordinate});

    exampleBoard[yCoordinate - 1][xCoordinate - 1] = 1;
  });

  // sets up game by running both functions in succession
  setUpBoard(computerCoordinatesArray[0], computerCoordinatesArray[1], computerBoard);
  setUpBoard(player_y_axis, player_x_axis, playerBoard); 

  // Show player their populated board
  console.log('Great both boards are set up!\n');
  console.log(playerBoard);
}

getCoordinatesFromPlayer();


function playGame(turn = 1) {

  const computerGuessCache = {};
  const playerGuessCache = {};
  let computerWin = false;
  let playerWin = false;

    // Take player guess
    // extra functionality: if player has made guess tell them they have already made that guess and let them guess again
    function playerGuess() {
      do {
      y_axis = readlineSync.questionInt("What is the Y-axis(row) you wish to target for your attack?\n");
      x_axis = readlineSync.questionInt("What is the X-axis(column) you wish to target for your attack?\n");
//      you can't compare arrays to each other so we coerce the arrays into strings to then compare them as strings
        while(JSON.stringify(Object.values(playerGuessCache)).includes(JSON.stringify([y_axis, x_axis]))) {
          console.log('You have already targeted this position before please choose');
          console.log(`These are all the guesses you have made so far:\n[${Object.values(playerGuessCache)}]`);
          y_axis = readlineSync.questionInt("What is the Y-axis(row) you wish to target for your attack?\n");
          x_axis = readlineSync.questionInt("What is the X-axis(column) you wish to target for your attack?\n");
        }
        if(computerBoard[y_axis - 1][x_axis - 1] === undefined) console.log("That position does not exist please re enter your target's coordinates")
      } while(typeof y_axis !== 'number' || typeof x_axis !== 'number' || y_axis < 1 || y_axis > 7 || x_axis < 1 || x_axis > 5)
      playerGuessCache[turn] = [y_axis, x_axis];
      playerGuessCache[turn + 1] = 'Y & X'
      return [y_axis - 1, x_axis - 1]
    }

    function didThisAttackWin(board) {
      for(let i = 0; i < board.length; i++) {
        if(board[i].includes(1)) return false;
      }
      return true;
    }

    // one function that checks computer's board for ships and then player's board for ships, if board is devoid of ships playe1r loses
    function targetShip(boardBeingAttacked, coordinatesArr) {
      y_axis = coordinatesArr[0];
      x_axis = coordinatesArr[1];
      if(boardBeingAttacked[y_axis][x_axis] === 1) {
        boardBeingAttacked[y_axis][x_axis] = 0;
        console.log('BANG');
        console.log('Enemy ship direct hit!');
        console.log('Enemy ship sunk');
        return didThisAttackWin(boardBeingAttacked);
      } else  {
        console.log("That's a miss");
        console.log("Better luck next time");
      }
      return false
    }

  while(!computerWin && !playerWin) {
    console.log("It is your turn");
    console.log(`Turn Number ${turn}`);
    let playerAttackCoor = playerGuess();
    turn++;
    playerWin = targetShip(computerBoard, playerAttackCoor);
    if(playerWin) break;
    let computerAttackCoor = computerShipCoordinates(1);
    while(JSON.stringify(Object.values(computerGuessCache)).includes(JSON.stringify(computerAttackCoor))){
      computerAttackCoor = computerShipCoordinates(1);
    }
    console.log("It is the computer's turn");
    console.log(`Turn Number ${turn}`);
    console.log(`Computer targets ${computerAttackCoor[0] + 1}, ${computerAttackCoor[1] + 1}`)
    computerWin = targetShip(playerBoard, computerAttackCoor);
    turn++;
  }
  if(computerWin) {
    console.log('Computer has won')
  } else {
    console.log('you won')
  }
}
playGame();
// need to console.log computer attack coordinates to ensure computer guess cache works/buggy
