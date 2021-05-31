// :::::::::::::::::::::::::: VAR

let boardCaseArr = Array.from(document.querySelectorAll('.board-case'));
let winingCombination = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['3', '6', '9'],
    ['1', '5', '9'],
    ['3', '5', '7'],
];
let xPlayerInput = document.querySelector('.x-player');
let xPlayerName = 'X';
let xPlayerScores = [];
let xGamesScore = 0;
let oPlayerInput = document.querySelector('.o-player');
let oPlayerName = 'O';
let oPlayerScores = [];
let oGamesScore = 0;
let currentPlayer = 'X';
let moveCounter = 0;
let gameInfoMesage = document.querySelector('.player-turn p');
let isWon = false;
let endgamePopup = document.querySelector('.endgame-popup');
let endGameMessage = document.querySelector('.endgame-popup p');
let xScoreMessage = document.querySelector('.x-score');
let oScoreMessage = document.querySelector('.o-score');
let resetBtn = document.querySelector('.reset');
let newGameBtn = document.querySelector('.new-game');
// :::::::::::::::::::::::::: METHODS


function resetGame() {
    xPlayerScores = [];
    oPlayerScores = [];
    currentPlayer = xPlayerName;
    moveCounter = 0;
    isWon = false;
    boardCaseArr.forEach((boardcase) => {
        boardcase.classList.remove('x-case');
        boardcase.classList.remove('o-case');
    })
}

function newPlayers() {
    xGamesScore = 0;
    oGamesScore = 0;
    xPlayerName = 'X'
    xPlayerInput.value = '';
    oPlayerName = 'O'
    oPlayerInput.value = '';
    gameInfoMesage.innerHTML = `enter your names`;
    xScoreMessage.innerHTML = `${xPlayerName}: ${xGamesScore} Pts`
    oScoreMessage.innerHTML = `${oPlayerName}: ${oGamesScore} Pts`
}

function checkIfWon(scoreTab) {
    //? comparing all wining combination
    winingCombination.forEach((combinaison) => {
        let threeToWin = 0;
        //? verifying if each combination number is in the player's case array 
        combinaison.forEach((idNumber) => {
            if (scoreTab.includes(idNumber)) {
                threeToWin += 1;
            }
        });
        //? if there are 3 numbers into player's array, game is won
        if (threeToWin == 3) {
            isWon = true;
            //? apply treatment for proper winer
            if (scoreTab == xPlayerScores) {
                xGamesScore += 1
            } else if (scoreTab == oPlayerScores) {
                oGamesScore += 1
            }
            //? configure message to display
            endGameMessage.innerHTML = `${currentPlayer} won this game`;
            xScoreMessage.innerHTML = `${xPlayerName}: ${xGamesScore} Pts`
            oScoreMessage.innerHTML = `${oPlayerName}: ${oGamesScore} Pts`
                //? retunr to cut off the process
            return isWon;
        }
        //? reset after combination iteration
        threeToWin = 0;
    });
}

function addSign() {
    let thisCase = event.currentTarget;
    //? ensure case is virgin
    if (thisCase.classList.length == 1) {
        //? pair is o, impair is x
        moveCounter += 1;
        //? adding player's sign into case
        if (moveCounter % 2 == 0) {
            thisCase.classList.add('o-case');
            oPlayerScores.push(thisCase.id);
            checkIfWon(oPlayerScores);
            currentPlayer = xPlayerName;
        } else if (moveCounter % 2 == 1) {
            thisCase.classList.add('x-case');
            xPlayerScores.push(thisCase.id);
            checkIfWon(xPlayerScores);
            currentPlayer = oPlayerName;
        } else {
            alert('something wrong happened');
        }
    }
}


// :::::::::::::::::::::::::: APP
window.onload = () => {
    gameInfoMesage.innerHTML = `${currentPlayer}'s turn`;
};
//? get player's names
xPlayerInput.addEventListener('blur', () => {
    if (xPlayerInput.value != '') {
        xPlayerName = xPlayerInput.value;
        xScoreMessage.innerHTML = `${xPlayerName}: ${xGamesScore} Pts`
        gameInfoMesage.innerHTML = `${xPlayerName}'s turn`;
    }
});
oPlayerInput.addEventListener('blur', () => {
    if (oPlayerInput.value != '') {
        oPlayerName = oPlayerInput.value;
        oScoreMessage.innerHTML = `${oPlayerName}: ${oGamesScore} Pts`
    }
});

//? game based on player's moves
boardCaseArr.forEach((boardcase) => {
    //? when a case is clicked
    boardcase.addEventListener('click', () => {
        addSign();
        //? check if game is won 
        if (moveCounter >= 5 && moveCounter <= 9) {
            if (isWon) {
                endgamePopup.classList.add('show');
            } else if (moveCounter == 9) {
                endGameMessage.innerHTML = 'This game end in a draw'
                endgamePopup.classList.add('show');
            }
        }
        gameInfoMesage.innerHTML = `${currentPlayer}'s turn`;
    });
});
//? new game
resetBtn.addEventListener('click', () => {
    //? close popup
    endgamePopup.classList.remove('show');
    //? reinitialize
    resetGame();
});
//? new players
newGameBtn.addEventListener('click', () => {
    console.log('coucou');
    resetGame();
    newPlayers();
});