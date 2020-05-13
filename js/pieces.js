// pieces
class Pawn{
    // piece are inits with an array of coords (x, y), 
    // followed by the color of the piece
    constructor(coords, color) {
        this.color = color
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow0.svg"
        else
            this.image.src = "images/ob0.svg"

        this.coords = coords
        this.original = coords
        this.display = coords
    }
}

class Rook{
    constructor(coords, color) {
        this.color = color
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow1.svg"
        else
            this.image.src = "images/ob1.svg"

        this.coords = coords
        this.original = coords
        this.display = coords
    }
}

class Knight{
    constructor(coords, color) {
        this.color = color
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow2.svg"
        else
            this.image.src = "images/ob2.svg"

        this.coords = coords
        this.original = coords
        this.display = coords
    }
}

class Bishop{
    constructor(coords, color) {
        this.color = color
        this.image = new Image()
        if (color == 'w')
            this.image.src = "images/ow3.svg"
        else
            this.image.src = "images/ob3.svg"

        this.coords = coords
        this.original = coords
        this.display = coords
    }
}

class Queen{
    constructor(color) {
        this.color = color
        this.image = new Image()
        if (color == 'w'){
            this.image.src = "images/ow4.svg"
            this.coords = [4,0]
            this.display = [4,0]
        }
        else {
            this.image.src = "images/ob4.svg"
            this.coords = [4,7]
            this.display = [4,7]
        }
    }
}

class King{
    constructor(color) {
        this.color = color
        this.image = new Image()
        if (color == 'w'){
            this.image.src = "images/ow5.svg"
            this.coords = [3,0]
            this.original = [3,0]
            this.display = [3,0]
        }
        else {
            this.image.src = "images/ob5.svg"
            this.coords = [3,7]
            this.original = [3,7]
            this.display = [3,7]
        }
    }
}
// end of the piece classes

// exports
export {Pawn, Rook, Knight, Bishop, Queen, King}
