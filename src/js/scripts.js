// :::::::::::::::::::::::::: VAR
//! interaction config
let gameInfoMessage = document.querySelector('.player-turn p');
let endgamePopup = document.querySelector('.endgame-popup');
let endGameMessage = document.querySelector('.endgame-popup p');
let newRoundBtn = document.querySelector('.new-round');
let newGameBtn = document.querySelector('.new-game');

//! board config
let board = document.querySelector('.board');
let boardArea = document.querySelector('.board-area');
let startBtn = document.querySelector('.start-game');
let configWindow = document.querySelector('.configuration');
let boardConfigInputArr = document.querySelectorAll('.config-col input');
let rows = 3;
let cols = 3;
let numberOfCase = 9;
let range = document.querySelector('[name="k-in-a-row"]');
let rangeMax = document.querySelector('.range-max');
let rangeValue = document.querySelector('.range-set-value');
//? not useful now but might be ? 
let boardFormat;

//! players config
let newPlayerInput = document.querySelector('.players input');
let addPlayerDiv = document.querySelector('.add-player');
let playersListArr = [];
let playerUlElements = document.querySelector('.players-list');
let removePlayerBtnArr;
let maxPlayersDOM = document.querySelector('.max-players');
let maxPlayer = 2;
let alertPlayer = document.querySelector('.alert-player');
let playerColor, red, green, blue;

//! game config
let currentPlayer = '';
let moveCounter = 0;
let currentTurn = 1;
let playerQty = 0;
let boardCaseArr = [];
let kNumber = 3;

//! play config
let isWon = false;
let mappedBoard = [],
    allCombinations = [],
    filteredCombinations = [],
    winningCombinations = [];
// :::::::::::::::::::::::::: METHODS
// !BEFORE PLAY
//? empty node child
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
//? get random rgb color
function newColor() {
    red = Math.floor(Math.random() * 255);
    green = Math.floor(Math.random() * 255);
    blue = Math.floor(Math.random() * 255);
    return (red, green, blue);
}
//? set board
function boardConfiguration() {
    //? empty board before building div
    removeAllChildNodes(board);
    numberOfCase = rows * cols;
    for (let i = 0; i < numberOfCase; i++) {
        let newCase = document.createElement("div");
        newCase.className = "board-case";
        newCase.classList.add('virgin');
        newCase.id = (i + 1);
        //? show case number
        // newCase.textContent = i + 1;
        board.appendChild(newCase);
    }
    board.style.gridTemplate = `repeat(${rows}, 1fr)/ repeat(${cols}, 1fr)`;
}
//? set player
function removePlayer(name) {
    playersListArr.forEach((player, n) => {
        if (player.name == name) {
            playersListArr.splice(n, 1);
        }
    });
    updatePlayersList(playersListArr);
    if (playersListArr.length < 2) {
        startBtn.classList.remove('show');
    }
}

