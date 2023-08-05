const readline = require('readline-sync');

const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';

const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],  // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9],  // columns
  [1, 5, 9], [3, 5, 7]              //diagonals
];

function displayBoard(board) {
  console.clear();

  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

function joinOr(array, delimiter = ', ', word = 'or') {
  if (array.length === 0) {
    return [];
  }
  else if (array.length === 1) {
    return array[0];
  }
  else if (array.length === 2) {
    return (array[0] + ' ' + word + ' ' + array[1]);
  }
  else if (array.length > 2) {
    let message = '';
    for (let i = 0; i < array.length; i++) {
      if (i === (array.length - 1)) {
        return message += word + ' ' + array[i];
      }
      message += array[i] + delimiter;
    }
  }
}


function initializeBoard() {
  let board = {};

  for (let i = 1; i <= 9; i++) {
    board[String(i)] = INITIAL_MARKER;
  }
  return board;
}

function prompt(message) {
  console.log(`=>${message}`);
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square, (${joinOr(emptySquares(board))}): `);
    square = readline.question().trim();  

      if (emptySquares(board).includes(square)) break;
      
      prompt('Sorry, that\'s not a valid choice');
  }
  
  board[square] = HUMAN_MARKER;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}


//computer chooses square 
function computerChoosesSquare(board) {
  let square; 

  //computer AI defense
  for (let index = 0; index < WINNING_LINES.length; index++) {
    let line = WINNING_LINES[index];
    square = findAtRiskSquare(line, board, HUMAN_MARKER);
    if (square) break;
  }

  //computer AI offense
  if (!square) {
    for (let index = 0; index < WINNING_LINES.length; index++) {
      let line = WINNING_LINES[index];
      square = findAtRiskSquare(line, board, COMPUTER_MARKER);
      if (square) break;
    }
  }
  
  //computer picks a random square
  if (!square) {
    let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
    square = emptySquares(board)[randomIndex];
  }
  
  board[square] = COMPUTER_MARKER;
}

function findAtRiskSquare(line, board, marker) {
  let markersInLine = line.map(square => board[square]);

  if (markersInLine.filter(val => val === marker).length === 2) {
    let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);
    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }
  return null;
}

//program instructions said not to use any global variables; not sure how to track otherwise
let playerScore = 0;
let compScore = 0;
const FINAL_WIN = 3; 


while (true) {
  
  let board = initializeBoard();


  while (true) {

    displayBoard(board);
    playerChoosesSquare(board);
    //break if a condition is met 
    if (someoneWon(board) || boardFull(board)) break;

    computerChoosesSquare(board);
    //break if a condition is met 
    if (someoneWon(board) || boardFull(board)) break;
  }

  displayBoard(board);

 

  if (someoneWon(board)) {
    prompt(`${detectWinner(board)} won!`);

    //calculates score 
    if (detectWinner(board) === 'Player') {
      playerScore += 1;
    }
    else {
      compScore += 1;
    }

    if (playerScore === FINAL_WIN || compScore === FINAL_WIN) {
      console.log(`${detectWinner(board)} wins the match! Game over.`);
      return;
    }
    console.log(`Player Score: ${playerScore}`);
    console.log(`Computer Score: ${compScore}`);
  }
  else {
    prompt('It\'s a tie');
  }

  function boardFull(board) {
    return emptySquares(board).length === 0;
  }

  prompt('Play again? (y or n)');
  let answer = readline.question().toLowerCase()[0];
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe!');

//will return true or false
//!! converts a truthy value like 'abc' or 1 to a boolean
function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {

  for (let line = 0; line < WINNING_LINES.length; line++) {

    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER 
    ) {
      
      return 'Player';
    }
    else if (
      board[sq1] === COMPUTER_MARKER && 
      board[sq2] === COMPUTER_MARKER && 
      board[sq3] === COMPUTER_MARKER 
    ) {
      
      return 'Computer';
    }
  }

  return null;
}

