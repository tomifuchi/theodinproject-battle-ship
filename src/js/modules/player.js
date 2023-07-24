const {GameBoard, TrackingGameBoard} = require('./gameboard');

function Player(name) {

    const gameBoard = GameBoard(10, 10);
    const trackingBoard = TrackingGameBoard(10, 10);
    // Destroyer (2 sqs)
    // Submarine (3 sqs)
    // Cruiser (3 sqs)
    // Battleship (4 sqs)
    // Carrier (5 sqs)
    //Usually we bind opponent board to this function
    function attack(coor, opponent) {
        if(this.turn) {
            const shotInfo = opponent.gameBoard.receiveAttack(coor);
            this.trackingBoard.placeShot(shotInfo); //Record shot to enemy
            return shotInfo;
        }
    }

    function newBoard() {
        this.gameBoard = GameBoard();
        this.trackingBoard = TrackingGameBoard();
    }

    return Object.assign(
        Object.create({
            attack, newBoard,
        }),
        {
            trackingBoard,
            gameBoard,
            turn: false,
            name,
        }
    )
}

module.exports = Player;