const Logger = require('./sub_modules/logger');

const gameCtrlLog = Logger('GameLog');

//Initialize
let _playerA;
let _playerB;
let _playerAScore;
let _playerBScore;
let _gameMaxScore;

//For debugging purpose
let playerMove, AIMove;
let playerMoveIndex=0, AIMoveIndex=0;

function initialize(pA, pB, scoreToEndGame = 3) {
    gameCtrlLog.log('Initialzing...Setting up variables')
    //Variables
    _playerA = pA;
    _playerB = pB;
    _playerAScore = 0;
    _playerBScore = 0;
    _gameMaxScore = scoreToEndGame;
}

function setUpShips(playerAShipsPlacement, playerBShipsPlacement) {
    /*Pass in an array of objects that is this example
    {
        shipCoordinate: [0, 0],
        ship: {name: 'Destroyer', length: 2},
        orientation: 'vertical'
    }
    */
    gameCtrlLog.log('Setting up ships');

    playerAShipsPlacement.forEach(item => {
        _playerA.gameBoard.placeShip(item.shipCoordinate, item.ship, item.orientation);
    })

    playerBShipsPlacement.forEach(item => {
        _playerB.gameBoard.placeShip(item.shipCoordinate, item.ship, item.orientation);
    })
}

function startGame(gameDbg = null) {
    gameCtrlLog.log('Starting game....');
    while (!checkEndGame()) {
        if(gameDbg){
            gameDbg.forEach(roudnDbg => {
                startRound(roudnDbg);
            })
        }
    }
    gameCtrlLog.log('GAME END REACHED!');
    gameCtrlLog.log(`WINNER IS ${Math.max(_playerAScore, _playerBScore) ? 'PlayerA' : 'PlayerB'} win the GAME`);
}

function startRound(roundDbg = null) {

    resetTurn();
    resetGameBoards();
    
    //If debugs turns on then takes ship placement and both playerMovement and AIMovement from dbg
    if (roundDbg) {
        //Set up
        setUpShips(roundDbg.playerShips, roundDbg.AIShips);
        AIMove = roundDbg.AIMove;
        AIMoveIndex = 0;
        playerMove = roundDbg.playerMove;
        playerMoveIndex = 0;
        if(roundDbg.AGoFirst) _playerA.turn = true;
        else _playerB.turn =true;
    } else { 
        //Flip the coin to determine the turn
        setTurnRandom();
    }//Get ship placement

    let t = 1;
    while (!checkEndRound()) {
        let currentPlayer, currentOpponent, currentMove;
        if (_playerA.turn) {
            currentPlayer = _playerA;
            currentMove = getPlayerMove('Player', roundDbg); //Get player Move here
            currentOpponent = _playerB;
        } else {
            currentPlayer = _playerB;
            currentMove = getPlayerMove('AI', roundDbg);
            currentOpponent = _playerA;
        }
        gameCtrlLog.log(`${currentPlayer.name} turn Firing at ${currentMove}`);
        gameCtrlLog.log(`Turn ${t++} playerA turn: ${_playerA.turn}, player B turn: ${_playerB.turn}`);
        gameCtrlLog.log(getPrivateVars());
        currentPlayer.attack(currentMove, currentOpponent);
        gameCtrlLog.log(`END ${currentPlayer.name} TURN`);
        changeTurn();
    }
    const winner = `player${_playerA.gameBoard.isAllSunk() ? 'B' : 'A'}`;
    gameCtrlLog.log('END ROUND');
    gameCtrlLog.log(`${winner} win the ROUND!`);
    increaseScore(winner);

    return winner;
}

//Reset scoring but not the data, to reset the entire data, initialize again
function resetTurn() {
    gameCtrlLog.log('Resetting turns');
    _playerA.turn = false;
    _playerB.turn = false;
}

function setTurnRandom() {
    if (coinFlipTurn() === 'playerA') {
        _playerA.turn = true;
        gameCtrlLog.log('Set randomly playerA turn');
    }
    else {
        _playerB.turn = true;
        gameCtrlLog.log('Set randomly playerB turn');
    }
}

function resetGameBoards() {
    gameCtrlLog.log('Resetting gameBoard, bindding new to GameBoard');
    _playerA.newBoard();
    _playerB.newBoard();

}

