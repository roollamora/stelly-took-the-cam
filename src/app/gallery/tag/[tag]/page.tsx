'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import styles from '../../[id]/page.module.css'

export default function TagPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tag = params.tag as string

  useEffect(() => {
    const loadTagImages = async () => {
      try {
        setLoading(true)
        
        // Load collections from API
        const response = await fetch('/api/gallery/collections')
        if (!response.ok) {
          throw new Error('Failed to load collections')
        }
        
        const collections = await response.json()
        
        // Find all images with this tag (only check image tags)
        const tagImages: any[] = []
        
        for (const collection of collections) {
          for (const image of collection.images) {
            const hasImageTag = image.tags && image.tags.includes(tag)
            
            if (hasImageTag) {
              tagImages.push({
                url: image.url,
                alt: image.alt,
                collectionName: collection.name,
                collectionId: collection.id,
                tags: image.tags
              })
            }
          }
        }
        
        if (tagImages.length === 0) {
          setError('No images found with this tag')
        } else {
          setImages(tagImages)
          console.log(`Found ${tagImages.length} images with tag: ${tag}`)
        }
      } catch (err) {
        console.error('Error loading tag images:', err)
        setError('Failed to load images')
      } finally {
        setLoading(false)
      }
    }
    
    loadTagImages()
  }, [tag])

  if (loading) {
    return (
      <div className={styles.collectionPage}>
        <Header />
        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
          Loading images...
        </div>
      </div>
    )
  }

  if (error || images.length === 0) {
    return (
      <div className={styles.collectionPage}>
        <Header />
        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
          <h2>{error || 'No images found'}</h2>
          <button 
            onClick={() => router.push('/gallery')}
            style={{ 
              marginTop: '2rem', 
              padding: '0.75rem 2rem', 
              background: '#333', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    )
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const currentImage = images[currentImageIndex]

  return (
    <div className={styles.collectionPage}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <button 
              className={`${styles.sideArrow} ${styles.leftArrow}`}
              onClick={() => navigateImage('prev')}
              disabled={currentImageIndex === 0}
            >
              ◀
            </button>
            <img 
              src={currentImage.url} 
              alt={currentImage.alt}
              className={styles.mainImage}
            />
            <button 
              className={`${styles.sideArrow} ${styles.rightArrow}`}
              onClick={() => navigateImage('next')}
              disabled={currentImageIndex === images.length - 1}
            >
              ▶
            </button>
          </div>
          
          <div className={styles.imageNav}>
            <div className={styles.imageIndicators}>
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`${styles.indicator} ${index === currentImageIndex ? styles.activeIndicator : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoContent}>
            <h1 className={styles.collectionTitle}>#{tag}</h1>
            <p className={styles.collectionSubtitle}>
              From: {currentImage.collectionName}
            </p>
            <p className={styles.imageCount}>
              Image {currentImageIndex + 1} of {images.length}
            </p>
            <p className={styles.description}>
              All images tagged with "{tag}"
            </p>
            
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => router.push(`/gallery/${currentImage.collectionId}`)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Full Collection
              </button>
            </div>
          </div>

          <div className={styles.collectionNav}>
            <div className={styles.collectionScroll}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.collectionThumb} ${index === currentImageIndex ? styles.activeThumb : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image.url} 
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.relatedSection}>
            <div className={styles.divider}></div>
            <button
              onClick={() => router.push('/gallery')}
              style={{
                padding: '0.75rem 2rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
