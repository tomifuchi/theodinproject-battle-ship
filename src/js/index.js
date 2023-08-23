//This video explain perfectly how to play and what is the rules
//This video explain perfectly how to play and what is the rules
//for battle ship
//https://www.youtube.com/watch?v=4gHJlYLomrs
/*
Battle ship is a board game between 2 players takes place on a 10x10 board that looks like this typically. Or
instead of A to J in the rows, you can use 0 to 9 as well for convience.
 0 1 2 3 4 5 6 7 8 9
A
B
C
D
E
F
G
H
I
J

They both can flip a coin to see if who will go first, red or blue.

Both have a 10x10 board like this and they can place their ships on the board. And no one can see the
opponent's board during the game. Ship placement can't be place diagonal, or on
top of another ship or be on the edge so it sticks out the playing board, it must stay within the playing area, also they can't move
the throughout the duration of duration of the game.

For the 1990 Milton Bradley variation this will be use, other will vary if they so choose to be.
For each player they have (takes up): 
 Destroyer (2 sqs)
 Submarine (3 sqs)
 Cruiser (3 sqs)
 Battleship (4 sqs)
 Carrier (5 sqs)

Players then take turn to fire a single missle to a single coordinate by giving a coordinate. They can't fire at the same coordinate twice,
we must also take note which coordinate is a hit and which is not, they also keep track vessel(s) they have sunk.

During the engagement if there's a hit on the opponent, the opponent must state hit [type of vessel], and state miss if otherwise.

The game continues until one of them had lost all their ships. Either red or blue will win.

*/

/*
Create the main game loop and a module for DOM interaction.

    At this point it is appropriate to begin crafting your User Interface.
    The game loop should set up a new game by creating Players and Gameboards. 
    For now just populate each Gameboard with predetermined coordinates. 
    You can implement a system for allowing players to place their ships later.

    We’ll leave the HTML implementation up to you for now, 
    but you should display both the player’s boards and render them using information from the Gameboard class.
        
    You need methods to render the gameboards and to take user input for attacking. For attacks, 
    let the user click on a coordinate in the enemy Gameboard.
    The game loop should step through the game turn by turn using only methods from other objects. 
    If at any point you are tempted to write a new function inside the game loop, 
    step back and figure out which class or module that function should belong to.
    Create conditions so that the game ends once one players ships have all been sunk. 
    This function is appropriate for the Game module.
*/
/*
Create the main game loop and a module for DOM interaction.

    At this point it is appropriate to begin crafting your User Interface.
    The game loop should set up a new game by creating Players and Gameboards. For now just populate each Gameboard with predetermined coordinates. You can implement a system for allowing players to place their ships later.
    We’ll leave the HTML implementation up to you for now, but you should display both the player’s boards and render them using information from the Gameboard class.
        You need methods to render the gameboards and to take user input for attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.
    The game loop should step through the game turn by turn using only methods from other objects. If at any point you are tempted to write a new function inside the game loop, step back and figure out which class or module that function should belong to.
    Create conditions so that the game ends once one players ships have all been sunk. This function is appropriate for the Game module.

Finish it up

    There are several options available for letting users place their ships. You can let them type coordinates for each ship, or investigate implementing drag and drop.
    You can polish the intelligence of the computer player by having it try adjacent slots after getting a ‘hit’.
    Optionally, create a 2 player option that lets users take turns by passing the device back and forth. If you’re going to go this route, make sure the game is playable on a mobile screen and implement a ‘pass device’ screen so that players don’t see each others boards!

*/

/*
    Progress:
        Front end can be made with HTML canvas to draw out animations and dynamic interaction.
        https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
        Read here for more info

        After a game is made on this idea, this will be implemented on this project to make the frontend
        along with all the assets made.
*/

require('../scss/style.scss');

const display = require('./modules/display');
const Ship = require('./modules/ship');
const {GameBoard, TrackingGameBoard} = require('./modules/gameboard');

const {q, qa, tc} = require('short-dom-util');

