"use client"

import { useEffect, useRef } from "react"


// Configuration Variables
const CONFIG = {
  numberOfDots: 200,
  mouseRepelRange: 200,
  homeZoneWidth: 1152,
  homeZoneTop: 232,
  homeZoneBottom: 48,

}

type Dot = {
  x: number
  y: number
  homeX: number
  homeY: number
  radius: number
}


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let 
      homeZoneWidth = CONFIG.homeZoneWidth,
      homeZoneLeft = 0,
      homeZoneTop = CONFIG.homeZoneTop,
      homeZoneBottom = CONFIG.homeZoneBottom,
      homeZoneHeight = 0
    ;

    const mouse = { x: -100, y: -100, isActive: false }

    const updateCanvasSizeAndZones = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    
      ctx.scale(devicePixelRatio, devicePixelRatio);
    

      homeZoneWidth = CONFIG.homeZoneWidth;
      homeZoneTop = CONFIG.homeZoneTop;
      homeZoneBottom = CONFIG.homeZoneBottom;
    
      homeZoneLeft = (window.innerWidth - homeZoneWidth) / 2;
      homeZoneHeight = window.innerHeight - homeZoneTop - homeZoneBottom;
    }    
    updateCanvasSizeAndZones()

    const dots: Dot[] = Array.from({ length: CONFIG.numberOfDots }, () => {
      const homeX = Math.random() * homeZoneWidth + homeZoneLeft
      const homeY = Math.random() * homeZoneHeight + homeZoneTop
      return {
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        radius: 2,
      }
    })

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
        mouse.isActive = true
    }



    // Dot animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const dot of dots) {
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const distance = Math.hypot(dx, dy)

        if (mouse.isActive && distance < CONFIG.mouseRepelRange) {
          const angle = Math.atan2(dy, dx)
          const force = (CONFIG.mouseRepelRange - distance) / CONFIG.mouseRepelRange
          dot.x += Math.cos(angle) * force * 5
          dot.y += Math.sin(angle) * force * 5
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate() // Start animation

    // Event listeners and cleanup
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} />
}