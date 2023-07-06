/*
    Note that we have not yet created any User Interface. We should know our
    code is coming together by running the tests. You shouldn’t be relying on
    console.log or DOM methods to make sure your code is doing what you expect
    it to.

    Gameboards should be able to place ships at specific coordinates by calling
    the ship factory function.

    Gameboards should have a receiveAttack function that takes a pair of
    coordinates, determines whether or not the attack hit a ship and then sends
    the ‘hit’ function to the correct ship, or records the coordinates of the
    missed shot.

    Gameboards should keep track of missed attacks so they can display them
    properly.

    Gameboards should be able to report whether or not all of their ships have been sunk.
*/

const Gameboard = require('./gameboard');
const Ship = require('./ship');

const setup = (n=10, m=10) => {
    const testBoard = Gameboard(n, m);
    return testBoard;
}

test('Check ship placement coordinate', () => {
    let testBoard = setup();

    // Valid coordinates
    expect(testBoard.checkCoordinate([1, 1])).toBe(true);
    expect(testBoard.checkCoordinate([2, 2])).toBe(true);
    expect(testBoard.checkCoordinate([3, 3])).toBe(true);
    expect(testBoard.checkCoordinate([4, 4])).toBe(true);
    expect(testBoard.checkCoordinate([5, 5])).toBe(true);
    expect(testBoard.checkCoordinate([6, 6])).toBe(true);
    expect(testBoard.checkCoordinate([7, 7])).toBe(true);
    expect(testBoard.checkCoordinate([8, 8])).toBe(true);
    expect(testBoard.checkCoordinate([9, 9])).toBe(true);

    // Invalid coordinates
    // values
    expect(testBoard.checkCoordinate([1, 10])).toBe(false);
    expect(testBoard.checkCoordinate([1, -1])).toBe(false);
    expect(testBoard.checkCoordinate([10, 1])).toBe(false);
    expect(testBoard.checkCoordinate([-1, 1])).toBe(false);
    expect(testBoard.checkCoordinate([10, 10])).toBe(false);
    expect(testBoard.checkCoordinate([-1, -1])).toBe(false);
    expect(testBoard.checkCoordinate([-1, 10])).toBe(false);
    expect(testBoard.checkCoordinate([10, -1])).toBe(false);

    // parameters requirements
    // must be an 2-dimensional Array object
    // Just a few here primitives testings here
    expect(testBoard.checkCoordinate(1)).toBe(false);
    expect(testBoard.checkCoordinate('Seomthing else')).toBe(false);
    expect(testBoard.checkCoordinate([1,1,2,3])).toBe(false);
    expect(testBoard.checkCoordinate(false)).toBe(false);
    expect(testBoard.checkCoordinate(undefined)).toBe(false);

    //Support for larger board
    testBoard = setup(20, 20);
    expect(testBoard.checkCoordinate([12, 13], {limX: 20, limY: 20})).toBe(true);
    expect(testBoard.checkCoordinate([14, 15], {limX: 20, limY: 20})).toBe(true);
    testBoard = setup(150, 150);
    expect(testBoard.checkCoordinate([100, 100], {limX: 150, limY: 150})).toBe(true);
})

test('Able to look up a coordinate, if empty it return undefined. If theres something return it', () => {
    const testBoard = setup();
    const submarine = {name: 'Submarine', length: 3}

    testBoard.placeShip([1, 2], submarine, 'vertical');
    expect(testBoard.lookupCoordinate([0, 0])).toStrictEqual(undefined);
    expect(testBoard.lookupCoordinate([1, 2])).toStrictEqual(Ship(submarine));
})

