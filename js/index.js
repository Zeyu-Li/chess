// global vars
let sq_len

// pieces
class Pawn{
    constructor(coord, color) {
        this.color = color
        this.coord = coord
        this.original = coord
        this.image = new Image()
        if (color == 'w')
            this.image.src = "../images/ow0.svg"
        else
            this.image.src = "../images/ob0.svg"
    }
}


function setup(board, color) {
    if (color === 'w') {
        row = 1
    } else {
        row = 6
    }
    let piece
    // all pawns
    for (let i = 0; i != 8; i++) {
        piece = new Pawn([i, row], color)
        board.push(piece)
    }
    // TODO: rooks, horses, bishops 
    // piece = new Pawn([0, 2], color)
    // board.push(piece)
}

function draw(board, c) {
    board.forEach(element => {
        c.drawImage(element.image, element.coord[0] * sq_len, element.coord[1]* sq_len, sq_len, sq_len)
    });
}

// wait for page load
window.addEventListener('load', ()=>{
    // create pieces



    let canvas = document.querySelector('canvas')
    let box = window.innerHeight * .70

    // canvas size
    canvas.width = box
    canvas.height = box

    let canvas_len = box
    sq_len = canvas_len / 8

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

    draw(board, c)

})
