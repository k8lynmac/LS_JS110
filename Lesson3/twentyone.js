const rlsync = require('readline-sync');

/* 1. Initialize deck
-determine data structure for deck, object versus nested array */

let deck = [['2', 4], ['3', 4], ['4', 4], ['5', 4], ['6', 4], ['7', 4], ['8', 4], ['9', 4], ['10', 4], ['Jack', 4], ['Queen', 4], ['King', 4], ['Ace', 4]];


/* 2. Deal cards to player and dealer
-deal 2 cards each to player and dealer
-use Math.random to select each card
-player can see both her cards but only one of the dealer's cards
-function to calculate sum of cards
-log message to the terminal: Dealer has....; Player has...
*/

let playerCards = [];
let dealerCards = [];
let playerTotal = 0;
let dealerTotal = 0;

while (true) {

  while (true) {
    let firstWin = firstDeal(deck);
    if (!firstWin) break;

    let playerBust = hitOrStay(deck);
    //console.log(playerBust);
    if (!playerBust) break;

    if (dealerTotal >= 17) {
      console.log(`dealerTotal = ${dealerTotal}`);
    } else {
      let dealerBust = dealerHitOrStay(deck);
      if (!dealerBust) break;
    }

    compareTotals(dealerTotal, playerTotal);
    break;
  }

  prompt('Play again? (y or n)');
  let answer = rlsync.question().toLowerCase()[0];
  if (answer !== 'y') break;

  else {
    playerCards = [];
    dealerCards = [];
    playerTotal = 0;
    dealerTotal = 0;
    deck = [['2', 4], ['3', 4], ['4', 4], ['5', 4], ['6', 4], ['7', 4], ['8', 4], ['9', 4], ['10', 4], ['Jack', 4], ['Queen', 4], ['King', 4], ['Ace', 4]];
  }
}

//first round to deal cards to player and dealer
//returns boolean -- false if player/dealer wins and true if game moves forward
function firstDeal(deck) {
  dealCards(deck, playerCards);
  dealCards(deck, dealerCards);
  dealCards(deck, playerCards);
  dealCards(deck, dealerCards);

  console.log(`Dealer has: ${dealerCards[0]} and unknown number`);
  console.log(`You have: ${playerCards[0]} and ${playerCards[1]}`);

  //function to check total of cards
  playerTotal = total(playerCards);
  dealerTotal = total(dealerCards);

  if (playerTotal === 21) {
    console.log(`Player wins with a deck sum of ${playerTotal}!`);
    return false;
  } else if (dealerTotal === 21) {
    console.log(`Dealer wins with a deck sum of ${dealerTotal}!`);
    return false;
  }
  return true;
}

function dealCards(deck, opponent) {
  let randomIndex = Math.floor(Math.random() * 13);

  opponent.push(deck[randomIndex][0]);
  deck[randomIndex][1] -= 1;

  //remove array element from deck if all 4 card types were drawn
  if (deck[randomIndex][1] === 0) {
    deck.splice(randomIndex, 1);
  }
}

function total(arrayOfCards) {
  let sum = 0;

  arrayOfCards.forEach(value => {
    if (value === 'Ace') {
      sum += 11;
    } else if (['Jack', 'Queen', 'King'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  //correction for Aces
  arrayOfCards.filter(value => value === 'Ace').forEach(_ => {
    if (sum > 21) {
      sum -= 10;
    }
  });

  return sum;
}

/* 3. Player turn: hit or stay
-repeat until bust or stay
*/

function prompt(message) {
  console.log(`=> ${message}`);
}

//Player turn to decide to hit or stay
//player can continue to hit as many times as they want.
//the turn is over when the player either busts or stays
//if the player busts, the game is over and the dealer wins
function hitOrStay(deck) {
  while (true) {
    prompt('Would you like to hit or stay (h or s)?');
    let response = rlsync.question().toLowerCase()[0];

    while (response !== 'h' && response !== 's') {
      prompt('Incorrect response. Would you like to hit or stay (h or s)?');
      response = rlsync.question().toLowerCase()[0];
    }

    if (response === 's') {
      console.log(`You chose to stay. Your deck sums to: ${playerTotal}`);
      return true;
    } else {
      dealCards(deck, playerCards);
      console.log(joinOr(playerCards));

      playerTotal = total(playerCards);

      if (playerTotal > 21) {
        console.log(`Dealer wins with a deck sum of ${dealerTotal}. Your deck sums to ${playerTotal}.`);
        return false;
      }
    }
  }
}

function joinOr(array, delimiter = ', ', word = 'and') {
  if (array.length === 0) {
    return [];
  } else if (array.length === 1) {
    return ('You have: ' + array[0]);
  } else if (array.length === 2) {
    return ('You have: ' + array[0] + ' ' + word + ' ' + array[1]);
  } else {
    let message = 'You have: ';
    for (let index = 0; index < array.length; index++) {
      if (index === (array.length - 1)) {
        message += word + ' ' + array[index];
        return message;
      }
      message += array[index] + delimiter;
    }
    return message;
  }
}

/* 5. Dealer turn: hit or stay
-hit until the total is at least 17.
-If the dealer busts, then the player wins.
*/

function dealerHitOrStay(deck) {

  while (dealerTotal < 17) {
    dealCards(deck, dealerCards);
    dealerTotal = total(dealerCards);
    //console.log(`${dealerCards} = ${dealerTotal}`);

    //6. If dealer busts, player wins.
    if (dealerTotal > 21) {
      console.log(`Player wins with a deck sum of ${playerTotal}. Dealer deck sums to ${dealerTotal}`);
      return false;
    }

    if (dealerTotal >= 17 && dealerTotal <= 21) {
      return true;
    }
  }
}

// 7. Compare cards and declare winner.
//returns true
function compareTotals(comp, opponent) {
  if (dealerTotal > 21 || playerTotal > 21) {
    return true;
  } else if (comp > opponent) {
    console.log(`Dealer wins with a deck sum of ${comp}. Your deck sums to: ${opponent}`);
    return true;
  } else if (opponent > comp) {
    console.log(`Player wins with a deck sum of ${opponent}. Dealer deck sums to: ${comp}`);
    return true;
  } else if (opponent === comp) {
    console.log(`It's a draw. Player and dealer decks sum to ${comp}.`);
    return true;
  } else {
    //console.log(`dealerTotal: ${comp}, playerTotal: ${opponent}`);
    return false;
  }
}
