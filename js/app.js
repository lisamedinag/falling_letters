const fallingLetters = {
    title: "Falling Letters",
    author: "Lisa Medina",
    version: "1.0.0",
    desciption: "A falling letters game",

    canvasDOM: undefined,
    ctx: undefined,
    canvasSize: { width: undefined, height: undefined },
    framesCounter: 0,
    frames: 60,
    intervalId: undefined,

    currentLetters: [],
    fallenLetters: [],
    selectedLetters: [],

    score: 0,
    fallenScore: 0,



    init() {
        this.setContext()
        this.setDimensions()
        this.setListeners()
        this.start()
    },

    setContext() {
        this.canvasDOM = document.querySelector("#myCanvas");
        this.ctx = this.canvasDOM.getContext("2d")
    },

    setDimensions() {
        this.canvasSize.width = window.innerWidth;
        this.canvasSize.height = window.innerHeight;

        this.canvasDOM.setAttribute("width", this.canvasSize.width);
        this.canvasDOM.setAttribute("height", this.canvasSize.height)
    },


    start() {
        this.intervalId = setInterval(() => {
            this.framesCounter++

            // if (this.framesCounter > 2000) {
            //     this.framesCounter = 0
            // }

            if (this.framesCounter % 100 === 0) {
                this.createLetters()
            }

            this.clearScreen()
            this.drawAll()
            this.moveLetters()
            this.setBoundaries()
            this.fallenCounter()

            this.fallenScore > 20 ? this.gameOver() : null

        }, 1000 / this.frames)
    },

    createLetters() {
        this.currentLetters.push(new Letter(this.ctx, this.randomXPosition(), 10, this.randomSize(), this.randomSize(), 2, this.randomLetter(), this.randomColor()))
    },

    randomXPosition() {
        let min = 30
        let max = this.canvasSize.width - 50
        let randomXPosition = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomXPosition;
    },

    randomSize() {
        let min = 30
        let max = 100
        let randomSize = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomSize;
    },

    randomColor() {
        let colors = ["red", "blue", "green", "yellow", "black", "pink", "purple", "orange", "gray"]
        let randomColorIndex = Math.floor(Math.random() * (colors.length));
        return colors[randomColorIndex];
    },

    randomLetter() {
        let letters = ["a", "b", "c", "d", "e"]
        let randomLetterIndex = Math.floor(Math.random() * (letters.length));
        return letters[randomLetterIndex];
    },

    drawAll() {
        this.drawLetters()
        this.drawLine()
        this.drawScore()
    },

    drawLetters() { this.currentLetters.length >= 0 & (this.currentLetters.forEach(letter => letter.draw())) },

    drawScore() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Verdana"
        this.ctx.fillText(`Score: ${this.score}`, 20, 40)
        this.ctx.fillText(`Fallen letters: ${this.fallenScore}`, 20, 65)

    },

    drawLine() {
        this.ctx.lineWidth = 5
        this.ctx.beginPath()
        this.ctx.setLineDash([20, 30])
        this.ctx.moveTo(0, this.canvasSize.height - 90)
        this.ctx.lineTo(this.canvasSize.width, this.canvasSize.height - 90)
        this.ctx.stroke()
        this.ctx.closePath()
    },

    moveLetters() {
        this.currentLetters.forEach(letter => letter.move())
    },

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
    },

    setListeners() {
        document.onkeyup = (e) => {
            this.collectLetter(e.key)
        }
    },

    collectLetter(key) {

        let letterChecker = this.currentLetters.filter(letter => letter.value === key)

        if (letterChecker.length >= 2) {
            this.score += letterChecker.length

            this.currentLetters = this.currentLetters.filter(function (letter) {
                return letter.value != key;
            });

        }
    },

    setBoundaries() {
        this.currentLetters.forEach((letter, index) => {
            letter.pos.y >= this.canvasSize.height - 90 ? this.fallenLetters.push(this.currentLetters.splice(index, 1)) : null
        })
    },

    fallenCounter() { this.fallenScore = this.fallenLetters.length },

    gameOver() { clearInterval(this.intervalId) }

}



class Letter {
    constructor(ctx, posX, posY, width, height, speedY, value, fillColor) {
        this.ctx = ctx

        this.pos = {
            x: posX,
            y: posY
        }

        this.size = {
            width: width,
            height: height
        }

        this.speed = speedY

        this.value = value

        this.fillColor = fillColor
    }

    draw() {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height)
        this.ctx.font = "30px Verdana"
        this.ctx.fillText(this.value, this.pos.x + 2, this.pos.y - 2)
    }

    move() {
        this.pos.y += this.speed * 0.3
    }
}