test('Place ships at specific coordinates with orientation', () => {
    const testBoard = setup();
    
    const destroyer = {name: 'Destroyer', length: 2};
    const submarine = {name: 'Submarine', length: 3};
        
    //valid inputs
    testBoard.placeShip([1, 2], destroyer, 'vertical');
    testBoard.placeShip([4, 4], submarine, 'horizontal');

    //Reference to the same ship object too. 
    expect(testBoard.lookupCoordinate([1, 2])).toBe(testBoard.shipsPlacement['Destroyer'].obj);
    expect(testBoard.lookupCoordinate([2, 2])).toBe(testBoard.shipsPlacement['Destroyer'].obj)
                                           
    expect(testBoard.lookupCoordinate([4, 4])).toBe(testBoard.shipsPlacement['Submarine'].obj);
    expect(testBoard.lookupCoordinate([4, 5])).toBe(testBoard.shipsPlacement['Submarine'].obj);
    expect(testBoard.lookupCoordinate([4, 6])).toBe(testBoard.shipsPlacement['Submarine'].obj);

    //violates rules
    //* Invalid coordinate placement
    expect(testBoard.placeShip([-1, 2], destroyer, 'vertical')).toStrictEqual(undefined); 
    expect(testBoard.placeShip([10, 10], destroyer, 'vertical')).toStrictEqual(undefined); 
    expect(testBoard.placeShip([11, 9], destroyer, 'horizontal')).toStrictEqual(undefined); 

    testBoard.placeShip([9, 9], destroyer, 'horizontal');
    expect(testBoard.lookupCoordinate([9,9])).toStrictEqual(undefined); 

    testBoard.placeShip([9, 9], destroyer, 'vertical');
    expect(testBoard.lookupCoordinate([9,9])).toStrictEqual(undefined); 

    //* Invalid length, bigger than the board horizontally
    testBoard.placeShip([3, 3], {name: 'Extremely long Destroyer', length: 300}, 'horizontal')
    expect(testBoard.lookupCoordinate([3,3])).toStrictEqual(undefined);

    //* Invalid length, bigger than the board vertically
    testBoard.placeShip([3, 3], {name: 'Extremely long Destroyer', length: 300}, 'vertical')
    expect(testBoard.lookupCoordinate([3,3])).toStrictEqual(undefined)

    //* Invalid parameters for orientation
    testBoard.placeShip([3, 3], destroyer, 'vert');
    expect(testBoard.lookupCoordinate([3,3])).toStrictEqual(undefined);


    //Violates the rules by placing it on top or overlapping an existing ship
    const cruiser = {name: 'Cruiser', length: 3};
    testBoard.placeShip([1, 2], cruiser, 'horizontal');
    expect(testBoard.lookupCoordinate([1,2])).toStrictEqual(Ship(destroyer))
    testBoard.placeShip([1, 1], cruiser, 'horizontal');
    expect(testBoard.lookupCoordinate([1,2])).toStrictEqual(Ship(destroyer))

    //All occupied coordinates should not be undefined.
    expect((() => {
        const occupiedCoordinates = [[1,2],[2,2],[4,4],[4,5],[4,6]];
        return occupiedCoordinates.every((coor) => testBoard.board[coor[0]][coor[1]] === undefined ? false:true); 
    })()).toEqual(true);
});

test('If a ship has occupied certain positions, then those positions should reference the same Ship object', () => {
    const testBoard = setup();

    const submarine = {name: 'Submarine', length: 3};
    testBoard.placeShip([3, 2], submarine, 'horizontal');
    const shipObj = testBoard.lookupCoordinate([3, 2]);

    expect(shipObj).toBe(testBoard.lookupCoordinate([3, 3]));
    expect(shipObj).toBe(testBoard.lookupCoordinate([3, 4]));

    shipObj.hit();

    expect(testBoard.lookupCoordinate([3, 2]).hitsTaken).toEqual(1);
    expect(testBoard.lookupCoordinate([3, 3]).hitsTaken).toEqual(1);
    expect(testBoard.lookupCoordinate([3, 4]).hitsTaken).toEqual(1);
})

test('Record ships placed on the board', () => {
    const testBoard = setup();
    const destroyer = {name: 'Destroyer', length: 3};
    testBoard.placeShip([0, 0], destroyer, 'vertical');
    expect(testBoard.shipsPlacement['Destroyer'].obj).toStrictEqual(Ship(destroyer));
});

test('ReceiveAttack method should takes pairs of coordinates and determine whether or not it is a hit, send hit() to the correct ship and record missed shots', () => {
    const testBoard = setup();
    const submarine = {name: 'Submarine', length: 3};
    testBoard.placeShip([2, 2], submarine, 'vertical');

    testBoard.receiveAttack([2, 0]);
    expect(testBoard.lookupCoordinate([2, 0])).toEqual('miss');

    //Test hit
    const ship = testBoard.shipsPlacement['Submarine'].obj;

    testBoard.receiveAttack([2, 2]);
    expect(testBoard.lookupCoordinate([2, 2])).toEqual('hit');
    expect(ship.hitsTaken).toEqual(1);

    testBoard.receiveAttack([3, 2]);
    expect(testBoard.lookupCoordinate([3, 2])).toEqual('hit');
    expect(ship.hitsTaken).toEqual(2);

    testBoard.receiveAttack([4, 2]);
    expect(testBoard.lookupCoordinate([4, 2])).toEqual('hit');
    expect(ship.hitsTaken).toEqual(3);
    expect(ship.isSunk()).toEqual(true);
});

test('Report if all ships has sunk', () => {
    const testBoard = setup();

    const destroyer = {name: 'Destroyer', length: 3};
    const submarine = {name: 'Submarine', length: 2};

    testBoard.placeShip([3, 3], destroyer, 'vertical');
    testBoard.placeShip([5, 5], submarine, 'horizontal');

    testBoard.receiveAttack([1, 1])
    testBoard.receiveAttack([1, 2])
    testBoard.receiveAttack([1, 3])
    testBoard.receiveAttack([1, 4])

    testBoard.receiveAttack([2, 1])
    testBoard.receiveAttack([2, 2])
    //Sink destroyer
    testBoard.receiveAttack([3, 3])
    testBoard.receiveAttack([4, 3])
    testBoard.receiveAttack([5, 3])

    //Sink submarine 
    testBoard.receiveAttack([5, 5])
    testBoard.receiveAttack([5, 6])
    testBoard.receiveAttack([5, 7])

    expect(testBoard.isAllSunk()).toEqual(true);
});

// Destroyer (2 sqs)
// Submarine (3 sqs)
// Cruiser (3 sqs)
// Battleship (4 sqs)
// Carrier (5 sqs)