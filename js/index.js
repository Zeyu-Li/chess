// import from pieces module located in the same dir
import {Pawn, Rook, Knight, Bishop, Queen, King} from './pieces.js'

// global vars
// sqLen = length of each individual square
let sqLen

// canvas is the canvas element in DOM 
// and c is the 2D context of the canvas
let canvas, c

// board contains all the pieces
const board = []

// flip is a bool with true being white on your (closer)
// side and black on the other side
let flip = false

// if player true, then it is white's turn, else black
let player = true
let movable = []

// castle 
let castle = false
let movingRook
let queenSide = false

function setup(color) {
    // inits pieces on the board

    let loc, row
    if (color === 'w') {
        loc = [[0, 0],[7,0],[1,0],[6,0],[2,0],[5,0]]
        row = 1
    } else {
        loc = [[0, 7],[7,7],[1,7],[6,7],[2,7],[5,7]]
        row = 6
    }
    let piece
    // pawns
    for (let i = 0; i != 8; i++) {
        piece = new Pawn([i, row], color)
        board.push(piece)
    }
    // rooks, horses, bishops
    for (let i = 0; i != 2; i++) {
        piece = new Rook(loc[i], color)
        board.push(piece)
        piece = new Knight(loc[i+2], color)
        board.push(piece)
        piece = new Bishop(loc[i+4], color)
        board.push(piece)
    }
    // King and queen
    piece = new King(color)
    board.push(piece)
    piece = new Queen(color)
    board.push(piece)
}

