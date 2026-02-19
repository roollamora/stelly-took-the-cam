'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import styles from './page.module.css'
import type { GalleryCollection } from '../../../lib/database/schema'

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [collection, setCollection] = useState<GalleryCollection | null>(null)
  const [relatedCollections, setRelatedCollections] = useState<GalleryCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setLoading(true)
        const collectionId = Number(params.id)
        
        if (isNaN(collectionId)) {
          setError('Invalid collection ID')
          setLoading(false)
          return
        }
        
        // Load from API (database)
        const response = await fetch(`/api/gallery/collections/${collectionId}`)
        if (!response.ok) {
          setError('Collection not found')
          setLoading(false)
          return
        }
        
        const collectionData = await response.json()
        
        // Transform to GalleryCollection format
        const collection: GalleryCollection = {
          ...collectionData,
          slug: collectionData.slug || collectionData.name.toLowerCase().replace(/\s+/g, '-'),
          seo: collectionData.seo || {
            keywords: collectionData.tags,
            metaTitle: collectionData.name,
            metaDescription: collectionData.description
          }
        }
        
        setCollection(collection)
        
        // Load all collections for related section
        const allResponse = await fetch('/api/gallery/collections')
        if (allResponse.ok) {
          const allCollections = await allResponse.json()
          
          // Get 3 random other collections
          const others = allCollections
            .filter((c: any) => c.id !== collectionId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
          
          setRelatedCollections(others)
        }
        
        console.log(`Loaded collection: ${collection.name} with ${collection.images.length} images`)
      } catch (err) {
        console.error('Error loading collection:', err)
        setError('Failed to load collection')
      } finally {
        setLoading(false)
      }
    }
    
    loadCollection()
  }, [params.id])

  if (loading) {
    return (
      <div className={styles.collectionPage}>
        <Header />
        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
          Loading collection...
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className={styles.collectionPage}>
        <Header />
        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
          <h2>{error || 'Collection not found'}</h2>
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
    } else if (direction === 'next' && currentImageIndex < collection.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const currentImage = collection.images[currentImageIndex]

  return (
    <div className={styles.collectionPage}>
      <Header />
      
      <div className={styles.content}>
        {/* Left side - Image display */}
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
              alt={currentImage.alt || `${collection.name} - Image ${currentImageIndex + 1}`}
              className={styles.mainImage}
            />
            <button 
              className={`${styles.sideArrow} ${styles.rightArrow}`}
              onClick={() => navigateImage('next')}
              disabled={currentImageIndex === collection.images.length - 1}
            >
              ▶
            </button>
          </div>
          
          {/* Navigation */}
          <div className={styles.imageNav}>
            <div className={styles.imageIndicators}>
              {collection.images.map((_, index) => (
                <div 
                  key={index}
                  className={`${styles.indicator} ${index === currentImageIndex ? styles.activeIndicator : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoContent}>
            <h1 className={styles.collectionTitle}>{collection.name}</h1>
            <p className={styles.collectionSubtitle}>{collection.category}</p>
            <p className={styles.imageCount}>
              Image {currentImageIndex + 1} of {collection.images.length}
            </p>
            
            {/* Display photo date */}
            {currentImage.photoDate && (
              <p className={styles.photoDate}>
                Photo taken: {new Date(currentImage.photoDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
            
            {/* Display collection date range */}
            {collection.dateRange && (collection.dateRange.start || collection.dateRange.end) && (
              <p className={styles.collectionDateRange}>
                Collection: {collection.dateRange.start && collection.dateRange.end ? (
                  `${new Date(collection.dateRange.start).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} - ${new Date(collection.dateRange.end).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}`
                ) : collection.dateRange.start ? (
                  `From ${new Date(collection.dateRange.start).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}`
                ) : (
                  `Until ${new Date(collection.dateRange.end).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}`
                )}
              </p>
            )}
            
            <p className={styles.description}>{collection.description}</p>
            
            {/* Display tags */}
            {currentImage.tags && currentImage.tags.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Tags:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {currentImage.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#f0f0f0',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                      onClick={() => router.push(`/gallery/tag/${tag}`)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Collection Navigation Bar */}
          <div className={styles.collectionNav}>
            <div className={styles.collectionScroll}>
              {collection.images.map((image, index) => (
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

          {relatedCollections.length > 0 && (
            <div className={styles.relatedSection}>
              <div className={styles.divider}></div>
              <h3 className={styles.relatedTitle}>You also may be interested in:</h3>
              <div className={styles.relatedCollections}>
                {relatedCollections.map((col) => (
                  <div 
                    key={col.id}
                    className={styles.relatedItem}
                    onClick={() => {
                      setCurrentImageIndex(0)
                      router.push(`/gallery/${col.id}`)
                    }}
                  >
                    <img 
                      src={col.coverImage} 
                      alt={col.name}
                      className={styles.relatedImage}
                    />
                    <div className={styles.relatedInfo}>
                      <h4 className={styles.relatedItemTitle}>{col.name}</h4>
                      <p className={styles.relatedItemSubtitle}>{col.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