function increaseScore(winner) {
    if (winner === 'playerA') {
        _playerAScore++;
    } else _playerBScore++;
}

function changeTurn() {
    _playerA.turn = _playerB.turn;
    _playerB.turn = !_playerB.turn;
}

function checkEndRound() {
    return _playerA.gameBoard.isAllSunk() || _playerB.gameBoard.isAllSunk();
}

function checkEndGame() {
    return _gameMaxScore < Math.max(_playerAScore, _playerBScore);
}

//AI or real player
/*
    Play the whole round with predetermined move, this is used for testing only.
    in real game. You gonna need to get the player's move by getting their input.
*/
const getPlayerPresetsMove = () => [
    //playerA.gameBoard.placeShip([0, 0], {name: 'Destroyer', length: 2}, 'vertical');
    [0, 0], [1, 0],
    //playerA.gameBoard.placeShip([2, 2], {name: 'Submarine', length: 3}, 'horizontal');
    [2, 2], [2, 3], [2, 4],
    //playerA.gameBoard.placeShip([4, 5], {name: 'Cruiser', length: 3}, 'horizontal');
    [4, 5], [4, 6], [4, 7],
    //playerA.gameBoard.placeShip([7, 1], {name: 'Battleship', length: 4}, 'horizontal');
    [7, 1], [7, 2], [7, 3], [7, 4],
    //playerA.gameBoard.placeShip([5, 5], {name: 'Carrier', length: 5}, 'vertical');
    [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
];


/*
    Debugging purpose
    let AIMove = generate2ElementArrays();
    let playerMove = getPlayerPresetsMove();
*/

function getPlayerMove(currentPlayer, dbg=null) {
    //Get playerMoves here
    if(dbg) {
        if (currentPlayer == 'AI') {
            return AIMove[AIMoveIndex++];
        } else {
            return playerMove[playerMoveIndex++];
        }
    }
}

function generate2ElementArrays() {
    var arrays = [];
    for (var i = 0; i <= 9; i++) {
        for (var j = 0; j <= 9; j++) {
            arrays.push([i, j]);
        }
    }
    return arrays;
}

function coinFlipTurn() {
    //return heads or tail based on probability over 50% it's heads, under, tail.
    return (Math.random() > 0.5) ? 'playerA' : 'playerB';
}

//initialize(Player('PlayerA'), Player('PlayerB'));
//startGame({
//    playerShips: [
//        { shipCoordinate: [0, 0], ship: { name: 'Destroyer', length: 2 }, orientation: 'vertical' },
//        { shipCoordinate: [2, 2], ship: { name: 'Submarine', length: 3 }, orientation: 'horizontal' },
//        { shipCoordinate: [4, 5], ship: { name: 'Cruiser', length: 3 }, orientation: 'horizontal' },
//        { shipCoordinate: [7, 1], ship: { name: 'Battleship', length: 4 }, orientation: 'horizontal' },
//        { shipCoordinate: [5, 5], ship: { name: 'Carrier', length: 5 }, orientation: 'vertical' },
//    ],
//    AIShips:
//    [
//        { shipCoordinate: [0, 0], ship: { name: 'Destroyer', length: 2 }, orientation: 'vertical' },
//        { shipCoordinate: [2, 2], ship: { name: 'Submarine', length: 3 }, orientation: 'horizontal' },
//        { shipCoordinate: [4, 5], ship: { name: 'Cruiser', length: 3 }, orientation: 'horizontal' },
//        { shipCoordinate: [7, 1], ship: { name: 'Battleship', length: 4 }, orientation: 'horizontal' },
//        { shipCoordinate: [5, 5], ship: { name: 'Carrier', length: 5 }, orientation: 'vertical' },
//    ]}
//);
//console.log(gameLog.getLog());

function getPrivateVars() {
    return { _playerA, _playerB, _playerAScore, _playerBScore, _gameMaxScore, _endGame: checkEndGame(), _endRound: checkEndRound()}
}

module.exports = {
    //Methods
    initialize,
    startRound,
    startGame,
    getPrivateVars,
}

/*
module.exports = {
    initialize,
    startRound,
    startGame,
    reset,
}*/