function check(piece) {
    // checks if piece is movable

    // inits (I think I can reduce)
    const current_coords = piece.coords
    let current
    let occupation
    let moveable = []
    let next_sq = {
        x: 0,
        y: 0
    }

    if (piece instanceof Pawn) {
        // pawns
        let poss_p_m = [[0,1], [1,1], [-1,1]]

        poss_p_m.forEach(move=> {
            current = [...current_coords]
            if (player) {
                current[0] += move[0]
                current[1] += move[1]
            } else {
                current[0] -= move[0]
                current[1] -= move[1]
            }

            // sandwich within 0 and 7 and if not, continue
            if (!(0 <= current[0] <= 7 && 0 <= current[1] <= 7)) {
                return
            }

            // returns occupation state of square
            occupation = checkSq(current)

            if (occupation == null && move[0] == 0) {
                // checks single move ahead
                displayMoves(current)
                moveable.push(Object.values(current))

                // if single move ahead possible, check to see if it is on the original square and 
                // the square two squares ahead is empty
                if (player) {
                    if (piece.coords == piece.original && checkSq([current[0],current[1]+1]) == null) {
                        displayMoves([current[0], current[1]+1])
                        moveable.push(Object.values([current[0], current[1]+1]))
                    }
                } else {
                    if (piece.coords == piece.original && checkSq([current[0],current[1]-1]) == null) {
                        displayMoves([current[0], current[1]-1])
                        moveable.push(Object.values([current[0], current[1]-1]))
                    }
                }
            }
            // if opposite color is capturable
            if (occupation == !player && move[0] != 0) {
                displayMoves(current)
                moveable.push(Object.values(current))
            }
            // TODO: en passant?
        })
    } else if (piece instanceof Rook) {
        // rooks

        // check 4 directions
        // TODO: more efficient way
        current = [...current_coords]

        // traverse through the line until something (ie piece or edge of board) is hit
        for (let i = current_coords[0]+1; i <= 7; i++) {
            next_sq.x = i
            next_sq.y = current[1]
            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[1]+1; i <= 7 ; i++) {
            next_sq.x = current[0]
            next_sq.y = i
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[0]-1; i >= 0; i--) {
            next_sq.x = i
            next_sq.y = current[1]
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[1]-1; i >= 0 ; i--) {
            next_sq.x = current[0]
            next_sq.y = i
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
    } else if (piece instanceof Knight) {
        // knight
        let poss_n_m = [[1,2], [2,1], [2,-1],[1,-2], [-1,-2],[-2,-1],[-2,1],[-1,2]]

        poss_n_m.forEach(move=> {
            current = [...current_coords]
            current[0] += move[0]
            current[1] += move[1]

            // sandwich within 0 and 7 and if not, continue
            if (!(0 <= current[0] <= 7 && 0 <= current[1] <= 7)) {
                return
            }

            // returns occupation state of square
            occupation = checkSq(current)

            if (occupation == null || occupation == !player) {
                // checks single move ahead
                displayMoves(current)
                moveable.push(current)
            }
        })
    } else if (piece instanceof Bishop) {
        // bishop

        // check 4 directions
        current = [...current_coords]

        // traverse through the line until something (ie piece or edge of board) is hit
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] + i
            next_sq.y = current[1] + i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] - i
            next_sq.y = current[1] - i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] - i
            next_sq.y = current[1] + i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] + i
            next_sq.y = current[1] - i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
    } else if (piece instanceof Queen) {
        // queen
        
        // check 4 directions
        current = [...current_coords]

        // traverse through the line until something (ie piece or edge of board) is hit
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] + i
            next_sq.y = current[1] + i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] - i
            next_sq.y = current[1] - i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] - i
            next_sq.y = current[1] + i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = 1; i <= 7; i++) {
            next_sq.x = current[0] + i
            next_sq.y = current[1] - i

            // if it falls outside of the board, break out
            if (!( 0 <= next_sq.x <= 7 || 0 <= next_sq.y <= 7)) {
                break
            }

            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        // traverse through the line until something (ie piece or edge of board) is hit
        for (let i = current_coords[0]+1; i <= 7; i++) {
            next_sq.x = i
            next_sq.y = current[1]
            occupation = checkSq(next_sq)
            // if occupation equals the opposite of player color, 
            // you can capture that piece, but no more afterwards
            // else if empty, continue, otherwise, it is the same colored piece, so stop
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[1]+1; i <= 7 ; i++) {
            next_sq.x = current[0]
            next_sq.y = i
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[0]-1; i >= 0; i--) {
            next_sq.x = i
            next_sq.y = current[1]
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
        for (let i = current_coords[1]-1; i >= 0 ; i--) {
            next_sq.x = current[0]
            next_sq.y = i
            occupation = checkSq(next_sq)
            if (occupation == !player) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
                break
            } else if (occupation == null) {
                displayMoves(Object.values(next_sq))
                moveable.push(Object.values(next_sq))
            } else {
                break
            }
        }
    } else if (piece instanceof King) {
        let poss_k_m = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]

        poss_k_m.forEach(move=> {
            current = [...current_coords]
            current[0] += move[0]
            current[1] += move[1]

            // sandwich within 0 and 7 and if not, continue
            if (!(0 <= current[0] <= 7 && 0 <= current[1] <= 7)) {
                return
            }

            // returns occupation state of square
            occupation = checkSq(current)

            if (occupation == null || occupation == !player) {
                // checks single move ahead
                displayMoves(current)
                moveable.push(Object.values(current))
            }
        })
        // castle
        if (piece.coords.toString() == piece.original.toString()) {
            // check if rook in the right spot
            // king side
            if (player) {
                if (checkSq([1,0]) == null && checkSq([2,0]) == null && checkRook([0,0], 'w')) {
                    if (flip) {
                        movingRook = [7,7]
                    } else
                        movingRook = [0,0]
                    displayMoves([1,0])
                    moveable.push([1,0])
                    castle = true
                }
            } else {
                if (checkSq([1,7]) == null && checkSq([2,7]) == null && checkRook([0,7], 'b')) {
                    if (flip) {
                        movingRook = [7,0]
                    } else
                        movingRook = [0,7]
                    displayMoves([1,7])
                    moveable.push([1,7])
                    castle = true
                }
            }
            // Queen side
            if (player) {
                // white side first
                if (checkSq([6,0]) == null && checkSq([5,0]) == null && checkSq([4,0]) == null && checkRook([7,0], 'w')) {
                    if (flip) {
                        movingRook = [0,7]
                    } else
                        movingRook = [7,0]
                    displayMoves([5,0])
                    moveable.push([5,0])
                    castle = true
                    queenSide = true
                }
            } else {
                if (checkSq([6,7]) == null && checkSq([5,7]) == null && checkSq([4,7]) == null && checkRook([7,7], 'b')) {
                    if (flip) {
                        movingRook = [0,0]
                    } else
                        movingRook = [7,7]
                    displayMoves([5,7])
                    moveable.push([5,7])
                    castle = true
                    queenSide = true
                }
            }
        }

    }

    if (moveable.length == 0) {
        return []
    }
    return moveable
}

