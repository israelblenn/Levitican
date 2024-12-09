import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface CarouselProps {
  media: Array<{
    fields: {
      file: {
        url: string
      }
      title?: string
    }
  }>
  alt: string
}

const Carousel: React.FC<CarouselProps> = ({ media, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleIndex, setVisibleIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const duration = 1000
  const transition = 1000

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const element = carouselRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % media.length
      setVisibleIndex(currentIndex)
      setTimeout(() => setCurrentIndex(nextIndex), transition)
    }, duration)

    return () => clearInterval(interval)
  }, [currentIndex, media.length, isPaused])

  return (
    <div className="carousel" ref={carouselRef}>
      {media.map((image, index) => (
        <div
          key={index}
          className={`carousel-image ${index === currentIndex ? 'fade-in' : index === visibleIndex ? 'visible' : ''}`}
          style={{ transition: `opacity ${transition}ms ease-in-out` }}
        >
          <Image
            src={`https:${image.fields.file.url}`}
            alt={`${alt} - Slide ${index + 1}`}
            layout="fill"
            objectFit="cover"
            priority={index === currentIndex || index === visibleIndex}
          />
        </div>
      ))}
    </div>
  )
}

export default Carousel
