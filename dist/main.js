/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGVvZGlucHJvamVjdC1iYXR0bGUtc2hpcC8uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL1RoaXMgdmlkZW8gZXhwbGFpbiBwZXJmZWN0bHkgaG93IHRvIHBsYXkgYW5kIHdoYXQgaXMgdGhlIHJ1bGVzXG4vL2ZvciBiYXR0bGUgc2hpcFxuLy9odHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTRnSEpsWUxvbXJzXG4vKlxuQmF0dGxlIHNoaXAgaXMgYSBib2FyZCBnYW1lIGJldHdlZW4gMiBwbGF5ZXJzIHRha2VzIHBsYWNlIG9uIGEgMTB4MTAgYm9hcmQgdGhhdCBsb29rcyBsaWtlIHRoaXMgdHlwaWNhbGx5LiBPclxuaW5zdGVhZCBvZiBBIHRvIEogaW4gdGhlIHJvd3MsIHlvdSBjYW4gdXNlIDAgdG8gOSBhcyB3ZWxsIGZvciBjb252aWVuY2UuXG4gMCAxIDIgMyA0IDUgNiA3IDggOVxuQVxuQlxuQ1xuRFxuRVxuRlxuR1xuSFxuSVxuSlxuXG5UaGV5IGJvdGggY2FuIGZsaXAgYSBjb2luIHRvIHNlZSBpZiB3aG8gd2lsbCBnbyBmaXJzdCwgcmVkIG9yIGJsdWUuXG5cbkJvdGggaGF2ZSBhIDEweDEwIGJvYXJkIGxpa2UgdGhpcyBhbmQgdGhleSBjYW4gcGxhY2UgdGhlaXIgc2hpcHMgb24gdGhlIGJvYXJkLiBBbmQgbm8gb25lIGNhbiBzZWUgdGhlXG5vcHBvbmVudCdzIGJvYXJkIGR1cmluZyB0aGUgZ2FtZS4gU2hpcCBwbGFjZW1lbnQgY2FuJ3QgYmUgcGxhY2UgZGlhZ29uYWwsIG9yIG9uXG50b3Agb2YgYW5vdGhlciBzaGlwIG9yIGJlIG9uIHRoZSBlZGdlIHNvIGl0IHN0aWNrcyBvdXQgdGhlIHBsYXlpbmcgYm9hcmQsIGl0IG11c3Qgc3RheSB3aXRoaW4gdGhlIHBsYXlpbmcgYXJlYSwgYWxzbyB0aGV5IGNhbid0IG1vdmVcbnRoZSB0aHJvdWdob3V0IHRoZSBkdXJhdGlvbiBvZiBkdXJhdGlvbiBvZiB0aGUgZ2FtZS5cblxuRm9yIHRoZSAxOTkwIE1pbHRvbiBCcmFkbGV5IHZhcmlhdGlvbiB0aGlzIHdpbGwgYmUgdXNlLCBvdGhlciB3aWxsIHZhcnkgaWYgdGhleSBzbyBjaG9vc2UgdG8gYmUuXG5Gb3IgZWFjaCBwbGF5ZXIgdGhleSBoYXZlICh0YWtlcyB1cCk6IFxuIERlc3Ryb3llciAoMiBzcXMpXG4gU3VibWFyaW5lICgzIHNxcylcbiBDcnVpc2VyICgzIHNxcylcbiBCYXR0bGVzaGlwICg0IHNxcylcbiBDYXJyaWVyICg1IHNxcylcblxuUGxheWVycyB0aGVuIHRha2UgdHVybiB0byBmaXJlIGEgc2luZ2xlIG1pc3NsZSB0byBhIHNpbmdsZSBjb29yZGluYXRlIGJ5IGdpdmluZyBhIGNvb3JkaW5hdGUuIFRoZXkgY2FuJ3QgZmlyZSBhdCB0aGUgc2FtZSBjb29yZGluYXRlIHR3aWNlLFxud2UgbXVzdCBhbHNvIHRha2Ugbm90ZSB3aGljaCBjb29yZGluYXRlIGlzIGEgaGl0IGFuZCB3aGljaCBpcyBub3QsIHRoZXkgYWxzbyBrZWVwIHRyYWNrIHZlc3NlbChzKSB0aGV5IGhhdmUgc3Vuay5cblxuRHVyaW5nIHRoZSBlbmdhZ2VtZW50IGlmIHRoZXJlJ3MgYSBoaXQgb24gdGhlIG9wcG9uZW50LCB0aGUgb3Bwb25lbnQgbXVzdCBzdGF0ZSBoaXQgW3R5cGUgb2YgdmVzc2VsXSwgYW5kIHN0YXRlIG1pc3MgaWYgb3RoZXJ3aXNlLlxuXG5UaGUgZ2FtZSBjb250aW51ZXMgdW50aWwgb25lIG9mIHRoZW0gaGFkIGxvc3QgYWxsIHRoZWlyIHNoaXBzLiBFaXRoZXIgcmVkIG9yIGJsdWUgd2lsbCB3aW4uXG5cbiovXG5cbi8qXG5DcmVhdGUgdGhlIG1haW4gZ2FtZSBsb29wIGFuZCBhIG1vZHVsZSBmb3IgRE9NIGludGVyYWN0aW9uLlxuXG4gICAgQXQgdGhpcyBwb2ludCBpdCBpcyBhcHByb3ByaWF0ZSB0byBiZWdpbiBjcmFmdGluZyB5b3VyIFVzZXIgSW50ZXJmYWNlLlxuICAgIFRoZSBnYW1lIGxvb3Agc2hvdWxkIHNldCB1cCBhIG5ldyBnYW1lIGJ5IGNyZWF0aW5nIFBsYXllcnMgYW5kIEdhbWVib2FyZHMuIFxuICAgIEZvciBub3cganVzdCBwb3B1bGF0ZSBlYWNoIEdhbWVib2FyZCB3aXRoIHByZWRldGVybWluZWQgY29vcmRpbmF0ZXMuIFxuICAgIFlvdSBjYW4gaW1wbGVtZW50IGEgc3lzdGVtIGZvciBhbGxvd2luZyBwbGF5ZXJzIHRvIHBsYWNlIHRoZWlyIHNoaXBzIGxhdGVyLlxuXG4gICAgV2XigJlsbCBsZWF2ZSB0aGUgSFRNTCBpbXBsZW1lbnRhdGlvbiB1cCB0byB5b3UgZm9yIG5vdywgXG4gICAgYnV0IHlvdSBzaG91bGQgZGlzcGxheSBib3RoIHRoZSBwbGF5ZXLigJlzIGJvYXJkcyBhbmQgcmVuZGVyIHRoZW0gdXNpbmcgaW5mb3JtYXRpb24gZnJvbSB0aGUgR2FtZWJvYXJkIGNsYXNzLlxuICAgICAgICBcbiAgICBZb3UgbmVlZCBtZXRob2RzIHRvIHJlbmRlciB0aGUgZ2FtZWJvYXJkcyBhbmQgdG8gdGFrZSB1c2VyIGlucHV0IGZvciBhdHRhY2tpbmcuIEZvciBhdHRhY2tzLCBcbiAgICBsZXQgdGhlIHVzZXIgY2xpY2sgb24gYSBjb29yZGluYXRlIGluIHRoZSBlbmVteSBHYW1lYm9hcmQuXG4gICAgVGhlIGdhbWUgbG9vcCBzaG91bGQgc3RlcCB0aHJvdWdoIHRoZSBnYW1lIHR1cm4gYnkgdHVybiB1c2luZyBvbmx5IG1ldGhvZHMgZnJvbSBvdGhlciBvYmplY3RzLiBcbiAgICBJZiBhdCBhbnkgcG9pbnQgeW91IGFyZSB0ZW1wdGVkIHRvIHdyaXRlIGEgbmV3IGZ1bmN0aW9uIGluc2lkZSB0aGUgZ2FtZSBsb29wLCBcbiAgICBzdGVwIGJhY2sgYW5kIGZpZ3VyZSBvdXQgd2hpY2ggY2xhc3Mgb3IgbW9kdWxlIHRoYXQgZnVuY3Rpb24gc2hvdWxkIGJlbG9uZyB0by5cbiAgICBDcmVhdGUgY29uZGl0aW9ucyBzbyB0aGF0IHRoZSBnYW1lIGVuZHMgb25jZSBvbmUgcGxheWVycyBzaGlwcyBoYXZlIGFsbCBiZWVuIHN1bmsuIFxuICAgIFRoaXMgZnVuY3Rpb24gaXMgYXBwcm9wcmlhdGUgZm9yIHRoZSBHYW1lIG1vZHVsZS5cbiovXG4vKlxuQ3JlYXRlIHRoZSBtYWluIGdhbWUgbG9vcCBhbmQgYSBtb2R1bGUgZm9yIERPTSBpbnRlcmFjdGlvbi5cblxuICAgIEF0IHRoaXMgcG9pbnQgaXQgaXMgYXBwcm9wcmlhdGUgdG8gYmVnaW4gY3JhZnRpbmcgeW91ciBVc2VyIEludGVyZmFjZS5cbiAgICBUaGUgZ2FtZSBsb29wIHNob3VsZCBzZXQgdXAgYSBuZXcgZ2FtZSBieSBjcmVhdGluZyBQbGF5ZXJzIGFuZCBHYW1lYm9hcmRzLiBGb3Igbm93IGp1c3QgcG9wdWxhdGUgZWFjaCBHYW1lYm9hcmQgd2l0aCBwcmVkZXRlcm1pbmVkIGNvb3JkaW5hdGVzLiBZb3UgY2FuIGltcGxlbWVudCBhIHN5c3RlbSBmb3IgYWxsb3dpbmcgcGxheWVycyB0byBwbGFjZSB0aGVpciBzaGlwcyBsYXRlci5cbiAgICBXZeKAmWxsIGxlYXZlIHRoZSBIVE1MIGltcGxlbWVudGF0aW9uIHVwIHRvIHlvdSBmb3Igbm93LCBidXQgeW91IHNob3VsZCBkaXNwbGF5IGJvdGggdGhlIHBsYXllcuKAmXMgYm9hcmRzIGFuZCByZW5kZXIgdGhlbSB1c2luZyBpbmZvcm1hdGlvbiBmcm9tIHRoZSBHYW1lYm9hcmQgY2xhc3MuXG4gICAgICAgIFlvdSBuZWVkIG1ldGhvZHMgdG8gcmVuZGVyIHRoZSBnYW1lYm9hcmRzIGFuZCB0byB0YWtlIHVzZXIgaW5wdXQgZm9yIGF0dGFja2luZy4gRm9yIGF0dGFja3MsIGxldCB0aGUgdXNlciBjbGljayBvbiBhIGNvb3JkaW5hdGUgaW4gdGhlIGVuZW15IEdhbWVib2FyZC5cbiAgICBUaGUgZ2FtZSBsb29wIHNob3VsZCBzdGVwIHRocm91Z2ggdGhlIGdhbWUgdHVybiBieSB0dXJuIHVzaW5nIG9ubHkgbWV0aG9kcyBmcm9tIG90aGVyIG9iamVjdHMuIElmIGF0IGFueSBwb2ludCB5b3UgYXJlIHRlbXB0ZWQgdG8gd3JpdGUgYSBuZXcgZnVuY3Rpb24gaW5zaWRlIHRoZSBnYW1lIGxvb3AsIHN0ZXAgYmFjayBhbmQgZmlndXJlIG91dCB3aGljaCBjbGFzcyBvciBtb2R1bGUgdGhhdCBmdW5jdGlvbiBzaG91bGQgYmVsb25nIHRvLlxuICAgIENyZWF0ZSBjb25kaXRpb25zIHNvIHRoYXQgdGhlIGdhbWUgZW5kcyBvbmNlIG9uZSBwbGF5ZXJzIHNoaXBzIGhhdmUgYWxsIGJlZW4gc3Vuay4gVGhpcyBmdW5jdGlvbiBpcyBhcHByb3ByaWF0ZSBmb3IgdGhlIEdhbWUgbW9kdWxlLlxuXG5GaW5pc2ggaXQgdXBcblxuICAgIFRoZXJlIGFyZSBzZXZlcmFsIG9wdGlvbnMgYXZhaWxhYmxlIGZvciBsZXR0aW5nIHVzZXJzIHBsYWNlIHRoZWlyIHNoaXBzLiBZb3UgY2FuIGxldCB0aGVtIHR5cGUgY29vcmRpbmF0ZXMgZm9yIGVhY2ggc2hpcCwgb3IgaW52ZXN0aWdhdGUgaW1wbGVtZW50aW5nIGRyYWcgYW5kIGRyb3AuXG4gICAgWW91IGNhbiBwb2xpc2ggdGhlIGludGVsbGlnZW5jZSBvZiB0aGUgY29tcHV0ZXIgcGxheWVyIGJ5IGhhdmluZyBpdCB0cnkgYWRqYWNlbnQgc2xvdHMgYWZ0ZXIgZ2V0dGluZyBhIOKAmGhpdOKAmS5cbiAgICBPcHRpb25hbGx5LCBjcmVhdGUgYSAyIHBsYXllciBvcHRpb24gdGhhdCBsZXRzIHVzZXJzIHRha2UgdHVybnMgYnkgcGFzc2luZyB0aGUgZGV2aWNlIGJhY2sgYW5kIGZvcnRoLiBJZiB5b3XigJlyZSBnb2luZyB0byBnbyB0aGlzIHJvdXRlLCBtYWtlIHN1cmUgdGhlIGdhbWUgaXMgcGxheWFibGUgb24gYSBtb2JpbGUgc2NyZWVuIGFuZCBpbXBsZW1lbnQgYSDigJhwYXNzIGRldmljZeKAmSBzY3JlZW4gc28gdGhhdCBwbGF5ZXJzIGRvbuKAmXQgc2VlIGVhY2ggb3RoZXJzIGJvYXJkcyFcblxuKi9cblxuLypcbi8vTWFpbiBnYW1lIGxvb3BcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9wbGF5ZXInKTtcbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zdWJfbW9kdWxlcy9sb2dnZXInKTtcblxuY29uc3QgcHJvbXB0ID0gcmVxdWlyZSgncHJvbXB0LXN5bmMnKSgpO1xuXG5jb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nLi4uJyk7XG5cbmNvbnN0IGdhbWVMb2cgPSBMb2dnZXIoJ0dhbWUgbG9nJyk7XG5jb25zdCBwbGF5ZXJBID0gUGxheWVyKCdQbGF5ZXJBJyk7XG5jb25zdCBwbGF5ZXJCID0gUGxheWVyKCdQbGF5ZXJCJyk7XG5jb25zdCBwbGF5ZXJBR2FtZUJvYXJkID0gcGxheWVyQS5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjay5iaW5kKHBsYXllckEuZ2FtZUJvYXJkKTtcbmNvbnN0IHBsYXllckJHYW1lQm9hcmQgPSBwbGF5ZXJCLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrLmJpbmQocGxheWVyQi5nYW1lQm9hcmQpO1xuXG5jb25zdCBBSU1vdmVMb3NlID0gW1swLCAwXSwgWzEsIDBdLFsxLCAxXSwgWzAsIDBdLFsyLDJdLCBbMywzXSwgWzQsNF0sIFs1LDVdLCBbNiw2XSwgWzcsIDddLCBbOCw4XSwgWzksOV0sIFsxLCAyXSwgWzEsIDNdLCBbMSwgNF0sIFs1LCA3XSwgWzYsIDRdLCBbOCwgOV0sIFs3LCA0XSwgWzksIDBdLCBbOSwgMl0sIFs5LCA1XV1cbmNvbnN0IEFJTW92ZSA9IFtbMCwgMF0sIFsxLCAwXSxbMSwgMV0sIFsyLDJdLCBbMywzXSwgWzQsNF0sIFs1LDVdLCBbNiw2XSwgWzcsIDddLCBbOCw4XSwgWzksOV0sIFsxLCAyXSwgWzEsIDNdLCBbMSwgNF0sIFs1LCA3XSwgWzYsIDRdLCBbOCwgOV0sIFs3LCA0XSwgWzksIDBdLCBbOSwgMl0sIFs5LCA1XV1cblxuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcblxuICAgIGZ1bmN0aW9uIGNoYW5nZVR1cm4oKSB7XG4gICAgICAgIHBsYXllckEudHVybiA9IHBsYXllckIudHVybjtcbiAgICAgICAgcGxheWVyQi50dXJuID0gIXBsYXllckIudHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0VuZEdhbWUoKSB7XG4gICAgICAgIHJldHVybiBwbGF5ZXJBLmdhbWVCb2FyZC5pc0FsbFN1bmsoKSB8fCBwbGF5ZXJCLmdhbWVCb2FyZC5pc0FsbFN1bmsoKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnUm91bmQgU3RhcnQhIScpO1xuICAgIC8vTGV0IFBsYXllciBBIHBsYXkgZmlyc3RcbiAgICBwbGF5ZXJBLnR1cm4gPSB0cnVlO1xuXG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKCFjaGVja0VuZEdhbWUoKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1BsYXllckEgdHVybicpO1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgICAgY29uc29sZS5sb2coYFR1cm4gJHtpfSBwbGF5ZXJBIHR1cm46ICR7cGxheWVyQS50dXJufSwgcGxheWVyIEIgdHVybjogJHtwbGF5ZXJCLnR1cm59YCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ0VuZW15IGJvYXJkIFJlZmVyZW5jZScpXG4gICAgICAgIHBsYXllckIuZ2FtZUJvYXJkLnByaW50Qm9hcmQoKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnWW91ciBib2FyZCcpXG4gICAgICAgIHBsYXllckEuZ2FtZUJvYXJkLnByaW50Qm9hcmQoKTtcblxuXG4gICAgICAgIC8vQSBtb3ZlXG4gICAgICAgIGxldCBpbnZhbGlkTW92ZSA9IHRydWU7XG4gICAgICAgIHdoaWxlIChpbnZhbGlkTW92ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01ha2UgeW91ciBtb3ZlJyk7XG4gICAgICAgICAgICBjb25zdCBtb3ZlWCA9IE51bWJlcihwcm9tcHQoJ0dldCB4JykpO1xuICAgICAgICAgICAgY29uc3QgbW92ZVkgPSBOdW1iZXIocHJvbXB0KCdHZXQgWScpKTtcbiAgICAgICAgICAgIGludmFsaWRNb3ZlID0gcGxheWVyQS5hdHRhY2soW21vdmVYLCBtb3ZlWV0sIHBsYXllckJHYW1lQm9hcmQpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdXIgbW92ZTogJywgaW52YWxpZE1vdmUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdXIgbW92ZSBieSBsb29rdXA6ICcsIHBsYXllckIuZ2FtZUJvYXJkLmxvb2t1cENvb3JkaW5hdGUoW21vdmVYLCBtb3ZlWV0pKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgICAgICAgY29uc29sZS5sb2coJ0VORCBQTEFZRVIgQSBUVVJOJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgICAgICAgY2hhbmdlVHVybigpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICBjb25zb2xlLmxvZygnUGxheWVyQiB0dXJuJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICBpZiAoY2hlY2tFbmRHYW1lKCkpIGJyZWFrO1xuICAgICAgICAvL0IgbW92ZVxuICAgICAgICBjb25zb2xlLmxvZyhgVHVybiAke2l9IHBsYXllckEgdHVybjogJHtwbGF5ZXJBLnR1cm59LCBwbGF5ZXIgQiB0dXJuOiAke3BsYXllckIudHVybn1gKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnRW5lbXkgYm9hcmQgUmVmZXJlbmNlJylcbiAgICAgICAgcGxheWVyQS5nYW1lQm9hcmQucHJpbnRCb2FyZCgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdZb3VyIGJvYXJkJylcbiAgICAgICAgcGxheWVyQi5nYW1lQm9hcmQucHJpbnRCb2FyZCgpO1xuXG4gICAgICAgIHBsYXllckIuYXR0YWNrKEFJTW92ZVtpXSwgcGxheWVyQUdhbWVCb2FyZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdZb3VyIG1vdmU6ICcsIEFJTW92ZVtpXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdZb3VyIG1vdmUgYnkgbG9va3VwOiAnLCBwbGF5ZXJBLmdhbWVCb2FyZC5sb29rdXBDb29yZGluYXRlKEFJTW92ZVtpXSkpO1xuXG4gICAgICAgIGkrKztcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICAgICAgICBjb25zb2xlLmxvZygnRU5EIFBMQVlFUiBCIFRVUk4nKTtcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICAgICAgICBjaGFuZ2VUdXJuKCk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PScpXG4gICAgY29uc29sZS5sb2coJ0VORCBST1VORCcpO1xuICAgIGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT0nKVxufVxuKi8iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=