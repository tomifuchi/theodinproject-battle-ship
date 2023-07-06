const Ship = require('./ship'); //Prepare to use pubsub module to fix this.

function Gameboard(n=10, m=10) {
//This board only purpose is to display the edge list sequentially and not take in invalid edgelist.
    const limY = n;
    const limX = m;
    const shipsPlacement = {};
    const board = new Array(n);

    //Set up the board with undefined as the empty state
    for (let i = 0; i < m; i++) {
        board[i] = new Array(m).fill(undefined);
    }

    function printBoard(clean = false) {
        for (let i = 0; i < this.board.length; i++) {
            let row = '';
            for (let j = 0; j < this.board[i].length; j++) {
                row += (clean ?  `[ `: `[ (${i},${j}) `) + ((this.board[i][j]) ? (((typeof this.board[i][j]) === 'string') ? `${this.board[i][j]} ] `:`${this.board[i][j].name} ] `): ` ] `);
            }
            console.log(row);
        }
    }

    //Either clean                                                                                                                                                                                            
    //[1] [ ] [ ] [ ] [ ] [ ] [ ] [ ]                                                                                                                                                                         
    //[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]                                                                                                                                                                         
    //[ ] [2] [ ] [ ] [ ] [ ] [ ] [ ]
    //[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
    //[3] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
    //[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
    //[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
    //[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
    //Or display the coordinates by giving false or true,
    //[(0,0)  ] [(0,1)  ] [(0,2)  ] [(0,3)  ] [(0,4)  ] [(0,5)  ] [(0,6)  ] [(0,7)  ]
    //[(1,0)  ] [(1,1)  ] [(1,2)  ] [(1,3) A] [(1,4)  ] [(1,5) B] [(1,6)  ] [(1,7)  ]
    //[(2,0)  ] [(2,1)  ] [(2,2) H] [(2,3)  ] [(2,4)  ] [(2,5)  ] [(2,6) C] [(2,7)  ]
    //[(3,0)  ] [(3,1)  ] [(3,2)  ] [(3,3)  ] [(3,4) O] [(3,5)  ] [(3,6)  ] [(3,7)  ]
    //[(4,0)  ] [(4,1)  ] [(4,2) G] [(4,3)  ] [(4,4)  ] [(4,5)  ] [(4,6) D] [(4,7)  ]
    //[(5,0)  ] [(5,1)  ] [(5,2)  ] [(5,3) F] [(5,4)  ] [(5,5) E] [(5,6)  ] [(5,7)  ]
    //[(6,0)  ] [(6,1)  ] [(6,2)  ] [(6,3)  ] [(6,4)  ] [(6,5)  ] [(6,6)  ] [(6,7)  ]
    //[(7,0)  ] [(7,1)  ] [(7,2)  ] [(7,3)  ] [(7,4)  ] [(7,5)  ] [(7,6)  ] [(7,7)  ]

    //Clean the board
    function wipeBoard() {
        for (let i = 0; i < this.limY; i++) {
            for (let j = 0; j < this.limX; j++) {
                this.board[i][j] = ' ';
            }
        }
    }

    //Place a ship at x and y
    function placeShip(coor, vesselType, orientation) {
        if (this.checkShipPlacementCoordinate(coor) && (orientation === 'vertical' || orientation === 'horizontal')) {
            //Pubsub message goes here
            const ship = Ship(vesselType);
            const shipCoordinates = [coor];
            if (orientation == 'horizontal') {
                for(let i = 0;i < ship.length;i ++) {
                    shipCoordinates[i] = [coor[0], coor[1] + i];
                }
            } else if (orientation == 'vertical') {
                for(let i = 1;i < ship.length;i ++) {
                    shipCoordinates[i] = [coor[0] + i, coor[1]];
                }
            }

            //Potential improvements here
            if(shipCoordinates.every((coor => (this.checkShipPlacementCoordinate(coor))))){
                shipCoordinates.forEach((coor) => this.board[coor[0]][coor[1]] = ship);
                this.shipsPlacement[ship.name] = {obj: ship, coordinate:shipCoordinates};
                //console.log(this.shipsPlacement);
                return shipCoordinates;
            } //else do something with invalid inputs.
        } //Else do something to invalid arguments.
    }

    //Helper
    function lookupCoordinate(coor) {
        return this.board[coor[0]][coor[1]];
    }

    //helper 
    function isCoordinate(a) {
        return (a instanceof Array && a.length == 2 && typeof a[0] === 'number' && typeof a[1] === 'number')
    }

    //checkValidCoordinate will be use check and receive an actionable coordinate, we can fire if we want to at that coordinate. Should
    //it not valid it will return undefined.
    //* Is a coordinate
    //* Within the limit of the playing board
    //* And it should be undefined.
    function checkShipPlacementCoordinate(coor) {
        return (this.checkCoordinate(coor) && this.lookupCoordinate(coor) === undefined);
    }

    function checkCoordinate(coor) {
        return (isCoordinate(coor) && coor[0] >= 0 && coor[0] < this.limY && coor[1] >= 0 && coor[1] < this.limX);
    }

    //Receive attack and check attack is kinda funky, try to refactor this area here
    function receiveAttack(coor) {
        if(this.checkCoordinate(coor)) {
            const ship = this.lookupCoordinate(coor);
            if(Ship.isShipObject(ship)) {
                ship.hit();
                this.board[coor[0]][coor[1]] = 'hit';
                return coor;
            } else if(ship === undefined) {
                this.board[coor[0]][coor[1]] = 'miss';
                return coor;
            } 
        }
        return undefined;
    }

    function isAllSunk() {
        const shipsArray = Object.entries(this.shipsPlacement).map(entry => entry[1].obj);
        return shipsArray.every(ship => ship.isSunk())
    }

    return Object.assign(Object.create({
        printBoard,
        checkShipPlacementCoordinate, //Use for testing only, since look up coordinate should replace this
        checkCoordinate,
        placeShip,
        lookupCoordinate,
        receiveAttack,
        isAllSunk,
    }), {
        limY, limX, board, shipsPlacement,
    })
}

module.exports = Gameboard;