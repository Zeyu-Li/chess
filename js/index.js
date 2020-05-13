// global vars
let sq_len
let flip
let c
const board = []
let canvas

// if player true, then it is white's turn, else black
let player = true

// pieces
class Pawn{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.original = coord
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow0.svg"
        else
            this.image.src = "images/ob0.svg"
    }
}

class Rook{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.original = coord
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow1.svg"
        else
            this.image.src = "images/ob1.svg"
    }
}

class King{
    constructor(color) {
        this.color = color
        this.image = new Image()
        if (color == 'w'){
            this.coord = [3,0]
            this.original = [3,0]
            this.image.src = "images/ow5.svg"
        }
        else {
            this.coord = [3,7]
            this.original = [3,7]
            this.image.src = "images/ob5.svg"
        }
    }
}

class Queen{
    constructor(color) {
        this.color = color
        this.image = new Image()
        if (color == 'w'){
            this.coord = [4,0]
            this.image.src = "images/ow4.svg"
        }
        else {
            this.coord = [4,7]
            this.image.src = "images/ob4.svg"
        }
    }
}


class Bishop{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow3.svg"
        else
            this.image.src = "images/ob3.svg"
    }
}

class Knight{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow2.svg"
        else
            this.image.src = "images/ob2.svg"
    }
}
// end of the piece classes

function createBoard() {
    // set up square board and draws it

    // Note, 0, 0 is the top left side
    for (let i = 0; i != 8; i++) {
        for (let j = 0; j != 8; j++){
            if (flip) {
                c.fillStyle = 'rgb(240, 182, 116)'
            } else {
                c.fillStyle = 'rgb(145, 97, 43)'
            }
            c.fillRect(j*sq_len, i*sq_len, sq_len, sq_len)
            // once at the end of the row, don't flip the color again
            if (j != 7){
                flip = !flip
            }
        }
    }
}

function setup(color) {
    // inits pieces on the board

    let loc
    if (color === 'w') {
        loc = [[0, 0],[7,0],[1,0],[6,0],[2,0],[5,0],[3,0],[4,0]]
        row = 1
    } else {
        loc = [[0, 7],[7,7],[1,7],[6,7],[2,7],[5,7],[3,7],[4,7]]
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

function draw() {
    // from the board array, draw onto canvas
    board.forEach(element => {
        if (flip)
            c.drawImage(element.image, element.coord[0] * sq_len, element.coord[1]* sq_len, sq_len, sq_len)
        else
            c.drawImage(element.image, (7-element.coord[0]) * sq_len, (7-element.coord[1]) * sq_len, sq_len, sq_len)
    });
}

function check(piece) {
    // checks if piece is movable

    // inits (I think I can reduce)
    const current_coord = piece.coord
    let current
    let occupation
    let moveable = false

    if (piece instanceof Pawn) {
        // pawns
        let poss_moves = [[0,1], [1,1], [-1,1]]

        poss_moves.forEach(move=> {
            current = [...current_coord]
            current[0] += move[0]
            current[1] += move[1]

            // sandwich within 0 and 7 and if not, continue
            if (!(0 <= current[0] <= 7 && 0 <= current[1] <= 7)) {
                return
            }

            // returns occupation state of square
            occupation = checkSq(current)

            if (occupation == null && move[0] == 0) {
                // checks single move ahead
                displayMoves(current)
                moveable = true

                // if single move ahead possible, check to see if it is on the original square and 
                // the square two squares ahead is empty
                if (piece.coord == piece.original && checkSq([current[0],current[1]+1]) == null) {
                    displayMoves([current[0], current[1]+1])
                }
            }
            // if opposite color is capturable
            if ((occupation == 'b' && !flip && move[1] != 1) || (occupation == 'w' && flip && move[1] != 1)) {
                displayMoves(current)
                moveable = true
            }
        })
    } else if (piece instanceof Rook) {
        // rooks

        // TODO: check 4 directions
        current = [...current_coord]

        // traverse through the line until something (ie piece or edge of board is hit)
        for (let i = current_coord[0]; i != 0; i--) {
            occupation = checkSq([current[0]+i,current[1]])
        }
        
    }

    return moveable
}

function displayMoves(current) {
    // displays the move as a blue dot at current (10px radius)
    c.beginPath()
    if (flip) {
        c.arc((7-current[0])*sq_len+sq_len/2, current[1]*sq_len+sq_len/2, 10, 0, 2*Math.PI)
    } else {
        c.arc(current[0]*sq_len+sq_len/2, (7-current[1])*sq_len+sq_len/2, 10, 0, 2*Math.PI)
    }
    c.fillStyle = 'rgb(77, 132, 191)'
    c.fill()
}

function checkSq(current) {
    // for each piece on the board, compare the coords of the piece to the one we are looking for
    // if they match, return the color of that piece, else, it is an empty square
    board.forEach(piece => {
        if (piece.coord == current) {
            return piece.color
        }
    })
    return null
}

function collision() {
    // set when player collides with canvas

    // suddenly jQuery :|
    $('#canvas').mousedown((event)=>{
        // gets clicked coords
        let click = [7-parseInt((event.pageX-$('#canvas').offset().left)/sq_len), parseInt((event.pageY-$('#canvas').offset().top)/sq_len)]
        if (!flip) {
            click = [7-click[0],7-click[1]]
        }

        let piece = null
        let movable

        // selects right piece on the board, else if none, piece is set to nothing
        board.forEach(element=> {
            if (player) {
                color = 'w'
            } else {
                color = 'b'
            }
            // array objects cannot be directly compared
            if (color != element.color || click.toString() != element.coord.toString()) {
                return
            }
            piece = element
        })

        // if piece is selected, redraw board to clear previous possibles moves
        // and draw new possible moves
        if (piece != null) {
            // redraw
            createBoard()
            draw()

            // checks piece and displays moveable areas
            movable = check(piece)
            // if (movable) {
            //     displayMoves(piece)
            // }
        } else {
            return
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
    sq_len = canvas_len / 8

    // inits
    c = canvas.getContext('2d')

    // flips with checkbox
    flip = false

    // creates board and sets it up
    createBoard(flip)

    setup('w')
    setup('b')

    // debug board state
    // console.log(board)

    // draw the board
    draw(flip)

    // detects player collision on canvas
    collision()

})

// flip event listener
let checkbox = document.querySelector("input[name=checkbox]")
checkbox.addEventListener( 'change', ()=>{
    flip = !flip
    // redraw board
    createBoard()
    draw()
})
