'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function Gallery() {
  const router = useRouter()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [galleryOpacity, setGalleryOpacity] = useState(1)
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [tagIcons, setTagIcons] = useState<Array<{ tag: string; image: string; label: string }>>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const galleryTextRef = useRef<HTMLHeadingElement>(null)
  
  // Load gallery data
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        console.log('Loading gallery collections...')
        // Load from API (database)
        const response = await fetch('/api/gallery/collections')
        if (!response.ok) {
          throw new Error('Failed to load collections')
        }
        
        const collections = await response.json()
        console.log('Received collections:', collections.length)
        
        const items = collections.map((collection: any) => {
          return {
            id: collection.id,
            slug: collection.slug,
            image: collection.coverImage,
            title: collection.name,
            subtitle: collection.category,
            createdAt: collection.createdAt,
            dateRange: collection.dateRange,
            images: collection.images
          }
        })
        
        console.log('Mapped items:', items.length)
        setGalleryItems(items)
        
        // Collect all unique tags from all images in all collections
        const allTags = new Set<string>()
        const tagToImageMap = new Map<string, string>()
        
        collections.forEach((c: any) => {
          if (c.images && Array.isArray(c.images)) {
            c.images.forEach((img: any) => {
              if (img.tags && Array.isArray(img.tags)) {
                img.tags.forEach((tag: string) => {
                  allTags.add(tag)
                  // Store first image URL for each tag
                  if (!tagToImageMap.has(tag)) {
                    tagToImageMap.set(tag, img.url)
                  }
                })
              }
            })
          }
        })
        
        // Create tag icons from actual images with those tags
        const tagLabels: Record<string, string> = {
          'urban': 'Urban',
          'portrait': 'Portrait',
          'nature': 'Nature',
          'night': 'Night',
          'day': 'Day',
          'indoor': 'Indoor',
          'outdoor': 'Outdoor',
          'warm-tones': 'Warm',
          'cool-tones': 'Cool',
          'black-white': 'B&W',
          'colorful': 'Color',
          'macro': 'Macro',
          'landscape': 'Landscape',
          'street': 'Street',
          'fashion': 'Fashion',
          'people': 'People',
          'architecture': 'Architecture',
          'abstract': 'Abstract',
          'monochrome': 'Mono',
          'model-female': 'Female',
          'model-male': 'Male',
          'texture': 'Texture',
          'detail': 'Detail',
          'wide-angle': 'Wide',
          'close-up': 'Close-up',
          'standard': 'Standard',
          'mixed-tones': 'Mixed'
        }
        
        // Create icons for ALL tags found in the database
        const icons = Array.from(tagToImageMap.entries())
          .map(([tag, imageUrl]) => ({
            tag,
            image: imageUrl,
            label: tagLabels[tag] || tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          }))
          .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
        
        setTagIcons(icons)
        
        console.log(`Loaded ${collections.length} collections from database`)
        console.log(`Created ${icons.length} tag icons from actual images (showing ALL tags)`)
      } catch (error) {
        console.error('Error loading gallery data:', error)
        setGalleryItems([])
      }
    }
    
    loadGalleryData()
  }, [])
  
  useEffect(() => {
    const galleryPageElement = document.querySelector(`.${styles.galleryPage}`)
    
    const handleScroll = () => {
      const scrollY = galleryPageElement ? galleryPageElement.scrollTop : window.scrollY
      const viewportHeight = window.innerHeight
      const fadeThreshold = viewportHeight * 0.1
      
      if (scrollY < fadeThreshold) {
        const opacity = 1 - (scrollY / fadeThreshold)
        setGalleryOpacity(Math.max(0, opacity))
      } else {
        setGalleryOpacity(0)
      }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (galleryTextRef.current) {
        const x = e.clientX / window.innerWidth
        const hue = Math.floor(x * 360)
        galleryTextRef.current.style.setProperty('--hue-rotate', `${hue}deg`)
      }
    }
    
    handleScroll()
    
    if (galleryPageElement) {
      galleryPageElement.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      if (galleryPageElement) {
        galleryPageElement.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  // Handle tag click
  const handleTagClick = (tag: string) => {
    router.push(`/gallery/tag/${tag}`)
  }
  
  const itemsPerPage = 9
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage)
  const currentItems = galleryItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )
  const nextItems = nextPage !== null ? galleryItems.slice(
    nextPage * itemsPerPage,
    (nextPage + 1) * itemsPerPage
  ) : []

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('categoryScroll')
    if (container) {
      const scrollAmount = 150
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const changePage = (dir: 'prev' | 'next') => {
    if (isTransitioning) return
    
    let newPage: number
    let moveDirection: 'left' | 'right'
    
    if (dir === 'prev' && currentPage > 0) {
      newPage = currentPage - 1
      moveDirection = 'right' // Click left arrow -> move right
    } else if (dir === 'next' && currentPage < totalPages - 1) {
      newPage = currentPage + 1
      moveDirection = 'left' // Click right arrow -> move left
    } else {
      return
    }
    
    setDirection(moveDirection)
    setNextPage(newPage)
    
    // Start transition on next frame
    setTimeout(() => {
      setIsTransitioning(true)
    }, 10)
    
    // Complete transition
    setTimeout(() => {
      setCurrentPage(newPage)
      setNextPage(null)
      setIsTransitioning(false)
    }, 510)
  }

  // Helper function to format date range
  const formatDateRange = (dateRange: any, createdAt: string) => {
    if (dateRange && (dateRange.start || dateRange.end)) {
      if (dateRange.start && dateRange.end) {
        // Full date range
        return `${new Date(dateRange.start).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })} - ${new Date(dateRange.end).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}`
      } else if (dateRange.start) {
        // Start date only
        return `From ${new Date(dateRange.start).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}`
      } else {
        // End date only
        return `Until ${new Date(dateRange.end).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}`
      }
    } else if (createdAt) {
      // Fallback to creation date
      return new Date(createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    return null
  }

  return (
    <div className={styles.galleryPage}>
      <Header />
      
      <h1 
        ref={galleryTextRef} 
        className={styles.heroTitle}
        style={{ opacity: galleryOpacity }}
      >
        Ga<span className={styles.coloredLetter}>ll</span>er<span className={styles.coloredLetter}>y</span>
      </h1>
      
      <section className={styles.heroSection}>
        <div className={styles.categoryLabelContainer}>
          {hoveredCategory && (
            <p className={styles.categoryLabel}>{hoveredCategory}</p>
          )}
        </div>
        
        <div className={styles.categoryNav}>
          <button 
            className={styles.scrollArrow}
            onClick={() => scrollCategories('left')}
          >
            ◀
          </button>
          <div className={styles.categoryScroll} id="categoryScroll">
            {tagIcons.map((tagIcon) => (
              <div
                key={tagIcon.tag}
                className={styles.categoryIcon}
                onMouseEnter={() => setHoveredCategory(tagIcon.label)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleTagClick(tagIcon.tag)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={tagIcon.image}
                  alt={tagIcon.label}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
          <button 
            className={styles.scrollArrow}
            onClick={() => scrollCategories('right')}
          >
            ▶
          </button>
        </div>
      </section>
      
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryWrapper}>
            {/* Always render current page */}
            <div 
              className={styles.gallery}
              style={{
                transform: isTransitioning 
                  ? direction === 'left' 
                    ? 'translateX(-25vw)'  // Click right: current moves left
                    : 'translateX(25vw)'   // Click left: current moves right
                  : 'translateX(0)',
                opacity: nextPage !== null && isTransitioning ? 0 : 1,
                transition: isTransitioning ? 'transform 0.5s ease, opacity 0.5s ease' : 'none',
                zIndex: 1,
                visibility: nextPage !== null && !isTransitioning ? 'hidden' : 'visible'
              }}
            >
              {galleryItems.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', width: '100%' }}>
                  <p>Loading collections...</p>
                </div>
              ) : (
                currentItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/gallery/${item.id}`}
                    className={styles.galleryItem}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={styles.galleryImage}
                    />
                    {/* Hide overlay during transition for better performance */}
                    {!isTransitioning && (
                      <div className={styles.overlay}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.subtitle}>{item.subtitle}</p>
                        {formatDateRange(item.dateRange, item.createdAt) && (
                          <p className={styles.date}>
                            {formatDateRange(item.dateRange, item.createdAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
            
            {/* Next page - show during transition */}
            {nextPage !== null && (
              <div 
                className={styles.gallery}
                style={{
                  transform: isTransitioning 
                    ? 'translateX(0)'  // Animate to center
                    : direction === 'left'
                      ? 'translateX(25vw)'   // Click right: new starts from RIGHT (+25vw), moves LEFT to 0
                      : 'translateX(-25vw)', // Click left: new starts from LEFT (-25vw), moves RIGHT to 0
                  opacity: isTransitioning ? 1 : 0,
                  transition: isTransitioning ? 'transform 0.5s ease, opacity 0.5s ease' : 'none',
                  zIndex: 2
                }}
              >
                {nextItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/gallery/${item.id}`}
                    className={styles.galleryItem}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={styles.galleryImage}
                    />
                    {/* Hide overlay during transition for better performance */}
                    {!isTransitioning && (
                      <div className={styles.overlay}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.subtitle}>{item.subtitle}</p>
                        {formatDateRange(item.dateRange, item.createdAt) && (
                          <p className={styles.date}>
                            {formatDateRange(item.dateRange, item.createdAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button 
          className={`${styles.pageArrow} ${styles.pageArrowLeft}`}
          onClick={() => changePage('prev')}
          disabled={currentPage === 0 || isTransitioning}
        >
          ◀
        </button>
        <button 
          className={`${styles.pageArrow} ${styles.pageArrowRight}`}
          onClick={() => changePage('next')}
          disabled={currentPage === totalPages - 1 || isTransitioning}
        >
          ▶
        </button>
      </section>
      
      <Footer />
    </div>
  )
}