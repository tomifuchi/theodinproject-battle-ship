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
//Main game loop
const Player = require('./modules/player');
const Logger = require('./modules/sub_modules/logger');

const prompt = require('prompt-sync')();

console.log('Initializing...');

const gameLog = Logger('Game log');
const playerA = Player('PlayerA');
const playerB = Player('PlayerB');
const playerAGameBoard = playerA.gameBoard.receiveAttack.bind(playerA.gameBoard);
const playerBGameBoard = playerB.gameBoard.receiveAttack.bind(playerB.gameBoard);

const AIMoveLose = [[0, 0], [1, 0],[1, 1], [0, 0],[2,2], [3,3], [4,4], [5,5], [6,6], [7, 7], [8,8], [9,9], [1, 2], [1, 3], [1, 4], [5, 7], [6, 4], [8, 9], [7, 4], [9, 0], [9, 2], [9, 5]]
const AIMove = [[0, 0], [1, 0],[1, 1], [2,2], [3,3], [4,4], [5,5], [6,6], [7, 7], [8,8], [9,9], [1, 2], [1, 3], [1, 4], [5, 7], [6, 4], [8, 9], [7, 4], [9, 0], [9, 2], [9, 5]]


function gameLoop() {

    function changeTurn() {
        playerA.turn = playerB.turn;
        playerB.turn = !playerB.turn;
    }

    function checkEndGame() {
        return playerA.gameBoard.isAllSunk() || playerB.gameBoard.isAllSunk();
    }

    console.log('Round Start!!');
    //Let Player A play first
    playerA.turn = true;


    let i = 0;
    while (!checkEndGame()) {
        console.log('--------------------------');
        console.log('PlayerA turn');
        console.log('--------------------------');
        console.log(`Turn ${i} playerA turn: ${playerA.turn}, player B turn: ${playerB.turn}`);

        console.log('Enemy board Reference')
        playerB.gameBoard.printBoard();

        console.log('Your board')
        playerA.gameBoard.printBoard();


        //A move
        let invalidMove = true;
        while (invalidMove) {
            console.log('Make your move');
            const moveX = Number(prompt('Get x'));
            const moveY = Number(prompt('Get Y'));
            invalidMove = playerA.attack([moveX, moveY], playerBGameBoard) ? false : true;
            console.log('Your move: ', invalidMove);
            console.log('Your move by lookup: ', playerB.gameBoard.lookupCoordinate([moveX, moveY]));
        }
        i++;
        console.log('----------------------------------')
        console.log('END PLAYER A TURN');
        console.log('----------------------------------')
        changeTurn();

        console.log('--------------------------');
        console.log('PlayerB turn');
        console.log('--------------------------');
        if (checkEndGame()) break;
        //B move
        console.log(`Turn ${i} playerA turn: ${playerA.turn}, player B turn: ${playerB.turn}`);

        console.log('Enemy board Reference')
        playerA.gameBoard.printBoard();

        console.log('Your board')
        playerB.gameBoard.printBoard();

        playerB.attack(AIMove[i], playerAGameBoard);
        console.log('Your move: ', AIMove[i]);
        console.log('Your move by lookup: ', playerA.gameBoard.lookupCoordinate(AIMove[i]));

        i++;
        console.log('----------------------------------')
        console.log('END PLAYER B TURN');
        console.log('----------------------------------')
        changeTurn();
    }

    console.log('==================')
    console.log('END ROUND');
    console.log('==================')
}
*/