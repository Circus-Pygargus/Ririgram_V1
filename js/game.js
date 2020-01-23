/*  ##########################
*  VARIABLES                #
* ######################## */

// Set to false if not in dev !!
var inDev = true;

/* HTML elements */
// game options area
var gameOptionsDiv = document.querySelector('#game-options');
var rowsNbInput = document.querySelector('#rows-nb');
var colsNbInput = document.querySelector('#cols-nb');
var colorHeadBgInput = document.querySelector('#color-head-bg');
var colorHeadfontInput = document.querySelector('#color-head-font');
var colorAnswerOriginInput = document.querySelector('#color-answer-origin');
var colorAnswerNoInput = document.querySelector('#color-answer-no');
var colorAnswerMaybeInput = document.querySelector('#color-answer-maybe');
var colorAnswerYesInput = document.querySelector('#color-answer-yes');
var backToDefault = document.querySelector('#back-to-default');
var newGameBtn = document.querySelector('#new-game');

// gameboard
var gameboardDiv = document.querySelector('#gameboard');

// victory area
var victoryDiv = document.querySelector('#victory');
var clicksNbSpan = document.querySelector('#clicks-nb');
var specialCongratsP = document.querySelector('#special-congrats');
var playAgainBtn = document.querySelector('#play-again');
var optionsLinkBtn = document.querySelector('#options-link');

// free place area
var freePlaceDiv = document.querySelector('#free-place-div');
var answerZeroBtn;
var answerNoBtn;
var answerMaybeBtn;
var answerMYesBtn;

// Created divs
var rowHeadDivs = [];
var tiles = [];

// default game options
var defaultGameOptions = {
    'nb-rows': '4',
    'nb-cols': '4',
    'color-head-bg': '#333333',
    'color-head-font': '#dddddd',
    'color-answer-origin': '#dddddd',
    'color-answer-no': '#333333',
    'color-answer-maybe': '#777999',
    // 'color-answer-yes': '#1dcf17'    // Nice flashy green
    'color-answer-yes': '#FF8800'
};

// Game options
var rowsNb;
var columnsNb;
var colorHeadBg;
var colorHeadFont;
var colorAnswerOrigin;
var colorAnswerNo;
var colorAnswerMaybe;
var colorAnswerYes;
// // object used to check or save game options locally

// comme ça ça marche pas :

var forLocalStorage = {
    'rowsNb': {
        'name': 'rows-nb',
        'variableJs': rowsNb
    },
    'columnsNb': {
        'name': 'column-nb',
        'variableJs': columnsNb
    },
    'headBg': {
        'name': 'color-head-bg',
        'variableJs': colorHeadBg
    },
    'headFont': {
        'name': 'color-head-font',
        'variableJs': colorHeadFont
    },
    'answerOrigin': {
        'name': 'color-answer-origin',
        'variableJs': colorAnswerOrigin
    },
    'answerNo': {
        'name': 'color-answer-no',
        'variableJs': colorAnswerNo
    },
    'answerMaybe': {
        'name': 'color-answer-maybe',
        'variableJs': colorAnswerMaybe
    },
    'answerYes': {
        'name': 'color-answer-yes',
        'variableJs': colorAnswerYes
    }
}

// comme ça ça fonctionne :

// var forLocalStorage = {
//     'rowsNb': {
//         'name': 'rows-nb',
//         'input': rowsNbInput
//     },
//     'columnsNb': {
//         'name': 'column-nb',
//         'input': colsNbInput
//     },
//     'headBg': {
//         'name': 'color-head-bg',
//         'input': colorHeadBgInput
//     },
//     'headFont': {
//         'name': 'color-head-font',
//         'input': colorHeadfontInput
//     },
//     'answerOrigin': {
//         'name': 'color-answer-origin',
//         'input': colorAnswerOriginInput
//     },
//     'answerNo': {
//         'name': 'color-answer-no',
//         'input': colorAnswerNoInput
//     },
//     'answerMaybe': {
//         'name': 'color-answer-maybe',
//         'input': colorAnswerMaybeInput
//     },
//     'answerYes': {
//         'name': 'color-answer-yes',
//         'input': colorAnswerYesInput
//     }
// }