function updatePlayersList(list) {
    //? empty current dom list
    removeAllChildNodes(playerUlElements);
    //? (re)build dom list with remove div into each li
    list.forEach((player) => {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let div = document.createElement('div');
        let img = document.createElement('img');
        div.classList.add('remove-player-btn');
        div.addEventListener('click', (e) => {
            removePlayer(player.name);
        });
        li.textContent = player.name;
        li.style.color = `rgb(${player.red}, ${player.green}, ${player.blue})`;
        span.textContent = `: ${player.win} pts`;
        li.appendChild(span)
        li.prepend(img);
        li.appendChild(div);
        playerUlElements.appendChild(li);
        img.setAttribute('src', `${player.avatar}`)
            //? update array of remove btn div
        removePlayerBtnArr = Array.from(document.querySelectorAll('.remove-player-btn'));
    });
}
//! AFTER PLAY
//? reset player
function resetGame() {
    playersListArr = [];
    updatePlayersList(playersListArr);
    gameInfoMessage.innerHTML = `enter your names`;
    //? add game setting
    addPlayerDiv.classList.remove('hide');
    configWindow.classList.remove('hide');
    removePlayerBtnArr.forEach((btn) => {
        btn.classList.remove('hide');
    });

}
//? reset game
function resetRound() {
    //? choose first player
    currentPlayer = playersListArr[0];
    //? reinitialize var
    playersListArr.forEach((player) => {
        player.score = [];
    });
    moveCounter = 0;
    isWon = false;
    boardArea.classList.toggle('lock');
    boardCaseArr.forEach((boardcase) => {
        boardcase.classList.add('virgin');
        boardcase.style.background = '';
    });
}
//? PLAY GAME
//? check if won
function checkIfWon(scoreTab) {
    //? comparing all wining combination
    winningCombinations.forEach((combination) => {
        let kToWin = 0;
        //? verifying if each combination number is in the player's case array 
        combination.forEach((idNumber) => {
            if (scoreTab.includes(idNumber)) {
                kToWin += 1;
            }
        });
        //? if there are 3 numbers into player's array, game is won
        if (kToWin == kNumber) {
            //? toggle boolean
            isWon = true;
            //? lock grid 
            //? return to cut off the process
            return isWon;
        }
        //? reset after combination iteration
        kToWin = 0;
    });
    //? check if game is won 
    if (isWon) {
        //? configure message to display
        endGameMessage.innerHTML = `${currentPlayer.name} won this game`;
        endgamePopup.classList.add('show');
        gameInfoMessage.textContent = `${currentPlayer.name}'s won`
        currentPlayer.win++;
        boardArea.classList.toggle('lock');
        updatePlayersList(playersListArr);
    } else if (moveCounter == numberOfCase - 1) {
        endGameMessage.innerHTML = 'This game end in a draw'
        gameInfoMessage.textContent = `no winner`
        endgamePopup.classList.add('show');
        boardArea.classList.toggle('lock');
    }
}
//! WHILE PLAY
//? update informations
function updateTurnInfo() {
    //? at first turn player index correspond to move counter  
    if (moveCounter < playerQty) {
        currentPlayer = playersListArr[moveCounter];
    } else {
        let modulo = moveCounter % playerQty;
        //? defining current player
        if (modulo == 0) { //? means this is the first player
            //? counting turns
            currentTurn += 1;
        }
        currentPlayer = playersListArr[modulo];
    }
    gameInfoMessage.textContent = `${currentPlayer.name}'s turn`
}
//? mark case
function addSign() {
    let thisCase = event.currentTarget;
    //? ensure case is virgin
    if (thisCase.classList.contains('virgin')) {
        thisCase.classList.remove('virgin');
        //? add score to player point array
        currentPlayer.score.push(thisCase.id);
        //? custom case with player avatar
        thisCase.style.background = `rgb(${currentPlayer.red}, ${currentPlayer.green}, ${currentPlayer.blue}) url('${currentPlayer.avatar}') center/contain no-repeat`;
        //? check if won
        checkIfWon(currentPlayer.score);
        //? if not increment moveCounter
        moveCounter += 1;
        updateTurnInfo();
    }
}
//? map the board
function mapBoard() {
    if (mappedBoard.length != 0) {
        mappedBoard = [];
    }
    let abs = 1,
        ord = 1,
        caseMapped = 0;
    //? iteration through the whole grid
    for (let i = 0; i < numberOfCase; i++) {
        //? check if at end of a row
        if ((caseMapped > 0) && (caseMapped % cols) == 0) {
            //? add one to ordonate as we goes down
            abs++;
            //? reset columns count as we go back left
            ord -= cols;
        }
        //? push object with abscisse, ordonate and id of the case
        mappedBoard.push({
            'abs': abs,
            'ord': ord,
            'id': String(i + 1)
        });
        //? increment
        caseMapped++;
        ord++;
    }
}
//? get rows combinations
function getRows() {
    //? for each row
    for (let i = 1; i <= rows; i++) {
        let winningTemp = [];
        mappedBoard.forEach((e) => {
            //? if any mappedBoard case is on this row push case's id into temp array
            if (e.abs == i) {
                winningTemp.push(e.id);
            }
        });
        //? add this combination into array
        allCombinations.push(winningTemp);
    }
    return allCombinations;
}
//? get columns combinations
function getCols() {
    //? for each col
    for (let i = 1; i <= cols; i++) {
        let winningTemp = [];
        mappedBoard.forEach((e) => {
            //? if any mappedBoard case is on this col push case's id into temp array
            if (e.ord == i) {
                winningTemp.push(e.id);
            }
        });
        //? add this combination into array
        allCombinations.push(winningTemp);
    }
    return allCombinations;
}
//? get diagonales combinations
function getDiagsX() {
    for (let i = 0; i < cols; i++) {
        getDiag(i, 'x');
    }
    return allCombinations;
}

function getDiagsY() {
    //? start at 1 to avoid duplicata
    for (let i = 1; i < rows; i++) {
        getDiag((cols * i), 'y');
    }
    return allCombinations;
}

function getDiag(n, d) {
    //? iterate through the whole grid, increment cols+1 for diagonales  
    let winningTemp = [];
    for (let i = n; i < numberOfCase; i += (cols + 1)) {
        winningTemp.push(String(i + 1));
        //? break if diagonale reach the right
        if (d == 'x' && winningTemp.length >= (cols - n)) {
            break;
        }
    }
    allCombinations.push(winningTemp);
}
//? get anti-diagonales combinations
function getAntiDiagsX() {
    for (let i = 0; i < cols; i++) {
        getAntiDiag(i, 'x');
    }
    return allCombinations;
}

function getAntiDiagsY() {
    //? start at 2 to avoid duplicata
    for (let i = 2; i < rows + 1; i++) {
        getAntiDiag((cols * i) - 1, 'y');
    }
    return allCombinations;
}

