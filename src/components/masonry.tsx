'use client'

import Masonry from 'react-masonry-css'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react' 
import { ImageFields } from '@/src/types/contentful'
import multi from "@/public/multi.svg" 
import left from "@/public/left.svg"
import right from "@/public/right.svg" 
import exit from "@/public/exit.svg"

interface MasonryLayoutProps {
  images: Array<{
    id: string 
    name: string
    date: string
    media: ImageFields['media'] 
  }>
}

interface ImageCarouselProps {
  media: ImageFields['media']
  alt: string
}

// Carousel for fading collections in the grid
const ImageCarousel: React.FC<ImageCarouselProps> = ({ media, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fadeImageIndex, setFadeImageIndex] = useState<number | null>(null)
  const [fade, setFade] = useState(false)
  const fadeDuration = 1000
  const [fadeInterval] = useState(() => {
    // Random interval between 1s (1000ms) and 4s (4000ms)
    return Math.floor(Math.random() * 3000) + 1000
  })
  const [isVisible, setIsVisible] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Observe visibility of the carousel
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting)
      })
    }, { threshold: 0.1 })

    if (carouselRef.current) observer.observe(carouselRef.current)

    return () => {
      if (carouselRef.current) observer.unobserve(carouselRef.current)
    }
  }, [])

  // Handle fading images only when visible
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % media.length
      setFadeImageIndex(nextIndex)
      setFade(true)

      setTimeout(() => {
        setCurrentIndex(nextIndex)
        setFadeImageIndex(null)
        setFade(false)
      }, fadeDuration)

    }, fadeInterval)

    return () => clearInterval(interval)
  }, [currentIndex, media.length, fadeInterval, isVisible])

  const currentImageUrl = media[currentIndex].fields.file.url
  const fadeImageUrl = fadeImageIndex !== null ? media[fadeImageIndex].fields.file.url : null

  return (
    <div className="carousel" ref={carouselRef}>
      <Image src={`https:${currentImageUrl}`} alt={alt} fill style={{ objectFit: 'cover' }} />
      {fade && fadeImageUrl && (
        <Image src={`https:${fadeImageUrl}`} alt={alt} fill className="fade-in-image" />
      )}
    </div>
  )
}


const formatDate = (date: string) => { return date.replace(/-/g, '.') }

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [modalVisibility, setModalVisibility] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]) 
  const padding = 200
  const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 }
  const [selectedImage, setselectedImage] = useState<null | {
    name: string
    date: string
    media: ImageFields['media']
  }>(null) 

  // Sort images by date (descending order for newest first)
  const sortedImages = [...images].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );


  // Open modal when an image is selected
  useEffect(() => {
    if (selectedImage) {
      setModalVisibility(true) 
      const firstSlide = slideRefs.current[0]
      if (firstSlide) {
        setInitializing(true)
        setTranslateX(-firstSlide.offsetWidth / 2)
        setTimeout(() => setInitializing(false), 100) 
      }
    }
  }, [selectedImage])
  
  // Close modal
  const handleCloseModal = () => {
    setModalVisibility(false)
    setTimeout(() => {
      setselectedImage(null)
      setCurrentImageIndex(0)
      setTranslateX(0)
      slideRefs.current = []
    }, 300)
  }

  // Navigate modal with arrows
  const navigateModal = (direction: 'next' | 'previous') => {
    if (selectedImage) {
      const isNext = direction === 'next'
      const newIndex = isNext ? currentImageIndex + 1 : currentImageIndex - 1
  
      if (newIndex >= 0 && newIndex < selectedImage.media.length) {
        const currentSlide = slideRefs.current[currentImageIndex]
        const targetSlide = slideRefs.current[newIndex]
  
        if (currentSlide && targetSlide) {
          const currentWidth = currentSlide.offsetWidth
          const targetWidth = targetSlide.offsetWidth
          const moveAmount = currentWidth / 2 + targetWidth / 2 + padding
  
          setTranslateX((prev) => prev + (isNext ? -moveAmount : moveAmount))
        }
  
        setCurrentImageIndex(newIndex)
      }
    }
  }

  return (
    <>
      <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid" columnClassName="masonry-column">
        {sortedImages.map((image) => {
          const aspectRatio = (image.media[0].fields.file.details?.image?.width || 1) / (image.media[0].fields.file.details?.image?.height || 1)

          return (
            <div
              key={image.id} 
              className="image"
              style={{ aspectRatio }}
              onClick={() => { setselectedImage({ name: image.name, date: image.date, media: image.media })}}
            >
              <div className="sleeve">
                <b>{image.name}</b>
                <small>{formatDate(image.date)}</small>
              </div>
              {image.media.length > 1 ? (
                <ImageCarousel media={image.media} alt={image.name} />
              ) : (
                <Image src={`https:${image.media[0].fields.file.url}`} alt={image.name} fill />
              )}
              {image.media.length > 1 && (
                <div className="flag">
                  <Image src={multi} alt="multiple images icon" height={13} />
                  {image.media.length}
                </div>
              )}

            </div>
          )
        })}
      </Masonry>

      {/* MODAL */}
      {selectedImage && (
        <div className={`modal ${modalVisibility ? 'fade-in' : ''}`}>
          <div className="slider-wrapper" style={{ transform: `translateX(${translateX}px)`, transition: initializing ? 'none' : '' }}>
            <div className="slider">
              {selectedImage.media.map((image, index) => {
                const { url, details } = image.fields.file;
                const aspectRatio = (details?.image?.width || 1) / (details?.image?.height || 1);
                const isCurrentImage = currentImageIndex === index;

                return (
                  <div
                    className="slide"
                    key={index}
                    ref={(el) => { slideRefs.current[index] = el }}
                    style={{
                      aspectRatio,
                      transform: `scale(${isCurrentImage ? 1 : 0.9})`,
                    }}
                  >
                    <a
                      href={`https:${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ pointerEvents: isCurrentImage ? 'auto' : 'none' }}
                    >
                      <Image
                        src={`https:${url}`}
                        alt={selectedImage.media[currentImageIndex].fields.title || 'Untitled'}
                        fill
                        style={{ objectFit: 'contain', cursor: isCurrentImage ? 'zoom-in' : 'default' }}
                      />
                    </a>
                  </div>
                )
              })}
            </div>
          </div>

          <button className="close-button" onClick={handleCloseModal}><Image src={exit} alt="exit button" height={32} /></button>
          
          {currentImageIndex > 0 && (
            <button className="left arrow" onClick={() => navigateModal('previous')}>
              <Image src={left} alt="left arrow" height={48} />
            </button>
          )}
          {currentImageIndex < selectedImage.media.length - 1 && (
            <button className="right arrow" onClick={() => navigateModal('next')}>
              <Image src={right} alt="right arrow" height={48} />
            </button>
          )}

          <div className="details">
            <h1 style={{ color: 'var(--secondary)', marginTop: 0 }}><b>{selectedImage.media[currentImageIndex].fields.title}</b></h1>
            <h2 style={{ color: 'var(--primary)', fontWeight: '400' }}>{formatDate(selectedImage.date)}</h2>
          </div>
        </div>
      )}
    </>
  )
}

export default MasonryLayout
