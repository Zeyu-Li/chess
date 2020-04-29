// pieces
class Pawn{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.original = coord
        if (color == 'w') {
            // TODO: find and locate the image
            this.image = null
        } else {
            this.image = null
        }
    }

    move(coord) {
        // TODO: test if move possible
        this.coord = coord
    }
}


function setup(board, color) {
    if (color == 'w') {
        row = 1
    } else {
        row = 7
    }
    let piece
    // all pawns
    for (let i = 0; i != 8; i++) {
        piece = new Pawn([i, row], color)
        board.push(piece)
    }
    // TODO: rooks, horses, bishops 
    piece = new Pawn([0, 2], color)
    board.push(piece)
}

function draw(board) {

}

// wait for page load
window.addEventListener('load', ()=>{

    let canvas = document.querySelector('canvas')
    let box = window.innerHeight * .70

    // canvas size
    canvas.width = box
    canvas.height = box

    let canvas_len = box
    var sq_len = canvas_len / 8

    let c = canvas.getContext('2d')
    const board = []

    // set up board
    let flag = true

    // Note, 0, 0 is the top left side

    for (let i = 0; i != 8; i++) {
        for (let j = 0; j != 8; j++){
            if (flag) {
                c.fillStyle = 'rgb(240, 182, 116)'
            } else {
                c.fillStyle = 'rgb(145, 97, 43)'
            }
            c.fillRect(j*sq_len, i*sq_len, sq_len, sq_len)
            // once at the end of the row, don't flip the color again
            if (j != 7){
                flag = !flag
            }
        }
    }

    setup(board, 'w')
    setup(board, 'b')

    console.log(board)

    draw(board)

})
