const Player = require('./modules/player');
const Logger = require('./modules/sub_modules/logger');

const simmulateGame = (playerMove, AIMove, AgoFirst=true) => {
    const gameLog = Logger('Game log');
    gameLog.log('Initializing...');
    const playerA = Player('PlayerA');
    const playerB = Player('PlayerB');

    const playerAScore = 0;
    const playerBScore = 0;

    const playerAGameBoard = playerA.gameBoard.receiveAttack.bind(playerA.gameBoard);
    const playerBGameBoard = playerB.gameBoard.receiveAttack.bind(playerB.gameBoard);

    playerA.gameBoard.placeShip([0, 0], {name: 'Destroyer', length: 2}, 'vertical');
    playerA.gameBoard.placeShip([2, 2], {name: 'Submarine', length: 3}, 'horizontal');
    playerA.gameBoard.placeShip([4, 5], {name: 'Cruiser', length: 3}, 'horizontal');
    playerA.gameBoard.placeShip([7, 1], {name: 'Battleship', length: 4}, 'horizontal');
    playerA.gameBoard.placeShip([5, 5], {name: 'Carrier', length: 5}, 'vertical');

    playerB.gameBoard.placeShip([0, 0], {name: 'Destroyer', length: 2}, 'vertical');
    playerB.gameBoard.placeShip([2, 2], {name: 'Submarine', length: 3}, 'horizontal');
    playerB.gameBoard.placeShip([4, 5], {name: 'Cruiser', length: 3}, 'horizontal');
    playerB.gameBoard.placeShip([7, 1], {name: 'Battleship', length: 4}, 'horizontal');
    playerB.gameBoard.placeShip([5, 5], {name: 'Carrier', length: 5}, 'vertical');


    function changeTurn() {
        playerA.turn = playerB.turn;
        playerB.turn = !playerB.turn;
    }

    function checkEndGame() {
        return playerA.gameBoard.isAllSunk() || playerB.gameBoard.isAllSunk();
    }

    gameLog.log('Round Start!!');
    //Let Player A play first
    if(AgoFirst) {
        playerA.turn = true;
    } else playerB.turn = true;

    let t=1;
    while (!checkEndGame()) {
        let currentPlayer, currentOpponentBoard, currentMove; 
        if(playerA.turn) {
            currentPlayer = playerA;
            currentMove = playerMove;
            currentOpponent = playerB;
            currentOpponentBoard = playerBGameBoard;
        } else {
            currentPlayer = playerB;
            currentMove = AIMove;
            currentOpponent = playerA;
            currentOpponentBoard = playerAGameBoard;
        }

        gameLog.log(`${currentPlayer.name} turn`);
        gameLog.log(`Turn ${t++} playerA turn: ${playerA.turn}, player B turn: ${playerB.turn}`);

        //A move
        const move = currentMove.pop()
        currentPlayer.attack(move, currentOpponentBoard);
        gameLog.log(`Your move: ${move}`);
        gameLog.log(`Your move by lookup: ${currentOpponent.gameBoard.lookupCoordinate(move)}`);

        gameLog.log(`END ${currentPlayer.name} TURN`);
        changeTurn();
    }
    gameLog.log('END ROUND');

    const winner = `player${playerA.gameBoard.isAllSunk() ? 'B':'A'}`;
    gameLog.log(`${winner} wins!!`);
    //console.log(gameLog.getLog());
    return winner;
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

//Best out of 3
//Keep the score
//Start the round and make sure it's the player's turn
//End the game when it reaches 3 rounds, anyone of them got to 3 first won the game.
//This should be a module not a factory funciton.
function GameCtrl(playerAName='PlayerA', playerBName='PlayerB', round=3) {
    function startRound() {

    }

    function reset() {

    }

    function checkEndGame() {

    }

    return {
        playerA,
        playerAScore:0,
        playerB,
        playerBScore:0,
    }
}

test('Simmulate a normal round, playerA should win in this round', () => {
    const playerMove = [
    //playerA.gameBoard.placeShip([0, 0], {name: 'Destroyer', length: 2}, 'vertical');
    [0,0],[1,0],
    //playerA.gameBoard.placeShip([2, 2], {name: 'Submarine', length: 3}, 'horizontal');
    [2,2],[2,3],[2,4],
    //playerA.gameBoard.placeShip([4, 5], {name: 'Cruiser', length: 3}, 'horizontal');
    [4,5],[4,6],[4,7],
    //playerA.gameBoard.placeShip([7, 1], {name: 'Battleship', length: 4}, 'horizontal');
    [7,1],[7,2],[7,3],[7,4],
    //playerA.gameBoard.placeShip([5, 5], {name: 'Carrier', length: 5}, 'vertical');
    [5,5],[6,5],[7,5],[8,5],[9,5],
    ];
    const AIMove = generate2ElementArrays();

    expect(simmulateGame(playerMove, AIMove)).toEqual('playerA');
});

test('Simmulate a normal round, playerB should win in this round', () => {
    const AIMove = [
    //playerA.gameBoard.placeShip([0, 0], {name: 'Destroyer', length: 2}, 'vertical');
    [0,0],[1,0],
    //playerA.gameBoard.placeShip([2, 2], {name: 'Submarine', length: 3}, 'horizontal');
    [2,2],[2,3],[2,4],
    //playerA.gameBoard.placeShip([4, 5], {name: 'Cruiser', length: 3}, 'horizontal');
    [4,5],[4,6],[4,7],
    //playerA.gameBoard.placeShip([7, 1], {name: 'Battleship', length: 4}, 'horizontal');
    [7,1],[7,2],[7,3],[7,4],
    //playerA.gameBoard.placeShip([5, 5], {name: 'Carrier', length: 5}, 'vertical');
    [5,5],[6,5],[7,5],[8,5],[9,5],
    ];
    const playerMove = generate2ElementArrays();

    expect(simmulateGame(playerMove, AIMove)).toEqual('playerB');
});

test('Simmulate a very close round, playerA should win this round because playerA go first', () => {
    const playerMove = generate2ElementArrays();
    const AIMove = generate2ElementArrays();
    expect(simmulateGame(playerMove, AIMove)).toEqual('playerA');
});

test('Simmulate a very close round, playerB should win this round because playerB go first', () => {
    const playerMove = generate2ElementArrays();
    const AIMove = generate2ElementArrays();
    expect(simmulateGame(playerMove, AIMove, false)).toEqual('playerB');
});

test.skip('Simmulate the whole game, 3 rounds in total, each player should keep score', () => {
    const generateMove = () => {
        const playerMove = [
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
        const AIMove = generate2ElementArrays();
        return {playerMove, AIMove}
    }
    let move = generateMove();
    increaseScore(simmulateGame(move['playerMove'], move['AIMove']), 1);
    expect(simmulateGame(move['playerMove'], move['AIMove'])).toEqual('playerA');

    move = generateMove();
    expect(simmulateGame(move['AIMove'], move['playerMove'])).toEqual('playerB');

    move = generateMove();
    expect(simmulateGame(move['playerMove'], move['AIMove'])).toEqual('playerA');
    move = generateMove();
    expect(simmulateGame(move['playerMove'], move['AIMove'])).toEqual('playerA');
});