// row and col heads font size
var rowHeadFontSize;
var colHeadFontSize;

// solution for this game
var rowsSolution = [];
var colsSolution = [];

// helpers for rows and cols displayed in rows and cols heads
var rowsHelpers = [];
var colsHelpers = [];

// results given by player
var colsResults = [];
var rowsResults = [];

// number of clicks on tiles needed to win
var clicksToWin;
// number of clicks made on tiles
var tilesClicksNb;

// current response choice when we click on a tile (yes, no, maybe or 0)
var LeftMouseBtnCurrentChoice;

// we need to know if we have begun to click a tile but haven't release the left button yet
var isClicking = false;


/*  ##########################
*  Event listeners          #
* ######################## */

// from option area
newGameBtn.addEventListener('click', function () {
    rowsNb = rowsNbInput.value;
    columnsNb = colsNbInput.value;
    colorHeadBg = colorHeadBgInput.value;
    colorHeadFont = colorHeadfontInput.value;
    colorAnswerOrigin = colorAnswerOriginInput.value;
    colorAnswerNo = colorAnswerNoInput.value;
    colorAnswerMaybe = colorAnswerMaybeInput.value;
    colorAnswerYes = colorAnswerYesInput.value;
    // Set local storage with game options
    setLocalStorage();
    // Set CSS variables according to game options
    setCssVariables();
    // we need some place to display the gameboard
    hideOptions();
    launchNewGame();
});

backToDefault.addEventListener('click', function () {
    SetOptionsBackToDefault();
});

// from victory area
playAgainBtn.addEventListener('click', function () {
    // prepare before launching another game
    hideVictory();
    launchNewGame();
});

// player wants to see/change game options
optionsLinkBtn.addEventListener('click', function () {
    victoryDiv.classList.add('hidden');
    gameboardDiv.innerHTML = '';
    gameboardDiv.classList.add('hidden');
    gameOptionsDiv.classList.remove('hidden');
});

// Disable right click context menu
document.addEventListener('contextmenu', function (event) {
    if (!inDev) {
        event.preventDefault();
    }
});



/*  ##########################
*  First when page loads    #
* ######################## */
// just for tests
// localStorage.clear();

// We first need to know if player alrready played and changed some options
CheckIfAlreadyPlayed();
// Set values in options page
setOptionsInputs();



/*  ##########################
*  Game Engine              #
* ######################## */

function launchNewGame () {

    // set/reset some variables for this game
    setGameVariables();

    // fill the game board with divs and fill tiles
    fillGameboard();

    // Get solution for cols and rows
    getRowsAndColsSolution();

    // Set row helpers 
    setRowHelpers();

    // Set col helpers 
    setColHelpers();

    // Display row helpers
    displayRowHelpers();

    // Display col helpers
    displayColHelpers();
}



/*  ##########################
*  FUNCTIONS                #
* ######################## */
    
/* Very first thing to do :
    Check if player has already played
    If yes, we have to load his custom options */
