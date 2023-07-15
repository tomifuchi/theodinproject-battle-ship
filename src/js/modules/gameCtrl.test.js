const Player = require('./player');
const gameCtrl = require('./gameCtrl');

const simmulateRound = (playerMove, AIMove, AGoFirst=true) => {
    gameCtrl.initialize(Player('PlayerA'), Player('PlayerB'));
    return gameCtrl.startRound({
        playerShips: presetsShipsPlacement, 
        AIShips: presetsShipsPlacement,
        playerMove, AIMove,
        AGoFirst,
    });
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

const presetsShipsPlacement = [
    {shipCoordinate: [0, 0], ship: { name: 'Destroyer', length: 2 }, orientation: 'vertical'},
    {shipCoordinate: [2, 2], ship: { name: 'Submarine', length: 3 }, orientation: 'horizontal'},
    {shipCoordinate: [4, 5], ship: { name: 'Cruiser', length: 3 }, orientation: 'horizontal'},
    {shipCoordinate: [7, 1], ship: { name: 'Battleship', length: 4 }, orientation: 'horizontal'},
    {shipCoordinate: [5, 5], ship: { name: 'Carrier', length: 5 }, orientation: 'vertical'},
];

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

test('Initialize the players and score keeping', () => {
    const playerA = Player('playerA');
    const playerB = Player('playerB');
    gameCtrl.initialize(playerA, playerB, 3);
    const vars = gameCtrl.getPrivateVars();

    expect(vars._playerA).toBe(playerA);
    expect(vars._playerB).toBe(playerB);
    expect(vars._playerAScore).toEqual(0);
    expect(vars._playerBScore).toEqual(0);
    expect(vars._gameMaxScore).toEqual(3);
})

test('Simmulate a normal round, playerA should win in this round', () => {
    expect(simmulateRound(playerMove, AIMove)).toEqual('playerA');
});

test('Simmulate a normal round, playerB should win in this round', () => {
    expect(simmulateRound(AIMove, playerMove)).toEqual('playerB');
});

test('Simmulate a very close round, playerA should win this round because playerA go first', () => {
    expect(simmulateRound(AIMove, AIMove)).toEqual('playerA');
});

test('Simmulate a very close round, playerB should win this round because playerB go first', () => {
    expect(simmulateRound(AIMove, AIMove, false)).toEqual('playerB');
});

test('Simmulate the whole game, 3 rounds in total, and keeping score', () => {
    const createRoundDbg = (playerMove, AIMove, AGoFirst=true) => ({
        playerMove, AIMove,
        playerShips: presetsShipsPlacement,
        AIShips: presetsShipsPlacement,
        AGoFirst,
    })

    gameCtrl.initialize(Player('PlayerA'), Player('PlayerB'));
    gameCtrl.startGame([
        createRoundDbg(playerMove, AIMove),
        createRoundDbg(playerMove, AIMove),
        createRoundDbg(AIMove, playerMove),
        createRoundDbg(AIMove, playerMove),
        createRoundDbg(playerMove, AIMove),
        createRoundDbg(playerMove, AIMove),
    ])

    let stats = gameCtrl.getPrivateVars();
    expect(stats._playerAScore).toEqual(4);
    expect(stats._playerBScore).toEqual(2);
    expect(stats._endGame).toEqual(true);
    expect(stats._endRound).toEqual(true);
})