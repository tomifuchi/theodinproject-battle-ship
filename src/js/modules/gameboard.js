const Ship = require('./ship'); //Prepare to use pubsub module to fix this.

/*
    Potential improvements: 
        * Graph representation: Instead of matrices you can change it into combo using edgelist with
    binary search tree to quickly query the ship.
    Require: BinaryTree, edgeList
*/

function printBoard(clean = false) {
    for (let i = 0; i < this.board.length; i++) {
        let row = '';
        for (let j = 0; j < this.board[i].length; j++) {
            row += (clean ?  `[ `: `[ (${i},${j}) `) + ((this.board[i][j]) ? (((typeof this.board[i][j]) === 'string') ? `${this.board[i][j]} ] `:`${this.board[i][j].name} ] `): ` ] `);
        }
        console.log(row);
    }
}

//Query the board 
function lookupCoordinate(coor) {
    return this.board[coor[0]][coor[1]];
}

//Check invalid coordinate form
function isCoordinate(a) {
    return (a instanceof Array && a.length == 2 && typeof a[0] === 'number' && typeof a[1] === 'number')
}

//Check out of bound or invalid cooridnate
function checkCoordinate(coor) {
    return (isCoordinate(coor) && coor[0] >= 0 && coor[0] < this.limY && coor[1] >= 0 && coor[1] < this.limX);
}

const GameBoardProto = {
    printBoard,
    checkCoordinate,
    lookupCoordinate,

    //Place a ship at a coordinate with specified orientation
    placeShip: function placeShip(coor, vesselType, orientation) {
        const shipCoordinates = this.checkShipPlacementCoordinate(coor, vesselType, orientation);
        if (shipCoordinates) {
            const ship = Ship(vesselType);
            shipCoordinates.forEach((coor) => this.board[coor[0]][coor[1]] = ship);
            this.shipsPlacement[ship.name] = {obj: ship, coordinate:shipCoordinates};
            return shipCoordinates;
        } //Else do something to invalid arguments.
    },

    //Check to see if we can place a ship here
    //* Is a coordinate
    //* Within the limit of the playing board
    //* And it should be undefined.
    //* Depends on what type of vessel it is, return true or false when can it be place or not
    checkShipPlacementCoordinate: function checkShipPlacementCoordinate(coor, vesselType, orientation) {
        if (this.checkCoordinate(coor) && this.lookupCoordinate(coor) === undefined && (orientation === 'vertical' || orientation === 'horizontal')) {
            const shipCoordinates = this.getTheoreticalPlacementCoordinate(coor, vesselType, orientation);
            return shipCoordinates.every(coor => (this.checkCoordinate(coor) && this.lookupCoordinate(coor) === undefined)) ? shipCoordinates:undefined
        } else return undefined;
    },

    getTheoreticalPlacementCoordinate(coor, vesselType, orientation) {
        const shipCoordinates = [coor];

        //Theoritical placement
        if (orientation == 'horizontal') {
            for(let i = 0;i < vesselType.length;i ++) {
                shipCoordinates[i] = [coor[0], coor[1] + i];
            }
        } else if (orientation == 'vertical') {
            for(let i = 1;i < vesselType.length;i ++) {
                shipCoordinates[i] = [coor[0] + i, coor[1]];
            }
        }

        return shipCoordinates;
    },

    //Receive attack and check attack is kinda funky, try to refactor this area here
    //it receive a coordinate then mark with either hit or miss if the coordinate is valid. Also
    //return shotInfo which is {shipName: undefined/<Vessel type name>, coor} to be put into trackingBoard of your opponent
    receiveAttack: function receiveAttack(coor) {
        if(this.checkCoordinate(coor)) {
            const ship = this.lookupCoordinate(coor);
            if(Ship.isShipObject(ship)) {
                ship.hit();
                this.board[coor[0]][coor[1]] = 'hit';
                return {value: ship.name, coor}; //This is shotInfo here, this will be returned to your opponent to put on their tracking board
            } else if(ship === undefined) {
                this.board[coor[0]][coor[1]] = 'miss';
                return {value: 'miss', coor}; //This is also shotInfo
            } 
        }
        return undefined;
    },

    isAllSunk: function isAllSunk() {
        const shipsArray = Object.entries(this.shipsPlacement).map(entry => entry[1].obj);
        return shipsArray.every(ship => ship.isSunk())
    },
}

const TrackingGameBoardProto = {
    printBoard,
    checkCoordinate,
    lookupCoordinate,

    checkShotPlacementCoordinate: function checkShotPlacementCoordinate(coor) {
        return (this.checkCoordinate(coor) && this.lookupCoordinate(coor) === undefined);
    },

    //Place shot on the tracking board is it a hit or a miss and what type of vessel it is
    //Shot info should connect with receiattack returning shotInfo which contains {value: Ship or'miss', coor}
    placeShot: function placeShot(shotInfo) {
        if(shotInfo && this.checkShotPlacementCoordinate(shotInfo.coor)){
            this.board[shotInfo.coor[0]][shotInfo.coor[1]] = shotInfo.value;
            return shotInfo.value;
        }
    },
}

function GameBoard(n=10, m=10) {
    const limY = n;
    const limX = m;
    const shipsPlacement = {};
    const board = new Array(n);

    //Set up the board with undefined as the empty state
    for (let i = 0; i < m; i++) {
        board[i] = new Array(m).fill(undefined);
    }

    return Object.assign(Object.create(
        GameBoardProto
    ), {
        limY, limX, board, shipsPlacement,
    })
}

//Tracking board only responsible for displaying shots made. if hit something it will label the enemy vessel discovered.
//and miss if otherwise.
function TrackingGameBoard(n = 10, m = 10) {
    const limY = n;
    const limX = m;
    const board = new Array(n);

    //Set up the board with undefined as the empty state
    for (let i = 0; i < m; i++) {
        board[i] = new Array(m).fill(undefined);
    }

    return Object.assign(Object.create(
        TrackingGameBoardProto
    ), {
        limX, limY, board,
    })
}

module.exports = {GameBoard, TrackingGameBoard};