function CheckIfAlreadyPlayed () {

    if (!localStorage.getItem('nb-rows')) {
        rowsNb = defaultGameOptions['nb-rows'];    
    }
    else {
        rowsNb = localStorage.getItem('nb-rows');
    }

    if (!localStorage.getItem('nb-cols')) {
        columnsNb = defaultGameOptions['nb-cols']; 
    }
    else {
        columnsNb = localStorage.getItem('nb-cols');
    }

    if (!localStorage.getItem('color-head-bg')) {
        colorHeadBg = defaultGameOptions['color-head-bg']; 
    }
    else {
        colorHeadBg = localStorage.getItem('color-head-bg');
    }

    if (!localStorage.getItem('color-head-font')) {
        colorHeadFont = defaultGameOptions['color-head-font']; 
    }
    else {
        colorHeadFont = localStorage.getItem('color-head-font');
    }

    if (!localStorage.getItem('color-answer-origin')) {
        colorAnswerOrigin = defaultGameOptions['color-answer-origin']; 
    }
    else {
        colorAnswerOrigin = localStorage.getItem('color-answer-origin');
    }

    if (!localStorage.getItem('color-answer-no')) {
        colorAnswerNo = defaultGameOptions['color-answer-no']; 
    }
    else {
        colorAnswerNo = localStorage.getItem('color-answer-no');
    }

    if (!localStorage.getItem('color-answer-maybe')) {
        colorAnswerMaybe = defaultGameOptions['color-answer-maybe']; 
    }
    else {
        colorAnswerMaybe = localStorage.getItem('color-answer-maybe');
    }

    if (!localStorage.getItem('color-answer-yes')) {
        colorAnswerYes = defaultGameOptions['color-answer-yes']; 
    }
    else {
        colorAnswerYes = localStorage.getItem('color-answer-yes');
    }
}

// set colorInputs in options area
function setOptionsInputs () {
    rowsNbInput.value = rowsNb;
    colsNbInput.value = columnsNb;
    colorHeadBgInput.value = colorHeadBg;
    colorHeadfontInput.value = colorHeadFont;
    colorAnswerOriginInput.value = colorAnswerOrigin;
    colorAnswerNoInput.value = colorAnswerNo;
    colorAnswerMaybeInput.value = colorAnswerMaybe;
    colorAnswerYesInput.value = colorAnswerYes;
}

// set local storage
function setLocalStorage () {    

    // for(var k in validation_messages) {
    //     var o = validation_messages[k];
    //     do_something_with(o.your_name);
    //     do_something_else_with(o.your_msg);
    // }
    
    
    // for (var k in forLocalStorage) {
    //     var option = forLocalStorage[k];

        // comme ça ça marche pas :
        // console.log('name : ' + option.name);
        // console.log('variableJs : ' + option.variableJs);
        // localStorage.setItem(option.name, option.variableJs.value);

        //comme ça oui : bah non en fait :(   
        // console.log('name : ' + option.name);
        // console.log('name : ' + option.input.value);
        // localStorage.setItem(option.name, option.input.value);

        
        // console.log('item Set : ' + localStorage.getItem(option.name));
    // }
    localStorage.setItem('nb-rows', rowsNb);
    localStorage.setItem('nb-cols', columnsNb);
    localStorage.setItem('color-head-bg', colorHeadBg);
    localStorage.setItem('color-head-font', colorHeadFont);
    localStorage.setItem('color-answer-origin', colorAnswerOrigin);
    localStorage.setItem('color-answer-no', colorAnswerNo);
    localStorage.setItem('color-answer-maybe', colorAnswerMaybe);
    localStorage.setItem('color-answer-yes', colorAnswerYes);
}

// set CSS variables
function setCssVariables () {
    var root = document.documentElement;
    root.style.setProperty('--nb-rows', rowsNb);
    root.style.setProperty('--nb-cols', columnsNb);
    root.style.setProperty('--color-head-bg', colorHeadBg);
    root.style.setProperty('--color-head-font', colorHeadFont);
    root.style.setProperty('--color-answer-origin', colorAnswerOrigin);
    root.style.setProperty('--color-answer-no', colorAnswerNo);
    root.style.setProperty('--color-answer-maybe', colorAnswerMaybe);
    root.style.setProperty('--color-answer-yes', colorAnswerYes);
    // we need to set row and col heads font size
    if (rowsNb <= 10) {
        rowHeadFontSize = '32px';
    }
    else if (rowsNb > 10 && rowsNb <= 17) {
        rowHeadFontSize = '24px';
    }
    else if (rowsNb > 17 && rowsNb <= 24) {
        rowHeadFontSize = '16px';
    }
    else if (rowsNb > 25 && rowsNb <= 30) {
        rowHeadFontSize = '12px';
    }
    root.style.setProperty('--row-head-font-size', rowHeadFontSize);

    if (columnsNb <= 10) {
        colHeadFontSize = '32px';
    }
    else if (columnsNb > 10 && columnsNb <= 17) {
        colHeadFontSize = '24px';
    }
    else if (columnsNb > 17 && columnsNb <= 24) {
        colHeadFontSize = '16px';
    }
    else if (columnsNb > 25 && columnsNb <= 30) {
        colHeadFontSize = '12px';
    }
    root.style.setProperty('--col-head-font-size', colHeadFontSize);
}


