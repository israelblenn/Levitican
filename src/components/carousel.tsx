'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ImageFields } from '@/src/types/contentful'

interface CarouselProps {
  media: ImageFields['media']
  alt: string
}

const FADE_DURATION = 1000
const FADE_INTERVAL = 2500

const Carousel: React.FC<CarouselProps> = ({ media, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fadeImageIndex, setFadeImageIndex] = useState<number | null>(null)
  const [fade, setFade] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [initialDelayPassed, setInitialDelayPassed] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const globalStartRef = useRef<number | null>(null)

  const randomDelay = useRef(Math.random() * 2000).current

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    const currentCarouselRef = carouselRef.current
    if (currentCarouselRef) observer.observe(currentCarouselRef)

    return () => {
      if (currentCarouselRef) observer.unobserve(currentCarouselRef)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setInitialDelayPassed(true), randomDelay)
    return () => clearTimeout(timeout)
  }, [randomDelay])

  // Main animation logic
  useEffect(() => {
    if (!initialDelayPassed || !isVisible) {
      clearTimers()
      return
    }

    if (!globalStartRef.current) globalStartRef.current = Date.now()

    const timeElapsed = Date.now() - globalStartRef.current
    const initialDelay = FADE_INTERVAL - (timeElapsed % FADE_INTERVAL)

    const timeout = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setFadeImageIndex((prevIndex) => {
          const nextIndex = (prevIndex !== null ? prevIndex : currentIndex) + 1
          return nextIndex % media.length
        })

        setFade(true)
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length)
          setFadeImageIndex(null)
          setFade(false)
        }, FADE_DURATION)
      }, FADE_INTERVAL)
    }, initialDelay)

    return () => {
      clearTimeout(timeout)
      clearTimers()
    }
  }, [initialDelayPassed, isVisible, currentIndex, media.length, clearTimers])

  const currentImageUrl = media[currentIndex].fields.file.url
  const fadeImageUrl = fadeImageIndex !== null ? media[fadeImageIndex].fields.file.url : null

  return (
    <div ref={carouselRef} className="carousel">
      <Image src={`https:${currentImageUrl}`} alt={alt} fill style={{ objectFit: 'cover' }} />
      {fade && fadeImageUrl && (
        <Image src={`https:${fadeImageUrl}`} alt={alt} fill className="fade-in-image" />
      )}
    </div>
  )
}

export default Carousel