const destroyer = {name: 'Destroyer', length: 2};
const submarine = {name: 'Submarine', length: 3};
    
const testGameBoard = GameBoard();
const testTrackingBoard = TrackingGameBoard();

//valid inputs
//testGameBoard.placeShip([1, 2], destroyer, 'vertical');
//testGameBoard.placeShip([4, 4], submarine, 'horizontal');
//
//testTrackingBoard.placeShot({value: Ship(destroyer), coor: [3, 2]});
//testTrackingBoard.placeShot({value: Ship(submarine), coor: [7, 7]});

console.log('tracking Board');
testTrackingBoard.printBoard();
console.log('player Board');
testGameBoard.printBoard();

display.renderBoard(q('#tracking-board'), testTrackingBoard.board);
display.renderBoard(q('#player-board'), testGameBoard.board);


function reRenderCell(target, shipCoordinates, board) {
    //Update cell to similar to boardCell
    shipCoordinates.forEach(coor => {
        tc(q(`[cell="${coor[0]}${coor[1]}"]`, target), board[coor[0]][coor[1]].name)
    })
}


let coor;
let shipCoordinates;
let orientation = 'vertical';
let vesselType = {name: 'Destroyer', length: 3};

qa('#player-board .board-cell').forEach(item => {item.addEventListener(
    "click", (event) => {
        shipCoordinates = testGameBoard.checkShipPlacementCoordinate(coor, vesselType, orientation);
        if(shipCoordinates){
            tc(q('#place-status'), "PLACEMENT POSSIBLE")
            testGameBoard.placeShip(coor, vesselType, orientation);
            reRenderCell(q('#player-board'), shipCoordinates, testGameBoard.board)
            hightLightPlacement(q('#player-board'), shipCoordinates);
        }
        else
            tc(q('#place-status'), "PLACEMENT NOT!!!! POSSIBLE")
}),
    false
})

//Hightlight with error if not found cell it will apear red
function hightLightPlacementSelection(target, shipCoordinates) {

    if(shipCoordinates.every(coor => testGameBoard.lookupCoordinate(coor) == undefined)) {
        shipCoordinates.forEach(coor => {
            q(`[cell="${coor[0]}${coor[1]}"]`, target).style.background = "orange"
        })
    } else { //If not enough cell to fill use the logic here to determined if you can place the ship or not
        shipCoordinates.forEach(coor => {
            q(`[cell="${coor[0]}${coor[1]}"]`, target).style.background = "red"
        })
    }
}

function hightLightPlacement(target, shipCoordinates){
    shipCoordinates.forEach(coor => {
        q(`[cell="${coor[0]}${coor[1]}"]`, target).style.background = "green"
    })
}

function bindCells() {
    qa('#player-board .board-cell').forEach(item => {
        item.addEventListener(
            "mouseover",
            (event) => {
                coor = Array.from(event.target.getAttribute('cell'), (num) => Number(num));
                shipCoordinates = testGameBoard.getTheoreticalPlacementCoordinate(coor, vesselType, orientation)
                hightLightPlacementSelection(q('#player-board'), shipCoordinates);
            },
            false,
        )
    });

    qa('#player-board .board-cell').forEach(item => {
        item.addEventListener(
            "mouseout",
            (event) => {
                if (event.target.style) {
                    if(testGameBoard.checkShipPlacementCoordinate(coor, vesselType, orientation)) {
                        shipCoordinates.forEach(coor => {
                            if (q(`[cell="${coor[0]}${coor[1]}"]`, q('#player-board'))) {
                                q(`[cell="${coor[0]}${coor[1]}"]`, q('#player-board')).style.background = ""
                                // reset the color after a short delay
                            }
                        });
                    }
                }
            },
            false,
        )
    });
}
/*
q('#flip-btn').addEventListener('click', () => orientation = orientation == 'vertical' ? 'horizontal' : 'vertical');

window.addEventListener('keyup', event => {
    if (event.key == ' ')
        orientation = orientation == 'vertical' ? 'horizontal' : 'vertical'
});*/

bindCells();