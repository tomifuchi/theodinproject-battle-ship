const Gameboard = require('./gameboard');

function Player(name) {

    const gameBoard = Gameboard(10, 10);
    // Destroyer (2 sqs)
    // Submarine (3 sqs)
    // Cruiser (3 sqs)
    // Battleship (4 sqs)
    // Carrier (5 sqs)
    //Usually we bind opponent board to this function
    function attack(coor, opponent) {
        if(this.turn) {
            return opponent.gameBoard.receiveAttack(coor);
        }
    }

    function newBoard() {
        this.gameBoard = Gameboard(10, 10);
    }

    return Object.assign(
        Object.create({
            attack, newBoard,
        }),
        {
            gameBoard,
            turn: false,
            name,
        }
    )
}

module.exports = Player;