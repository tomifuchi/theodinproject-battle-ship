const Logger = require('./sub_modules/logger');

const gameCtrlLog = Logger('GameLog');

//Initialize
let _playerA;
let _playerB;
let _playerAScore;
let _playerBScore;
let _gameMaxScore;

//For debugging purpose
let dbgPlayerMove, dbgAIMove;
let dbgPlayerMoveIndex=0, dbgAIMoveIndex=0;

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
        coor: [0, 0],
        vesselType: {name: 'Destroyer', length: 2},
        orientation: 'vertical'
    }
    */
    gameCtrlLog.log('Setting up ships');

    playerAShipsPlacement.forEach(item => {
        _playerA.gameBoard.placeShip(item.coor, item.vesselType, item.orientation);
    })

    playerBShipsPlacement.forEach(item => {
        _playerB.gameBoard.placeShip(item.coor, item.vesselType, item.orientation);
    })
}

/*
gameDbg is an arrays of roundDbg corresponding to rounds you want to simmulate in a game
you can have up to _gameMaxScore * 2 + 1 rounds if two players are very close in term of scoring.
*/
function startGame(gameDbg = null) {
    gameCtrlLog.log('Starting game....');
    while (!_checkEndGame()) {
        if(gameDbg){
            gameDbg.forEach(roundDbg => {
                startRound(roundDbg);
            })
        }
        gameCtrlLog.log(`WINNER IS ${Math.max(_playerAScore, _playerBScore) ? 'PlayerA' : 'PlayerB'} win the GAME`);
    }
    gameCtrlLog.log('GAME END REACHED!');
}

/*
roundDbg look like this
{
    playerShipsPlacement, 
    AIShipsPlacement,
    dbgPlayerMove, dbgAIMove,
    AGoFirst,
}
this is use for testing only. To simmulate a round, pass in the object with that configuration.
*/
function startRound(roundDbg = null) {

    _resetTurn();
    _resetGameBoards();
    
    //If debugs turns on then takes ship placement and both playerMovement and AIMovement from dbg
    if (roundDbg) {
        //Set up
        _setUpShips(roundDbg.playerShipsPlacement, roundDbg.AIShipsPlacement);
        dbgAIMove = roundDbg.dbgAIMove;
        dbgAIMoveIndex = 0;
        dbgPlayerMove = roundDbg.dbgPlayerMove;
        dbgPlayerMoveIndex = 0;
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
    gameCtrlLog.log('Resetting, bindding new gameBoard and trackingBoard');
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
            return dbgAIMove[dbgAIMoveIndex++];
        } else {
            return dbgPlayerMove[dbgPlayerMoveIndex++];
        }
    } //else get real user input here
}

function _coinFlipTurn() {
    //return heads or tail based on probability over 50% it's heads, under, tail.
    return (Math.random() > 0.5) ? 'playerA' : 'playerB';
}

function getPrivateVars() {
    return { _playerA, _playerB, _playerAScore, _playerBScore, _gameMaxScore, _endGame: _checkEndGame(), _endRound: _checkEndRound()}

}

//Reset scoring
function resetScore() {
    _playerAScore = 0;
    _playerBScore = 0;
}

module.exports = {
    //Methods
    initialize, //To reset a game, initialize again.
    resetScore,
    startRound,
    startGame,
    getPrivateVars,
}