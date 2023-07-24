const {cea, ap, tc, clc} = require('short-dom-util');

//What this will do is render the multidimensional array and that's it
//Board either TrackingBoard or GameBoard
function renderBoard(target, board) {
    //Clear the board
    clc(target);
    //Redraw the board
    for(let i = 0; i < board.length; i++) {
        const row = cea('div', {class: 'board-row'});
        for(let j = 0;j < board[i].length;j++) {
            ap(row, tc(cea('div', {class: 'board-row-cell'}), board[i][j] ? board[i][j].name:'empty'));
        }
        ap(target,row);
    }
}

//The display will have main menu and 3 state MAIN MENU and GAME
//THey have 3 phases main menu, start, in-game, end-game state 


//Main menu state, main menu phase
//Start button (Your name is automatically selected as commander and other is AI)

/* 
    BATTLE SHIP
    START GAME
    RULES MUTE SOUND
*/


//GAME STATE
//Start phase
//(At anytime) You can reset the game by going back to main menu this will reset the entire game, or mute sound.
//Starting phase is the phase we can:
//* Select coordinate to put our ships down. We can choose the orientation first then select the coordinate
//you can bind space to change orientation.
//When you hover it will highlight the grid cell to be green with the image of the current ship, with the right
//orientation
/*
    MainMenu     Rules mute sound

    EMPTY, DISABLED Tracking board

    ENABLE Your board, place ship here

    command console, 
    Coordinate  ShipType Orientation
*/

//In-Game state is the phase we can choose coordinate in our enemy board to shoot them, we can:
//* Shoot once
//* Our board is not selectable
//* We can not shoot at the same coordinate twice(Disable the fire button)
//Take turn to fire at each other, label hit or miss accordingly

/*
    MainMenu     Rules mute sound

    NON-SELECTABLE ENABLE Tracking board

    NON-SELECTABLE Your board, place ship here

    command console, ENABLED when in turn
    Coordinate  Intel   FIRE!
*/

//End phase:
//* Disable two boards display the winner.
//* Prompt to return main menu to reinitialize the game again

/*
    MainMenu     Rules mute sound

    NON-SELECTABLE ENABLE Tracking board

    NON-SELECTABLE Your board, place ship here

    command console, ENABLED when in turn
    Coordinate  Intel   FIRE!

    OVERLAY EVERYTHING WITH SEMI BLACK BACKGROUND
    WINNER/LOSER
    Play again ?/Get revenge ?

*/

function renderGameState() {
    /*
    Add this to the #display
    #game-notification EXAMPLE NOTIFICATION USE FOR DISPLAY TURN
    nav
      button#main-menu Main menu
      h3.game-title BattleShips

      .rules-mute-btn
        button#rules-button Rules
        #rules.letter
          .letter-header
            h3 Friendly Country Naval Atlantic Fleet
            h3 Delta Battleship
            h3 April 26th, 1940
          .letter-body
            h4 Commander,
            p You are about to engage in a strategic naval battle against an enemy fleet, with the objective of sinking their ships before they can do the same to yours. The game you will be playing is called "Battleship," and the rules are as follows:
            ol
              li Deployment: You will each command a fleet of ships, including aircraft carrier, battleship, cruiser, destroyer, and submarine. Your fleet will be secretly placed on a grid, with each ship occupying a specified number of squares.
              li The Grid: The grid is divided into columns (0-9) and rows (0-9). Each square on the grid represents a position in the ocean where a ship can be placed.
              li Placement Restrictions: Ships cannot overlap or touch each other, not even diagonally. Ships must be placed according to their dimensions, with aircraft carriers occupying five squares, battleships four squares, cruisers and submarines three squares, destroyers two squares each.
              li The Battle Begins: You will take turns firing at your opponent's fleet. On your turn, you select a column and a row coordinate, attempting to guess the position of an enemy ship. Your opponent will then respond with a hit or a miss.
              li Hits and Misses: If your shot lands on an enemy ship, it is considered a hit, and the ship is considered damaged. If all of a ship's hit points are exhausted, it is considered sunk. A miss indicates that your shot did not hit any enemy ships. You can't shoot the same coordinate twice.
              li Identifying Ships: After a hit, your opponent will reveal the ship that was hit but not its exact position. You will then mark that ship on your board to keep track of it.
              li Game Continues: After a hit or a miss, your turn continues with another shot. You may fire a shot during your turn, but once you have ended your turn, the enemy will have a chance to fire back.
              li Sinking the Enemy Fleet: Your objective is to sink all of your opponent's ships. Once all of their ships have been sunk, you will win the battle and secured the victory for your nation.
            p Remember, Commander, success in this battle depends on your ability to outwit and outmaneuver your opponent. Use your knowledge of naval tactics, strategy, and the element of surprise to gain the upper hand and emerge victorious from this high-stakes engagement. 
            p Good luck, and may the best commander win!

        button#mute-sound Mute sound
    
    main
      h3 Tracking board
      #tracking-board.board Tracking board
      h3 Your board
      #player-board.board Player
    */
}

function renderMainMenuState() {
    /*
        nav
          h3.game-title BATTLESHIPS

          button#start-game START GAME

          .rules-mute-btn
            button#rules-button Rules
            #rules.letter
              .letter-header
                h3 Friendly Country Naval Atlantic Fleet
                h3 Delta Battleship
                h3 April 26th, 1940
              .letter-body
                h4 Commander,
                p You are about to engage in a strategic naval battle against an enemy fleet, with the objective of sinking their ships before they can do the same to yours. The game you will be playing is called "Battleship," and the rules are as follows:
                ol
                  li Deployment: You will each command a fleet of ships, including aircraft carrier, battleship, cruiser, destroyer, and submarine. Your fleet will be secretly placed on a grid, with each ship occupying a specified number of squares.
                  li The Grid: The grid is divided into columns (0-9) and rows (0-9). Each square on the grid represents a position in the ocean where a ship can be placed.
                  li Placement Restrictions: Ships cannot overlap or touch each other, not even diagonally. Ships must be placed according to their dimensions, with aircraft carriers occupying five squares, battleships four squares, cruisers and submarines three squares, destroyers two squares each.
                  li The Battle Begins: You will take turns firing at your opponent's fleet. On your turn, you select a column and a row coordinate, attempting to guess the position of an enemy ship. Your opponent will then respond with a hit or a miss.
                  li Hits and Misses: If your shot lands on an enemy ship, it is considered a hit, and the ship is considered damaged. If all of a ship's hit points are exhausted, it is considered sunk. A miss indicates that your shot did not hit any enemy ships. You can't shoot the same coordinate twice.
                  li Identifying Ships: After a hit, your opponent will reveal the ship that was hit but not its exact position. You will then mark that ship on your board to keep track of it.
                  li Game Continues: After a hit or a miss, your turn continues with another shot. You may fire a shot during your turn, but once you have ended your turn, the enemy will have a chance to fire back.
                  li Sinking the Enemy Fleet: Your objective is to sink all of your opponent's ships. Once all of their ships have been sunk, you will win the battle and secured the victory for your nation.
                p Remember, Commander, success in this battle depends on your ability to outwit and outmaneuver your opponent. Use your knowledge of naval tactics, strategy, and the element of surprise to gain the upper hand and emerge victorious from this high-stakes engagement. 
                p Good luck, and may the best commander win!

            button#mute-sound Mute sound
    
        main
        */
}

module.exports = {renderBoard};