// set some variables for this game
function setGameVariables () {
    // solution for this game
    rowsSolution = [];
    for (var i = 0; i < rowsNb; i++) {
        rowsSolution[i] = [];
    }
    colsSolution = [];
    for (var i = 0; i < columnsNb; i++) {
        colsSolution[i] = [];
    }
    
    // helpers for rows and cols displayed in rows and cols heads
    rowsHelpers = [];
    for (var i = 0; i < rowsNb; i++) {
        rowsHelpers[i] = [];
    }
    colsHelpers = [];
    for (var i = 0; i < columnsNb; i++) {
        colsHelpers[i] = [];
    }
    
    // results given by player
    colsResults = [];
    rowsResults = [];

    // nb of tiles to click
    clicksToWin = 0;
    // nb of tiles clicked
    tilesClicksNb = 0;

    // current response choice when we click on a tile (yes, no, maybe or 0)
    LeftMouseBtnCurrentChoice = "yes";
}

// Set all option back to default
function SetOptionsBackToDefault () {
    rowsNbInput.value               = defaultGameOptions['nb-rows'];
    colsNbInput.value               = defaultGameOptions['nb-cols'];
    colorHeadBgInput.value          = defaultGameOptions['color-head-bg'];
    colorHeadfontInput.value        = defaultGameOptions['color-head-font'];
    colorAnswerOriginInput.value    = defaultGameOptions['color-answer-origin'];
    colorAnswerNoInput.value        = defaultGameOptions['color-answer-no'];
    colorAnswerMaybeInput.value     = defaultGameOptions['color-answer-maybe'];
    colorAnswerYesInput.value       = defaultGameOptions['color-answer-yes'];
}

// hide victory area for another game
function hideVictory () {
    // hide victory area
    victoryDiv.classList.add('hidden');
    // empty gameboard so it's clean for next game
    gameboardDiv.innerHTML = '';
}

// we want to display the game board
function hideOptions () {
    // hide options area
    gameOptionsDiv.classList.add('hidden');
    // show gameboard
    gameboardDiv.classList.remove('hidden');
}


// choose the solution for this tile (should return no or yes)
function chooseTileSolution () {
    var myBool = Math.floor(Math.random() * Math.floor(2));
    var result = 'no';
    if (myBool) {
        // we're gonna need to click this tile
        clicksToWin++;
        result = 'yes';
    }
    return result;
}


// Player clicked on a answer choice button (yes, no or maybe)
function changeChoice (_choice) {
    switch(_choice) {
        case '0' :
            LeftMouseBtnCurrentChoice = "0";
            answerZeroBtn.classList.add('current-choice');
            answerNoBtn.classList.remove('current-choice');
            answerMaybeBtn.classList.remove('current-choice');
            answerYesBtn.classList.remove('current-choice');
            break;
        case 'no':
            LeftMouseBtnCurrentChoice = 'no';
            answerZeroBtn.classList.remove('current-choice');
            answerNoBtn.classList.add('current-choice');
            answerMaybeBtn.classList.remove('current-choice');
            answerYesBtn.classList.remove('current-choice');
            break;

        case 'maybe':
                LeftMouseBtnCurrentChoice = 'maybe';
                answerZeroBtn.classList.remove('current-choice');
                answerNoBtn.classList.remove('current-choice');
                answerMaybeBtn.classList.add('current-choice');
                answerYesBtn.classList.remove('current-choice');
            break;

        case 'yes':
                LeftMouseBtnCurrentChoice = 'yes';
                answerZeroBtn.classList.remove('current-choice');
                answerNoBtn.classList.remove('current-choice');
                answerMaybeBtn.classList.remove('current-choice');
                answerYesBtn.classList.add('current-choice');
            break;
    }
    // answerYesBtn.classList.add('current-choice');
    // LeftMouseBtnCurrentChoice = 'yes';
}


