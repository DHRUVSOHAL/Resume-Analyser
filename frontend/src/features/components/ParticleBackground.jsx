import React, { useEffect, useRef } from 'react'


export default function ParticlesBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        let particles = []
        const particlesCount = 50
        const colors = ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)']

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.color = colors[Math.floor(Math.random() * colors.length)]
                this.radius = Math.random() * 3 + 1
                this.speedX = (Math.random() - 0.5) * 0.5
                this.speedY = (Math.random() - 0.5) * 0.5
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)//circular shape particles
                ctx.shadowBlur = 10
                ctx.shadowColor = this.color
                ctx.fillStyle = this.color
                ctx.fill()
            }


            update() {
                this.x += this.speedX
                this.y += this.speedY
                //wrap around effect
                if (this.x < 0) this.x = canvas.width
                if (this.x > canvas.width) this.x = 0
                if (this.y < 0) this.y = canvas.height
                if (this.y > canvas.height) this.y = 0


                this.draw()//redraw particle at new position
            }
        }

        function createParticles() {
            particles = []
            for (let i = 0; i < particlesCount; i++) {
                particles.push(new Particle())
            }
        }
        function handleResize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            createParticles()
        }
        handleResize()//initial setup
        window.addEventListener('resize', handleResize)

        //animation
        let anmationId
        function animate() {
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            )
            particles.forEach(particle => particle.update())
            anmationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(anmationId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        ></canvas>
    )
}