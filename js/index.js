// wait for page load
window.addEventListener('load', ()=>{

    let canvas = document.querySelector('canvas')

    // canvas size
    canvas.width = window.innerHeight * .70
    canvas.height = window.innerHeight * .70

    let canvas_len = window.innerHeight * .70
    let sq_len = canvas_len / 8

    let c = canvas.getContext('2d')
    
    let flag = true

    for (let i = 0; i != 8; i++) {
        for (let j = 0; j != 8; j++){
            if (flag) {
                c.fillStyle = 'rgb(240, 182, 116)'
            } else {
                c.fillStyle = 'rgb(145, 97, 43)'
            }
            c.fillRect(j*sq_len, i*sq_len, sq_len, sq_len)

            if (j != 7){
                flag = !flag
            }
        }
    }

})