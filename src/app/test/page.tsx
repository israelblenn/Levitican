"use client"

import { useEffect, useRef } from "react"

const CONFIG = {
  numberOfDots: 2000,
  mouseRepelRange: 200,
}

type Dot = {
  x: number
  y: number
  radius: number
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const mouse = { x: -100, y: -100, isActive: false }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots: Dot[] = Array.from({ length: CONFIG.numberOfDots }, () => {
      return {
        x: Math.random() * 1000 + 0,
        y: Math.random() * 1000 + 0,
        radius: 2,
      }
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isActive = true
      console.log(mouse.x, mouse.y);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const dot of dots) {
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const distance = Math.hypot(dx, dy)

        if (mouse.isActive && distance < CONFIG.mouseRepelRange) {
          const angle = Math.atan2(dy, dx)
          dot.x += Math.cos(angle) *  5
          dot.y += Math.sin(angle) *  5
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate() 

    window.addEventListener("mousemove", handleMouseMove)
    return () => { window.removeEventListener("mousemove", handleMouseMove) }
  }, [])

  return <canvas style={{background: 'white'}} ref={canvasRef} />
}