// fill the free space div (this div includes live options)
function fillFreeSpaceDiv (_tileDiv) {
    // add a new grid button
    var anotherGridBtn = document.createElement('div');
    anotherGridBtn.setAttribute("id", "another-grid");
    anotherGridBtn.innerHTML = 'Nouvelle grille';
    anotherGridBtn.addEventListener('click', function () {
        gameboardDiv.innerHTML = '';
        launchNewGame();
    });
    _tileDiv.appendChild(anotherGridBtn);

    // add a this grid again button
    var sameGridAgainBtn = document.createElement('div');
    sameGridAgainBtn.setAttribute("id", "same-grid-again");
    sameGridAgainBtn.innerHTML = 'Rejouer cette grille';
    sameGridAgainBtn.addEventListener('click', function () {
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].dataset.answer = '0';
        }
    });
    _tileDiv.appendChild(sameGridAgainBtn);

    // add a options link button
    var optionsBtn = document.createElement('div');
    optionsBtn.setAttribute("id", "options-btn");
    optionsBtn.innerHTML = 'Options';
    optionsBtn.addEventListener('click', function () {
        gameboardDiv.innerHTML = '';
        gameboardDiv.classList.add('hidden');
        gameOptionsDiv.classList.remove('hidden');
    });
    _tileDiv.appendChild(optionsBtn);

    // add a button to remove all 'maybe' choices
    var removeMaybeChoices = document.createElement('div');
    removeMaybeChoices.setAttribute("id", 'remove-maybe-choices');
    removeMaybeChoices.innerHTML = 'Retirer les Maybe';
    removeMaybeChoices.addEventListener('click', function () {
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].dataset.answer === 'maybe') {
                tiles[i].dataset.answer = '0';
            }
        }
    });
    _tileDiv.appendChild(removeMaybeChoices);

    // add 4 buttons (in a div) so we can choose an answer for a tile (yes, no, maybe or back to 0)
    var answerChoiceDiv = document.createElement('div');
    answerChoiceDiv.setAttribute("id", "answer-choice-div");

    var answerZeroBtn = document.createElement('div');
    answerZeroBtn.setAttribute("id", "answer-zero");
    answerZeroBtn. addEventListener('click', function () {
        changeChoice('0');
    });
    answerChoiceDiv.appendChild(answerZeroBtn);

    var answerNoBtn = document.createElement('div');
    answerNoBtn.setAttribute("id", "answer-no");
    answerNoBtn. addEventListener('click', function () {
        changeChoice('no');
    });
    answerChoiceDiv.appendChild(answerNoBtn);
    
    var answerMaybeBtn = document.createElement('div');
    answerMaybeBtn.setAttribute("id", "answer-maybe");
    answerMaybeBtn. addEventListener('click', function () {
        changeChoice('maybe');
    });
    answerChoiceDiv.appendChild(answerMaybeBtn);

    var answerYesBtn = document.createElement('div');
    answerYesBtn.setAttribute("id", "answer-yes");
    answerYesBtn.classList.add('current-choice');
    answerYesBtn. addEventListener('click', function () {
        changeChoice('yes');
    });
    answerChoiceDiv.appendChild(answerYesBtn);
    
    _tileDiv.appendChild(answerChoiceDiv);

    return _tileDiv;
}