function drawBoard() {
    // set up square board and draws it
    // if color true, square is white and since flipping has no impact, 
    // the first square will always be white
    let color = true

    // Note, 0, 0 is the top left side
    for (let i = 0; i != 8; i++) {
        for (let j = 0; j != 8; j++){
            if (color) {
                c.fillStyle = 'rgb(240, 182, 116)'
            } else {
                c.fillStyle = 'rgb(145, 97, 43)'
            }
            c.fillRect(j*sqLen, i*sqLen, sqLen, sqLen)
            // once at the end of the row, don't flip the color again
            if (j != 7){
                color = !color
            }
        }
    }
}

function drawPieces() {
    // from the board array, draw onto canvas
    board.forEach(element => {
        c.drawImage(element.image, element.display[0] * sqLen, element.display[1] * sqLen, sqLen, sqLen)
    });
}

function checkSq(current) {
    let color = null
    // for each piece on the board, compare the coords of the piece to the one we are looking for
    // if they match, return the color of that piece, else, it is an empty square
    board.forEach(piece => {
        if (piece.coords.toString() == Object.values(current).toString()) {
            if (piece.color == 'w') {
                color = true
            } else {
                color = false
            }
        }
    })
    return color
}

function checkRook(square, color) {
    let rook = false
    // for each piece on the board, compare the coords of the piece to the one we are looking for
    // if they match, return the color of that piece, else, it is an empty square
    board.forEach(piece => {
        if (piece.coords.toString() == square.toString() && piece.color == color && piece instanceof Rook) {
            rook = true
        }
    })
    return rook
}

function checkCoords(possible_m, coord) {
    let collide = false
    if (flip) {
        coord = [7-coord[0], 7-coord[1]]
    }
    // for each piece on the board, compare the coords of the piece to the one we are looking for
    // if they match, return the color of that piece, else, it is an empty square
    possible_m.forEach(location => {
        if (location.toString() == Object.values(coord).toString()) {
            collide = true
        }
    })
    return collide
}

function displayMoves(current) {
    // displays the move as a blue dot at current (10px radius)
    c.beginPath()
    if (flip) {
        c.arc((7-current[0])*sqLen+sqLen/2, (7-current[1])*sqLen+sqLen/2, 10, 0, 2*Math.PI)
    } else {
        c.arc(current[0]*sqLen+sqLen/2, current[1]*sqLen+sqLen/2, 10, 0, 2*Math.PI)
    }
    c.fillStyle = 'rgba(77, 132, 191, .5)'
    c.fill()
}

