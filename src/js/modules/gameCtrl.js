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

function _setUpShips(playerAShipsPlacement, playerBShipsPlacement) {
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
    while (!_checkEndGame()) {
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

    _resetTurn();
    _resetGameBoards();
    
    //If debugs turns on then takes ship placement and both playerMovement and AIMovement from dbg
    if (roundDbg) {
        //Set up
        _setUpShips(roundDbg.playerShips, roundDbg.AIShips);
        AIMove = roundDbg.AIMove;
        AIMoveIndex = 0;
        playerMove = roundDbg.playerMove;
        playerMoveIndex = 0;
        if(roundDbg.AGoFirst) _playerA.turn = true;
        else _playerB.turn =true;
    } else { 
        //Flip the coin to determine the turn
        //Set up the ships
        //Set the turns to be randomly chosen
        _setTurnRandom();
    }//Get ship placement

    let t = 1;
    while (!_checkEndRound()) {
        let currentPlayer, currentOpponent, currentMove;
        if (_playerA.turn) {
            currentPlayer = _playerA;
            currentMove = _getPlayerMove('Player', roundDbg); //Get player Move here
            currentOpponent = _playerB;
        } else {
            currentPlayer = _playerB;
            currentMove = _getPlayerMove('AI', roundDbg);
            currentOpponent = _playerA;
        }
        gameCtrlLog.log(`${currentPlayer.name} turn Firing at ${currentMove}`);
        gameCtrlLog.log(`Turn ${t++} playerA turn: ${_playerA.turn}, player B turn: ${_playerB.turn}`);
        gameCtrlLog.log(getPrivateVars());
        currentPlayer.attack(currentMove, currentOpponent);
        gameCtrlLog.log(`END ${currentPlayer.name} TURN`);
        _changeTurn();
    }
    const winner = `player${_playerA.gameBoard.isAllSunk() ? 'B' : 'A'}`;
    gameCtrlLog.log('END ROUND');
    gameCtrlLog.log(`${winner} win the ROUND!`);
    _increaseScore(winner);

    return winner;
}

//Reset scoring but not the data, to reset the entire data, initialize again
function _resetTurn() {
    gameCtrlLog.log('Resetting turns');
    _playerA.turn = false;
    _playerB.turn = false;
}

function _setTurnRandom() {
    if (_coinFlipTurn() === 'playerA') {
        _playerA.turn = true;
        gameCtrlLog.log('Set randomly playerA turn');
    }
    else {
        _playerB.turn = true;
        gameCtrlLog.log('Set randomly playerB turn');
    }
}

function _resetGameBoards() {
    gameCtrlLog.log('Resetting gameBoard, bindding new to GameBoard');
    _playerA.newBoard();
    _playerB.newBoard();

}

function _increaseScore(winner) {
    if (winner === 'playerA') {
        _playerAScore++;
    } else _playerBScore++;
}

function _changeTurn() {
    _playerA.turn = _playerB.turn;
    _playerB.turn = !_playerB.turn;
}

function _checkEndRound() {
    return _playerA.gameBoard.isAllSunk() || _playerB.gameBoard.isAllSunk();
}

function _checkEndGame() {
    return _gameMaxScore < Math.max(_playerAScore, _playerBScore);
}

function _getPlayerMove(currentPlayer, dbg=null) {
    //Get playerMoves here
    if(dbg) {
        if (currentPlayer == 'AI') {
            return AIMove[AIMoveIndex++];
        } else {
            return playerMove[playerMoveIndex++];
        }
    }
}

function _coinFlipTurn() {
    //return heads or tail based on probability over 50% it's heads, under, tail.
    return (Math.random() > 0.5) ? 'playerA' : 'playerB';
}

function getPrivateVars() {
    return { _playerA, _playerB, _playerAScore, _playerBScore, _gameMaxScore, _endGame: _checkEndGame(), _endRound: _checkEndRound()}
}

module.exports = {
    //Methods
    initialize, //To reset a game, initialize again.
    startRound,
    startGame,
    getPrivateVars,
}