// fill game board
function fillGameboard () {
    for (var row = 0; row <= rowsNb; row++) {
        // build a rowDiv
        var rowDiv = document.createElement('div');
        if (row !== 0) {
            rowDiv.classList.add('row-div');
        }
        else {
            // first line is for columns infos
            rowDiv.classList.add('head-div');
        }
        for (var column = 0; column <= columnsNb; column++) {
            // build a tile
            var tileDiv = document.createElement('div');
            if (column !== 0) {
                // it's a tile
                if (row !== 0) {
                    var awaitedAnswer;
                    tileDiv.classList.add('tile');
                    tileDiv.dataset.rowid = row - 1;
                    tileDiv.dataset.colid = column - 1;
                    awaitedAnswer = chooseTileSolution();
                    tileDiv.dataset.solution = awaitedAnswer;
                    tileDiv.dataset.answer = '0';
                    if (row%5 === 0 && row != rowsNb) {
                        tileDiv.style.borderBottomWidth = "3px";
                    }
                    tileDiv.addEventListener('mousedown', function (event) {
                        // Needed to get the good value of event.which on 'mouseenter'
                        window.btnClicked = event.which;
                        tileClicked(event);
                        isClicking = true;
                    });
                    window.addEventListener('mouseup', function () {
                        window.btnClicked = undefined;
                        isClicking = false;
                    });
                    tileDiv.addEventListener('mouseenter', function (event) {
                        if (isClicking) {
                            tileClicked(event);
                        }
                    });
                }
                // it's a col head
                else {
                    tileDiv.classList.add('col-head-div');
                    tileDiv.dataset.colid = column - 1;
                }
            }
            else {
                // it's a row head
                if (row !== 0) {
                    tileDiv.classList.add('row-head-div');
                    tileDiv.dataset.rowid = row - 1;
                    if (row%5 === 0 && row != rowsNb) {
                        tileDiv.style.borderBottomWidth = "3px";
                    }
                }
                // a free place to display options & infos
                else {
                    tileDiv.classList.add('free-place-div');
                    // too many thing to do to this div, let's use a function to fill it
                    tileDiv = fillFreeSpaceDiv(tileDiv);
                }
            }
            rowDiv.appendChild(tileDiv);
        }        
        gameboardDiv.appendChild(rowDiv);
    }      
    answerZeroBtn = document.querySelector('#answer-zero');
    answerNoBtn = document.querySelector('#answer-no');
    answerMaybeBtn = document.querySelector('#answer-maybe');
    answerYesBtn = document.querySelector('#answer-yes');
}


// get rows and cols  solution
function getRowsAndColsSolution () {
    tiles = document.querySelectorAll('.tile');
    var i;
    for (i = 0; i < tiles.length; i++) {
        var row = tiles[i].dataset.rowid;
        var col = tiles[i].dataset.colid;
        rowsSolution[row][col] = tiles[i].dataset.solution;
        colsSolution[col][row] = tiles[i].dataset.solution;
    }
}


// set helper for each row
function setRowHelpers () {
    for (var i = 0; i < rowsSolution.length; i++) {
        // helper value
        var helper = 0;
        for (var j = 0; j < rowsSolution[i].length; j++) {
            // this helper is good, store it
            if (rowsSolution[i][j] === 'no') {
                if (helper !== 0) {
                    rowsHelpers[i].push(helper);
                    helper = 0;
                }
            }
            // increase helper
            else {
                helper++;
            }

            // end of row
            if (j === (rowsSolution[i].length - 1)) {
                if (helper !== 0) {
                    rowsHelpers[i].push(helper);
                    helper = 0;
                }
            }
        }
    }
}


// set helper for each col
function setColHelpers () {
    for (var i = 0; i < colsSolution.length; i++) {
        // helper value
        var helper = 0;
        for (var j = 0; j < colsSolution[i].length; j++) {
            // this helper is good, store it
            if (colsSolution[i][j] === 'no') {
                if (helper !== 0) {
                    colsHelpers[i].push(helper);
                    helper = 0;
                }
            }
            // increase helper
            else {
                helper++;
            }

            // end of col
            if (j === (colsSolution[i].length - 1)) {
                if (helper !== 0) {
                    colsHelpers[i].push(helper);
                    helper = 0;
                }
            }
        }
    }
}