function move(piece, target) {
    let newPiece, colour, remove = null
    let tag = true
    board.forEach((element, index) => {
        // removes pieces if overlap
        if (target.toString() == element.display.toString()) {
            board.splice(index, 1)
        }
        if (piece.display.toString() == element.display.toString()) {
            // moves them
            if (flip){
                element.coords = [7-target[0],7-target[1]]
            }
            else{
                element.coords = target
            }
            // promotes pawn
            if (piece instanceof Pawn && (target[1]==7 || target[1]==0) && tag) {
                tag = false
                if (player) {
                    colour = 'w'
                } else {
                    colour = 'b'
                }
                newPiece = new Queen(colour, target, flip)
                remove = target
            }
            element.display = target
        }
        // castling
        if (castle && element instanceof Rook) {
            if (element.display.toString() == movingRook.toString()) {
                if (flip) {
                    if (queenSide == true)
                        movingRook = [movingRook[0]+3,movingRook[1]]
                    else
                        movingRook = [movingRook[0]-2,movingRook[1]]
                } else {
                    if (queenSide == true)
                        movingRook = [movingRook[0]-3,movingRook[1]]
                    else
                        movingRook = [movingRook[0]+2,movingRook[1]]
                }
                element.display = movingRook
                if (flip){
                    element.coords = [7-movingRook[0],7-movingRook[1]]
                }
                else{
                    element.coords = movingRook
                }
                castle = false
            }
        }
    })
    // removes promoted pawn
    if (remove != null) {
        board.forEach((element, index) => {
            if (element instanceof Pawn && (element.display.toString() == remove.toString())) {
                board.splice(index, 1)
            }
        })
        board.push(newPiece)
        remove = null
    }
}

function collision() {
    // set when player collides with canvas

    let piece
    // suddenly jQuery :|
    $('#canvas').mousedown((event)=>{
        // gets clicked coords
        let click = [parseInt((event.pageX-$('#canvas').offset().left)/sqLen), parseInt((event.pageY-$('#canvas').offset().top)/sqLen)]

        let color

        if (movable.length == 0){
            // selects right piece on the board, else if none, piece is set to nothing
            board.forEach(element=> {
                if (player) {
                    color = 'w'
                } else {
                    color = 'b'
                }
                // array objects cannot be directly compared
                if (color == element.color && (click.toString() == element.display.toString())) {
                    piece = element
                }
            })

            // if piece is selected, redraw board to clear previous possibles moves
            // and draw new possible moves
            if (piece != null) {
                // redraw
                drawBoard()
                drawPieces()

                // checks piece and displays moveable areas
                movable = check(piece)
            } else {
                return
            }
        } else if (checkCoords(movable, click)) {
            // move pieces
            // console.log("Moveable")

            // changes board
            move(piece, click)
            piece = null

            player = !player
            // redraw
            drawBoard()
            drawPieces()
            movable = []
        } else {
            // selects right piece on the board, else if none, piece is set to nothing
            board.forEach(element=> {
                if (player) {
                    color = 'w'
                } else {
                    color = 'b'
                }
                // array objects cannot be directly compared
                if (color == element.color && (click.toString() == element.display.toString())) {
                    piece = element
                }
            })

            // redraw
            drawBoard()
            drawPieces()
            // if piece is selected, redraw board to clear previous possibles moves
            // and draw new possible moves
            if (piece != null) {
                // checks piece and displays moveable areas
                movable = check(piece)
            } else {
                // reset
                movable = []
            }
        }
    })
}


// wait for page load
window.addEventListener('load', ()=>{
    // create canvas and resize it
    canvas = document.querySelector('canvas')
    let box = window.innerHeight * .70

    // canvas resize
    canvas.width = box
    canvas.height = box

    // canvas size to square length
    let canvas_len = box
    sqLen = canvas_len / 8

    // inits
    c = canvas.getContext('2d')
    setup('w')
    setup('b')

    // debug board state
    // console.log(board)

    // flips canvas
    flipper()

    // creates board and sets it up
    drawBoard()

    // draw the board
    drawPieces()

    // detects player collision on canvas
    collision()

})

function flipper() {
    // everytime a flip event happens
    flip = !flip
    board.forEach(piece=>{
        piece.display = [7-piece.display[0],7-piece.display[1]]
    })
}

// flip event listener for when checkbox is checked
let checkbox = document.querySelector("input[name=checkbox]")
checkbox.addEventListener( 'change', ()=>{
    // flips board
    flipper()

    // redraws board and pieces
    drawBoard()
    drawPieces()
})

// click help
$('.help').click(()=>{
    $('.help-popup').toggle()
})