function getAntiDiag(n, d) {
    //? iterate through the whole grid, increment cols-1 for anti-diagonales  
    let winningTemp = [];
    //? iteration start from end of the row
    for (let i = n; i < numberOfCase; i += (cols - 1)) {
        winningTemp.push(String(i + 1));
        //? break if diagonale reach the left
        if (d == 'x' && winningTemp.length >= n + 1) {
            break;
        } else if (d == 'y' && winningTemp.length >= range.max) {
            break;
        }
    }
    allCombinations.push(winningTemp);
}
//? filter combinations results 
function filterShortCombinations() {
    //? empty array
    allCombinations = [];
    //? fill winning diags arrays
    getDiagsX();
    getDiagsY();
    getAntiDiagsX();
    getAntiDiagsY();
    getRows();
    getCols()
        //? filter combination shorter than k number
    allCombinations.forEach((combination) => {
        if (combination.length >= range.value) {
            filteredCombinations.push(combination);
        }
    });
    return filteredCombinations;
}

function setKCombinations() {
    //? get all combinations
    filterShortCombinations();
    filteredCombinations.forEach((fComb) => {
        if (fComb.length >= kNumber) {
            //? count how many combination are in the number serie
            let split = (fComb.length - kNumber) + 1;
            let winningTemp = [];
            let start;
            for (let i = 0; i < split; i++) {
                //? change starting number for combination
                start = i;
                for (let i2 = 0; i2 < kNumber; i2++) {
                    //? get k number from incremented starting number
                    winningTemp.push(fComb[start]);
                    //? increment into combination
                    start++;
                }
                //? pass combination to final array 
                winningCombinations.push(winningTemp);
                //? clear temp array
                winningTemp = [];
            }
        }
    })
    return winningCombinations;
}


// :::::::::::::::::::::::::: APP
//! CONFIG GAME
//? config board // basic 3*3 board 
window.onload = () => {
    boardConfiguration();
    mapBoard();
};
boardConfigInputArr.forEach((input) => {
    //? listen to any input changment
    input.addEventListener('change', () => {
        //? set the board
        if (input.name == 'columns-number') {
            cols = parseInt(input.value);
        } else if (input.name == 'rows-number') {
            rows = parseInt(input.value);
        }
        //? evaluate board orientation
        if (cols >= rows) {
            range.max = rows;
        } else if (cols <= rows) {
            range.max = cols;
        }
        //? set range value
        rangeMax.textContent = range.max;
        rangeValue.textContent = range.value;
        kNumber = range.value;
        //? set max player
        maxPlayer = Math.round(numberOfCase / range.value);
        maxPlayersDOM.textContent = `(maximum ${maxPlayer} players)`;
        boardConfiguration();
    })
});
//? add players
newPlayerInput.addEventListener('keydown', () => {
    alertPlayer.style.display = 'none';
    if (event.code.includes('Enter')) {

        if (playersListArr.length >= maxPlayer) {
            alertPlayer.textContent = `you can't had anymore player`
            alertPlayer.style.display = 'block';
        } else if (playersListArr.includes(newPlayerInput.value)) {
            alertPlayer.textContent = 'this player is already in the list'
            alertPlayer.style.display = 'block';
        } else if (newPlayerInput.value.length < 3) {
            alertPlayer.textContent = `player's name must have 2 characters`
            alertPlayer.style.display = 'block';
        } else {
            newColor();
            //? create player obj with name + color 
            playersListArr.push({
                "name": newPlayerInput.value,
                "red": red,
                "green": green,
                "blue": blue,
                "score": [],
                "win": 0,
                "avatar": `https://avatars.dicebear.com/api/avataaars/${newPlayerInput.value}.svg?mood[]=happy&mood[]=happy`
            });
            //? pass player obj to dom list
            updatePlayersList(playersListArr);
            //? show button if required player 
            if (playersListArr.length >= 2) {
                startBtn.classList.add('show');
            }
            //? empty input text
            newPlayerInput.value = '';
        }
    }
});
//! PLAY GAME
//? start game
startBtn.addEventListener('click', () => {
    alertPlayer.style.display = 'none';
    if (playersListArr.length < 2) {
        alertPlayer.textContent = `you must add at least 2 players`
        alertPlayer.style.display = 'block';
    } else {
        //? assignate var
        playerQty = playersListArr.length;
        currentPlayer = playersListArr[moveCounter];
        gameInfoMessage.innerHTML = `${currentPlayer.name}'s turn`;
        //? get board cases
        boardCaseArr = Array.from(document.querySelectorAll('.board-case'));
        //? hidde configuration window
        configWindow.classList.add('hide');
        //? activate listener on each case
        boardCaseArr.forEach((boardcase) => {
            boardcase.addEventListener('click', addSign);
        });
        //? remove game settings 
        startBtn.classList.remove('show');
        addPlayerDiv.classList.add('hide');
        removePlayerBtnArr.forEach((btn) => {
            btn.classList.add('hide');
        });
        //? set winning combinations
        mapBoard();
        setKCombinations();
    }
});
//? add sign into case
boardCaseArr.forEach((boardcase) => {
    //? when a case is clicked
    boardcase.addEventListener('click', () => {
        addSign();
    });
});
//? new game same player
newRoundBtn.addEventListener('click', () => {
    //? close popup
    endgamePopup.classList.remove('show');
    //? reinitialize
    resetRound();
});
//? new players reset score
newGameBtn.addEventListener('click', () => {
    //? close popup
    endgamePopup.classList.remove('show');
    //? reinitialize
    resetRound();
    resetGame();
});