"use client"

import { useEffect, useRef } from "react"


// Configuration Variables
const CONFIG = {
  numberOfDots: 200,
  dotRadiusRange: [0.5, 2.5],
  driftRange: [1, 5],
  driftSpeed: 0.05,
  springStrength: 0.02,
  mouseRepelRange: 200,
  repelForce: 5,
  mobileRepelForce: 20,
  colorSpeedRange: [0.005, 0.02],
  primary: { r: 203, g: 160, b: 84 },
  secondary: { r: 235, g: 212, b: 172 },
  homeZoneWidth: 1152,
  homeZoneTop: 232,
  homeZoneBottom: 48,
  mobilePadding: 32,
  mobileHomeZoneTop: 120,
}

type Dot = {
  x: number
  y: number
  homeX: number
  homeY: number
  radius: number
  driftVX: number
  driftVY: number
  colorPhase: number
  colorSpeed: number
  colorDirection: number
}

// Blend colours
const interpolateColor = (primary: { r: number; g: number; b: number }, secondary: { r: number; g: number; b: number }, factor: number) => {
  return `rgb(${Math.round(primary.r + factor * (secondary.r - primary.r))}, ${Math.round(
    primary.g + factor * (secondary.g - primary.g)
  )}, ${Math.round(primary.b + factor * (secondary.b - primary.b))})`
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isTouchDevice = useRef(false)

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

    // Check for touch screen devices
    const checkTouchDevice = () => {
      isTouchDevice.current = "ontouchstart" in window || navigator.maxTouchPoints > 0
    }
    checkTouchDevice()

    // Update dimensions
    const updateCanvasSizeAndZones = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      if (window.innerWidth < CONFIG.homeZoneWidth) {
        homeZoneWidth = window.innerWidth - CONFIG.mobilePadding
        homeZoneTop = CONFIG.mobileHomeZoneTop
        homeZoneBottom = CONFIG.mobilePadding
      } else {
        homeZoneWidth = CONFIG.homeZoneWidth
        homeZoneTop = CONFIG.homeZoneTop
        homeZoneBottom = CONFIG.homeZoneBottom
      }

      homeZoneLeft = (window.innerWidth - homeZoneWidth) / 2
      homeZoneHeight = window.innerHeight - homeZoneTop - homeZoneBottom
    }
    updateCanvasSizeAndZones()

    // Generate dots
    const dots: Dot[] = Array.from({ length: CONFIG.numberOfDots }, () => {
      const homeX = Math.random() * homeZoneWidth + homeZoneLeft
      const homeY = Math.random() * homeZoneHeight + homeZoneTop
      return {
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        radius: Math.random() * (CONFIG.dotRadiusRange[1] - CONFIG.dotRadiusRange[0]) + CONFIG.dotRadiusRange[0],
        driftVX: (Math.random() - 0.5) * CONFIG.driftRange[1],
        driftVY: (Math.random() - 0.5) * CONFIG.driftRange[1],
        colorPhase: Math.random(),
        colorSpeed: Math.random() * (CONFIG.colorSpeedRange[1] - CONFIG.colorSpeedRange[0]) + CONFIG.colorSpeedRange[0],
        colorDirection: 1,
      }
    })

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouchDevice.current) {
        const rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
        mouse.isActive = true
      }
    }

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (isTouchDevice.current) {
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        mouse.x = touch.clientX - rect.left
        mouse.y = touch.clientY - rect.top
        mouse.isActive = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouchDevice.current) {
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        mouse.x = touch.clientX - rect.left
        mouse.y = touch.clientY - rect.top
      }
    }

    const handleTouchEnd = () => {
      if (isTouchDevice.current) {
        mouse.isActive = false
        mouse.x = -100
        mouse.y = -100
      }
    }

    // Resize handler
    const handleResize = () => {
      updateCanvasSizeAndZones()

      dots.forEach(dot => {
        dot.homeX = Math.random() * homeZoneWidth + homeZoneLeft
        dot.homeY = Math.random() * homeZoneHeight + homeZoneTop
      })
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
          const repelForce = isTouchDevice.current ? CONFIG.mobileRepelForce : CONFIG.repelForce
          dot.x += Math.cos(angle) * force * repelForce
          dot.y += Math.sin(angle) * force * repelForce
        } else {
          dot.x += (dot.homeX - dot.x) * CONFIG.springStrength + dot.driftVX * CONFIG.driftSpeed
          dot.y += (dot.homeY - dot.y) * CONFIG.springStrength + dot.driftVY * CONFIG.driftSpeed

          dot.driftVX += (Math.random() - 0.5) * CONFIG.driftRange[0]
          dot.driftVY += (Math.random() - 0.5) * CONFIG.driftRange[0]
          dot.driftVX = Math.max(-CONFIG.driftRange[1], Math.min(CONFIG.driftRange[1], dot.driftVX))
          dot.driftVY = Math.max(-CONFIG.driftRange[1], Math.min(CONFIG.driftRange[1], dot.driftVY))
        }

        dot.colorPhase += dot.colorSpeed * dot.colorDirection
        if (dot.colorPhase >= 1 || dot.colorPhase <= 0) {
          dot.colorDirection *= -1
          dot.colorPhase = Math.max(0, Math.min(dot.colorPhase, 1))
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = interpolateColor(CONFIG.primary, CONFIG.secondary, dot.colorPhase)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate() // Start animation

    // Event listeners and cleanup
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />
}
