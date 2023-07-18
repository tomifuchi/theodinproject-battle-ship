/*
    Players can take turns playing the game by attacking the enemy Gameboard.
    The game is played against the computer, so make the ‘computer’ capable of making random plays. The AI does not have to be smart, but it should know whether or not a given move is legal. (i.e. it shouldn’t shoot the same coordinate twice).

    Since it's thouroughly tested in gameBoard, here we only test the changing turns and
    the marking on the board to be appropriately placed.
*/

const Player = require('./player');

const setup = (name) => {
    return new Player(name);
}

test('Player to take turn launch an attack to other player', () => {

    const playerA = setup('PlayerA');
    const playerB = setup('PlayerB');

    expect(playerA).not.toBe(playerB);
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

    //Say playerA get to go first
    playerA.turn = true;


    expect((playerA.attack([2, 2], playerB)).coor).toEqual([2, 2]);
    changeTurn(); //B turn
    expect((playerB.attack([2, 3], playerA)).coor).toEqual([2, 3]);
    changeTurn(); //A turn

    //Maybe changeTurn can run if it's not undefined
    //Should not be able to shoot the same coordinate twice
    expect(playerA.attack([2, 2], playerB)).toEqual(undefined);
    expect((playerA.attack([2, 3], playerB)).coor).toEqual([2, 3]);
    changeTurn(); //B turn

    //Even if hit since this is not player A turn it can't make any move
    expect(playerA.attack([4, 5], playerB)).toEqual(undefined);

    expect((playerB.attack([2, 4], playerA)).coor).toEqual([2, 4]);
    changeTurn(); //A turn
    expect((playerA.attack([2, 4], playerB)).coor).toEqual([2, 4]);


    //Player A Board
    //Gameboard
    expect(playerA.gameBoard.shipsPlacement['Submarine'].obj.hitsTaken).toEqual(2);
    expect(playerA.gameBoard.shipsPlacement['Submarine'].obj.isSunk()).toEqual(false);
    expect(playerA.gameBoard.lookupCoordinate([2, 2])._objType).toEqual('GameObject');
    expect(playerA.gameBoard.lookupCoordinate([2, 3])).toEqual('hit');
    expect(playerA.gameBoard.lookupCoordinate([2, 4])).toEqual('hit');
    expect(playerA.turn).toEqual(true);
    //Tracking Board
    expect(playerA.trackingBoard.lookupCoordinate([2, 2])).toEqual('Submarine');
    expect(playerA.trackingBoard.lookupCoordinate([2, 3])).toEqual('Submarine');
    expect(playerA.trackingBoard.lookupCoordinate([2, 4])).toEqual('Submarine');

    //Player B board
    expect(playerB.gameBoard.shipsPlacement['Submarine'].obj.hitsTaken).toEqual(3);
    expect(playerB.gameBoard.shipsPlacement['Submarine'].obj.isSunk()).toEqual(true);
    expect(playerB.gameBoard.lookupCoordinate([2, 2])).toEqual('hit');
    expect(playerB.gameBoard.lookupCoordinate([2, 3])).toEqual('hit');
    expect(playerB.gameBoard.lookupCoordinate([2, 4])).toEqual('hit');
    expect(playerB.turn).toEqual(false);
    //Tracking board
    expect(playerB.trackingBoard.lookupCoordinate([2, 2])).toEqual(undefined);
    expect(playerB.trackingBoard.lookupCoordinate([2, 3])).toEqual('Submarine');
    expect(playerB.trackingBoard.lookupCoordinate([2, 4])).toEqual('Submarine');
});