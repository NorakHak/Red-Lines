import React from 'react';


export const LineJoints = () => {

    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {

        const canvas = canvasRef.current
        if (!canvas) return

        const mainApp = new App(canvas)
        mainApp.init()

        return () => {
            mainApp.cleanUp()
        }

    }, [])

    return <canvas ref={canvasRef} />
}

class App {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private width: number
    private height: number
    private particles: Particle[]
    private properties: Properties
    private animationFrameId: number | null = null

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.width = canvas.width = window.innerWidth
        this.height = canvas.height = window.innerHeight
        this.particles = []
        this.properties = new Properties()

        window.addEventListener("resize", this.handleResize.bind(this))
    }

    init() {
        for (let i = 0; i < this.properties.particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.properties))
        }
        this.animate()
    }

    private animate() {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this))
        this.redraw()
    }

    private redraw() {
        this.ctx.fillStyle = this.properties.bgColor
        this.ctx.fillRect(0, 0, this.width, this.height)

        for (const particle of this.particles) {
            particle.draw(this.ctx)
            particle.updatePosition(this.width, this.height)
        }

        this.drawLines()
    }

    private drawLines() {
        let x1 = 0
        let y1 = 0
        let x2 = 0
        let y2 = 0
        let lineLen = 0
        let opacity = 0

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = 0; j < this.particles.length; j++) {
                if (i !== j) {
                    x1 = this.particles[i].x
                    y1 = this.particles[i].y
                    x2 = this.particles[j].x
                    y2 = this.particles[j].y
                    lineLen = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                    if (lineLen < this.properties.joinLineLength) {
                        opacity = 1 - lineLen / this.properties.joinLineLength
                        this.ctx.lineCap = "round"
                        this.ctx.lineWidth = 5 * opacity
                        this.ctx.strokeStyle = `rgba(153, 102, 204, ${opacity})`
                        this.ctx.beginPath()
                        this.ctx.moveTo(x1, y1)
                        this.ctx.lineTo(x2, y2)
                        this.ctx.closePath()
                        this.ctx.stroke()
                    }
                }
            }
        }
    }



    private handleResize() {
        this.width = this.canvas.width = window.innerWidth
        this.height = this.canvas.height = window.innerHeight
    }

    public cleanUp() {
        window.removeEventListener("resize", this.handleResize)
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
        }
    }

}

class Particle {
    public x: number
    public y: number
    public velocityX: number
    public velocityY: number
    public properties: Properties

    constructor(width: number, height: number, properties: Properties) {
        this.x = Math.random() * width;
        this.y = Math.random() * height
        this.velocityX = Math.random() * properties.particleMaxVelocity * 2 - properties.particleMaxVelocity
        this.velocityY = Math.random() * properties.particleMaxVelocity * 2 - properties.particleMaxVelocity
        this.properties = properties
    }

    updatePosition(width: number, height: number) {
        if (this.x >= width || this.x <= 1) {
            this.velocityX = -this.velocityX
        }

        if (this.y >= height || this.y <= 1) {
            this.velocityY = -this.velocityY
        }

        this.x += this.velocityX
        this.y += this.velocityY
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.properties.particleRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = this.properties.particleColor
        ctx.fill()
    }
}

class Properties {
    public bgColor: string = "rgba(17,17,19,1)"
    public particleColor: string = "rgba(153, 102, 204, 1)"
    public particleRadius: number = 5
    public particleCount: number = 120
    public particleMaxVelocity: number = 0.5
    public joinLineLength: number = 150
}


