'use client'

import Masonry from 'react-masonry-css'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react' 
import { DesignFields } from '@/src/types/contentful'
import multi from "@/public/multi.svg" 
import left from "@/public/left.svg"
import right from "@/public/right.svg" 
import exit from "@/public/exit.svg"

interface DesignMasonryProps {
  designs: Array<{
    date: string
    id: string 
    images: DesignFields['images'] 
    name: string
  }>
}

const formatDate = (date: string) => { return date.replace(/-/g, '.') }

const DesignMasonry: React.FC<DesignMasonryProps> = ({ designs }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [modalVisibility, setModalVisibility] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]) 
  const padding = 200
  const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 }
  const [selectedDesign, setSelectedDesign] = useState<null | {
    name: string
    date: string
    images: DesignFields['images']
  }>(null) 

  // Open modal when a design is selected
  useEffect(() => {
    if (selectedDesign) {
      setModalVisibility(true) 
      const firstSlide = slideRefs.current[0]
      if (firstSlide) {
        setInitializing(true)
        setTranslateX(-firstSlide.offsetWidth / 2)
        setTimeout(() => setInitializing(false), 10) 
      }
    }
  }, [selectedDesign])
  
  // Close modal
  const handleCloseModal = () => {
    setModalVisibility(false)
    setTimeout(() => {
      setSelectedDesign(null)
      setCurrentImageIndex(0)
      setTranslateX(0)
      slideRefs.current = []
    }, 300)
  }

  // Navigate modal with arrows
  const navigateModal = (direction: 'next' | 'previous') => {
    if (selectedDesign) {
      const isNext = direction === 'next'
      const newIndex = isNext ? currentImageIndex + 1 : currentImageIndex - 1
  
      if (newIndex >= 0 && newIndex < selectedDesign.images.length) {
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
        {designs.map((design) => {
          const { url, details } = design.images[0].fields.file
          const aspectRatio = (details?.image?.width || 1) / (details?.image?.height || 1)

          return (
            <div
              key={design.id} 
              className="design"
              style={{ aspectRatio }}
              onClick={() => { setSelectedDesign({ name: design.name, date: design.date, images: design.images })}}
            >
              <Image src={`https:${url}`} alt={design.name} fill />
              {design.images.length > 1 && (
                <div className="multi">
                  <Image src={multi} alt="multiple images icon" height={13} />
                  {design.images.length}
                </div>
              )}
              <div className="sleeve">
                <b>{design.name}</b>
                <small>{formatDate(design.date)}</small>
              </div>
            </div>
          )
        })}
      </Masonry>

      {/* MODAL */}
      {selectedDesign && (
        <div className={`modal ${modalVisibility ? 'fade-in' : ''}`}>
          <div className="slider-wrapper" style={{ transform: `translateX(${translateX}px)`, transition: initializing ? 'none' : '' }}>
            <div className="slider">
              {selectedDesign.images.map((image, index) => {
                const { url, details } = image.fields.file
                const aspectRatio = (details?.image?.width || 1) / (details?.image?.height || 1)

                return (
                  <div
                    className='slide'
                    style={{ aspectRatio, maxHeight: '70vh', scale: currentImageIndex === index ? '1' : '0.9' }}
                    key={index}
                    ref={(el) => { slideRefs.current[index] = el }}
                  >
                    <Image src={`https:${url}`} alt={selectedDesign.name} fill style={{ objectFit: 'contain' }} />
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
          {currentImageIndex < selectedDesign.images.length - 1 && (
            <button className="right arrow" onClick={() => navigateModal('next')}>
              <Image src={right} alt="right arrow" height={48} />
            </button>
          )}

          <div className="details">
            <h1 style={{ color: 'var(--secondary)', marginTop: 0 }}><b>{selectedDesign.name}</b></h1>
            <h2 style={{ color: 'var(--primary)', fontWeight: '400' }}>{formatDate(selectedDesign.date)}</h2>
          </div>
        </div>
      )}
    </>
  )
}

export default DesignMasonry
