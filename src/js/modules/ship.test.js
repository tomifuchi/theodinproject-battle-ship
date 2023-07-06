/*
    Props:
    name, length, hitsTaken, sunk

    Methods:
    * hit(): Increases the number of ‘hits’ in your ship.
    * isSunk(): should be a function that calculates it based on their length and the number of ‘hits’.
*/

const Ship = require('./ship');

// Destroyer (2 sqs)
// Submarine (3 sqs)
// Cruiser (3 sqs)
// Battleship (4 sqs)
// Carrier (5 sqs)
const setup = () => {
    return {
        Destroyer: Ship({name: 'Destroyer', length: 2}),
        Submarine: Ship({name: 'Submarine', length: 3}),
        Cruiser  : Ship({name: 'Cruiser', length: 3}),
        Battleship: Ship({name: 'Battleship', length: 4}),
        Carrier  : Ship({name: 'Carrier', length: 5}),
    }
}

test('Any ship object should have these props: name, lengths, hitsTaken, sunk. Methods: hit, isSunk', () => {
    const testShips = setup();
    //Props
    expect(testShips['Destroyer'].name).toBeDefined();
    expect(testShips['Destroyer'].length).toBeDefined();
    expect(testShips['Destroyer'].hitsTaken).toBeDefined();
    expect(testShips['Destroyer'].sunk).toBeDefined();
    //Methods
    expect(testShips['Destroyer'].hit).toBeDefined();
    expect(testShips['Destroyer'].isSunk).toBeDefined();
});

test('Right name and length for destroyer, submarine, cruiser, battleship, carrier', () => {
    const testShips = setup();
    expect(testShips['Destroyer'].name).toEqual('Destroyer');
    expect(testShips['Destroyer'].length).toEqual(2);

    expect(testShips['Submarine'].name).toEqual('Submarine');
    expect(testShips['Submarine'].length).toEqual(3);

    expect(testShips['Cruiser'].name).toEqual('Cruiser');
    expect(testShips['Cruiser'].length).toEqual(3);

    expect(testShips['Battleship'].name).toEqual('Battleship');
    expect(testShips['Battleship'].length).toEqual(4);

    expect(testShips['Carrier'].name).toEqual('Carrier');
    expect(testShips['Carrier'].length).toEqual(5);
});

test('Hit should increase number of hits', () => {
    const {Destroyer} = setup();

    expect(Destroyer.hitsTaken).toEqual(0);
    Destroyer.hit();
    expect(Destroyer.hitsTaken).toEqual(1);
});

test('Should sink if hit is equal to length', () => {
    const {Destroyer} = setup();

    Destroyer.hit();
    Destroyer.hit();
    expect(Destroyer.isSunk()).toEqual(true);
    expect(Destroyer.sunk).toEqual(true);
});