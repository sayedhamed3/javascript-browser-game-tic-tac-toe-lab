/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const images = {
    X: "./images/sword.png",
    O: "./images/shield.png",
}

/*---------------------------- Variables (state) ----------------------------*/
let board
let turn
let winner
let tie
let gameMode = "pvp"


/*------------------------ Cached Element References ------------------------*/

const squareEls = document.querySelectorAll(".sqr")
const messageEl = document.querySelector("#message")
const resetEl = document.querySelector("#reset")
const gameModeEl = document.querySelector("#game-mode")
const boardEl = document.querySelector(".board")
const bannerEl = document.querySelector("#banner")
const bannerMessageEl = document.querySelector("#banner-message")
const bannerCloseBtn = document.querySelector("#close-banner")

/*-------------------------------- Functions --------------------------------*/



function init() {
    board = ["", "", "", "", "", "", "", "", ""]
    turn = "X"
    winner = false
    tie = false
    squareEls.forEach(square => {
        square.innerHTML = ""
    });
    bannerEl.style.display = "none"
    render()
}

function render() {
    updateMessage()
}

function updateMessage() {
    if (!winner && !tie && gameMode == "pvp") {
        messageEl.textContent = `${turn}'s turn`;
    } else if (!winner && !tie) {
        messageEl.textContent = turn == "X" ? "X's turn" : "CPU's turn";
    } else if (!winner && tie) {
        messageEl.textContent = "It's a tie!";
        bannerMessageEl.textContent = "It's a tie!"
        bannerEl.style.display = "block"
        bannerEl.style.backgroundColor = "rgba(200, 200, 200, 0.8)"
    } else {
        if (gameMode == "pvp") {
            bannerMessageEl.textContent = `${turn} wins, congrats!`
            bannerEl.style.display = "block"
            bannerEl.style.backgroundColor = "rgba(0, 128, 0, 0.8)"
        } else if (turn == "X") {
            bannerMessageEl.textContent = "You win, congrats!"
            bannerEl.style.display = "block"
            bannerEl.style.backgroundColor = "rgba(0, 128, 0, 0.8)"

        } else {
            setTimeout(() => {
                bannerMessageEl.textContent = "CPU wins, better luck next time!"
                bannerEl.style.display = "block"
                bannerEl.style.backgroundColor = "rgba(180, 0, 0, 0.8)"
            }, 650)
        }
    }
}



function handleClick() {
    squareIndex = event.target.id
    if (board[squareIndex] == "X" || board[squareIndex] == "O") {
        return
    } else if (winner) {
        return
    }
    placePiece(squareIndex)
    checkForWinner()
    checkForTie()

    if (gameMode == "pvp") {
        handlePvp()
    } else {
        handleCPU()
    }

    render()
}

function handlePvp() {
    switchPlayerTurn()
}

function handleCPU() {
    if (tie || winner) {
        return
    }

    squareEls.forEach(square => {
        square.classList.add("no-click")

    });
    boardEl.classList.add("wait")

    switchPlayerTurn()
    let move = gameMode == "cpu-easy" ? getRandomMove() : getCalculatedMove()

    setTimeout(() => {
        placePiece(move)
        checkForWinner()
        checkForTie()
        switchPlayerTurn()
        render()
        squareEls.forEach(square => {
            square.classList.remove("no-click")
        });
        boardEl.classList.remove("wait")
    }, 500)

}

function getCalculatedMove() {

    // try to win
    for (let index = 0; index < board.length; index++) {
        if (board[index] === "") {
            board[index] = turn
            checkForWinner()
            board[index] = ""
            if (winner) {
                return index
            }

        }
    }

    // try to block
    const opp = turn === "X" ? "O" : "X"
    for (let index = 0; index < board.length; index++) {
        if (board[index] === "") {
            board[index] = opp
            checkForWinner()

            if (winner) {
                winner = false
                board[index] = ""
                return index
            }
            board[index] = ""

        }
    }
    
    // check middle empty
    if (board[4] == "") {
        return 4
    }
    let corners = [[0, 8], [2, 6]]


    // check opp corners
    for (let index = 0; index < corners.length; index++) {
        const twoCorners = corners[index];
        const opp = turn === "X" ? "O" : "X"
        if (board[twoCorners[0]] == opp && board[[twoCorners[1]]] == opp) {
            let available = [1, 3, 5, 7]
            let i = Math.floor(Math.random() * 4)
            while (board[available[i]] != "") {
                i = Math.floor(Math.random() * 4)
            }
            return available[i]
        }

    }

    // get random move 
    return getRandomMove()
}

const tryToWin = () => {

}



function getRandomMove() {
    let easy = Math.floor(Math.random() * 9)
    while (board[easy] != "") {
        easy = Math.floor(Math.random() * 9)
    }
    return easy
}

function placePiece(index) {
    board[index] = turn
    const img = document.createElement("img");
    img.src = images[board[index]];
    img.alt = board[index];
    squareEls[index].appendChild(img)
}

function checkForWinner() {

    winner = false

    winningCombos.forEach(combo => {
        if (board[combo[0]] && board[combo[0]] == board[combo[1]] && board[combo[0]] == board[combo[2]]) {
            winner = true
            return
        }
    })
}

function checkForTie() {
    if (winner) {
        return
    }

    tie = board.includes('') ? false : true
}

function switchPlayerTurn() {
    if (winner) {
        return
    }

    turn = turn === "X" ? "O" : "X"

}

function reset() {
    init()
}

/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(square => {
    square.addEventListener("click", (event) => handleClick())
});

resetEl.addEventListener("click", reset)

gameModeEl.addEventListener("change", (event) => {
    gameMode = event.target.value
    reset()
})

bannerCloseBtn.addEventListener("click", () =>
    bannerEl.style.display = "none")


/*----------------------------- Run  -----------------------------*/
init()