// Display row helpers
function displayRowHelpers () {
    rowHeadDivs = document.querySelectorAll('.row-head-div');
    for (var i = 0; i < rowHeadDivs.length; i++) {
        var rowId = rowHeadDivs[i].dataset.rowid;
        for (var j = 0; j < rowsHelpers[rowId].length; j++) {
            // value to display
            var thisHelper = rowsHelpers[rowId][j];
            // create and fill helper
            var helperDiv = document.createElement('div');
            helperDiv.classList.add('helper');
            helperDiv.style.fontSize = rowHeadFontSize;
            helperDiv.innerHTML = thisHelper;
            rowHeadDivs[i].appendChild(helperDiv);
        }
    }
}


// Display col helpers
function displayColHelpers () {
    colHeadDivs = document.querySelectorAll('.col-head-div');
    for (var i = 0; i < colHeadDivs.length; i++) {
        var colId = colHeadDivs[i].dataset.colid;
        for (var j = 0; j < colsHelpers[colId].length; j++) {
            // value to display
            var thisHelper = colsHelpers[colId][j];
            // create and fill helper
            var helperDiv = document.createElement('div');
            helperDiv.classList.add('helper');
            helperDiv.style.fontSize = colHeadFontSize;
            helperDiv.innerHTML = thisHelper;
            colHeadDivs[i].appendChild(helperDiv);
        }
    }
}


// trying to know if player wins
function checkCompleteGrid () {
    var i;
    var victory = true;
    for (i = 0; i < tiles.length; i++) {
        if (tiles[i].dataset.answer !== tiles[i].dataset.solution) {
            if (tiles[i].dataset.answer === 'maybe' && tiles[i].dataset.solution === 'yes') {
                continue;
            }
            else if (tiles[i].dataset.answer === '0' && tiles[i].dataset.solution === 'no') {
                continue;
            }
            victory = false;
        }
    }
    if (victory) {
        victoryDiv.classList.remove('hidden');
        if (tilesClicksNb != 1) {
            clicksNbSpan.innerHTML = tilesClicksNb + ' coups';
        }
        else {
            clicksNbSpan.innerHTML = tilesClicksNb + ' coup';
        }
        if (tilesClicksNb === clicksToWin) {
            specialCongratsP.classList.remove('hidden');
        }
        else {
            specialCongratsP.classList.add('hidden');
        }
    }
}


// player clicked a tile, check his row and col results to apply to helpers
function checkRowAndCol (_tile)  {
    // rowId = _tile.dataset.rowid;
    // colId = _tile.dataset.colid;

    checkCompleteGrid();
}


// a tile was clicked
function tileClicked (_event) {
    var tile = _event.target;
    // var mouseBtnClicked = _event.which;
    var mouseBtnClicked = window.btnClicked;
    var currentChoice = LeftMouseBtnCurrentChoice;
    if (!inDev) {
        switch (mouseBtnClicked) {
            // player right clicked
            case 3:
                currentChoice = 'no';
                break;
            // middle mouse button
            case 2:
                currentChoice = 'maybe';
                break;
            // should be '1' : left button
            default :
                currentChoice = LeftMouseBtnCurrentChoice;
        }
    }
    // we want to remove current choice
    if (tile.dataset.answer === currentChoice) {
        if (!isClicking) {
            tile.dataset.answer = '0';
            tilesClicksNb++;
        }
    }
    // we want to apply our choice
    else {

        /* We don't increment the number of tiles clicked if player wants to tag a tile with 'no'
            but we will if his had already taged this tile with 'no' */
        if (currentChoice !== 'no') {
            tilesClicksNb++;
        }
        else if (currentChoice === 'no' && tile.dataset.answer !== "0") {
            tilesClicksNb++;
        }
        tile.dataset.answer = currentChoice;
    }

    checkRowAndCol(tile);
}