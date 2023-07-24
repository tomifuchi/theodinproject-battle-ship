const Player = require('./player');
const gameCtrl = require('./gameCtrl');

const simmulateRound = (dbgPlayerMove, dbgAIMove, AGoFirst=true) => {
    gameCtrl.initialize(Player('PlayerA'), Player('PlayerB'));
    return gameCtrl.startRound({
        playerShipsPlacement: presetsShipsPlacement, 
        AIShipsPlacement: presetsShipsPlacement,
        dbgPlayerMove, dbgAIMove,
        AGoFirst,
    });
}

//Generate array from [0,0] to [9,9]
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
    {coor: [0, 0], vesselType: { name: 'Destroyer', length: 2 }, orientation: 'vertical'},
    {coor: [2, 2], vesselType: { name: 'Submarine', length: 3 }, orientation: 'horizontal'},
    {coor: [4, 5], vesselType: { name: 'Cruiser', length: 3 }, orientation: 'horizontal'},
    {coor: [7, 1], vesselType: { name: 'Battleship', length: 4 }, orientation: 'horizontal'},
    {coor: [5, 5], vesselType: { name: 'Carrier', length: 5 }, orientation: 'vertical'},
];

const winningMove = [
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
const losingMove = generate2ElementArrays();

test('Initialize the players and score keeping', () => {
    const playerA = Player('playerA');
    const playerB = Player('playerB');
    gameCtrl.initialize(playerA, playerB, 3);
    const vars = gameCtrl.getPrivateVars();

    expect(vars._playerA).toBe(playerA);
    expect(vars._playerB).toBe(playerB);
    expect(vars._playerAScore).toStrictEqual(0);
    expect(vars._playerBScore).toStrictEqual(0);
    expect(vars._gameMaxScore).toStrictEqual(3);
})

test('Simmulate a normal round, playerA should win in this round', () => {
    expect(simmulateRound(winningMove, losingMove)).toEqual('playerA');
});

test('Simmulate a normal round, playerB should win in this round', () => {
    expect(simmulateRound(losingMove, winningMove)).toEqual('playerB');
});

test('Simmulate a very close round, playerA should win this round because playerA go first', () => {
    expect(simmulateRound(losingMove, losingMove)).toEqual('playerA');
});

test('Simmulate a very close round, playerB should win this round because playerB go first', () => {
    expect(simmulateRound(losingMove, losingMove, false)).toEqual('playerB');
});

test.skip('Simmulate the whole game, 3 rounds in total, and keeping score', () => {
    const createRoundDbg = (dbgPlayerMove, dbgAIMove, AGoFirst=true) => ({
        dbgPlayerMove, dbgAIMove,
        playerShipsPlacement: presetsShipsPlacement,
        AIShipsPlacement: presetsShipsPlacement,
        AGoFirst,
    })

    gameCtrl.initialize(Player('PlayerA'), Player('PlayerB'));
    gameCtrl.startGame([
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(losingMove, winningMove),
        createRoundDbg(losingMove, winningMove),
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(winningMove, losingMove),
    ])

    let stats = gameCtrl.getPrivateVars();
    expect(stats._playerAScore).toEqual(4);
    expect(stats._playerBScore).toEqual(2);
    expect(stats._endGame).toEqual(true);
    expect(stats._endRound).toEqual(true);

    //Nothing should happen because the game has already ended
    gameCtrl.startGame([
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(losingMove, winningMove),
    ])

    //Varibles should remains the same.
    stats = gameCtrl.getPrivateVars();
    expect(stats._playerAScore).toEqual(4);
    expect(stats._playerBScore).toEqual(2);
    expect(stats._endGame).toEqual(true);
    expect(stats._endRound).toEqual(true);
})

test.skip('Reset scoring should work as intended', () => {
    const createRoundDbg = (dbgPlayerMove, dbgAIMove, AGoFirst=true) => ({
        dbgPlayerMove, dbgAIMove,
        playerShipsPlacement: presetsShipsPlacement,
        AIShipsPlacement: presetsShipsPlacement,
        AGoFirst,
    })

    gameCtrl.initialize(Player('PlayerA'), Player('PlayerB'));
    gameCtrl.startGame([
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(losingMove, winningMove),
        createRoundDbg(losingMove, winningMove),
        createRoundDbg(winningMove, losingMove),
        createRoundDbg(winningMove, losingMove),
    ])

    let stats = gameCtrl.getPrivateVars();
    expect(stats._playerAScore).toEqual(4);
    expect(stats._playerBScore).toEqual(2);
    expect(stats._endGame).toEqual(true);
    expect(stats._endRound).toEqual(true);

    gameCtrl.resetScore();

    stats = gameCtrl.getPrivateVars();
    expect(stats._playerAScore).toEqual(0);
    expect(stats._playerBScore).toEqual(0);
    expect(stats._endGame).toEqual(false);
    expect(stats._endRound).toEqual(true);
});