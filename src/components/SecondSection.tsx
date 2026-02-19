'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './SecondSection.module.css'
import { dataService } from '../lib/database/dataService'

interface ContentItem {
  type: 'blog' | 'gallery' | 'project' | 'collaboration'
  id: number | string
  title: string
  subtitle?: string
  category: string
  image: string
  description?: string
  date: string
  link: string
}

export default function SecondSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [leftArrowOpacity, setLeftArrowOpacity] = useState(0)
  const [rightArrowOpacity, setRightArrowOpacity] = useState(1)
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Default fallback items
  const defaultItems: ContentItem[] = [
    { 
      type: 'gallery',
      id: 1, 
      image: '/filler/BTC_1.6.jpeg', 
      category: 'BTC',
      title: 'Behind The Cam',
      description: 'Capturing the raw moments and authentic process behind every shot...',
      date: new Date().toISOString(),
      link: '/gallery/1'
    },
    { 
      type: 'gallery',
      id: 2, 
      image: '/filler/DETAILS_1.0.jpeg', 
      category: 'Details',
      title: 'Close Up',
      description: 'Exploring textures, patterns, and the beauty found in small details...',
      date: new Date().toISOString(),
      link: '/gallery/2'
    },
    { 
      type: 'gallery',
      id: 3, 
      image: '/filler/DUO_1.0.jpeg', 
      category: 'Duo',
      title: 'Part One',
      description: 'An exploration of duality and connection between subjects...',
      date: new Date().toISOString(),
      link: '/gallery/3'
    },
    { 
      type: 'gallery',
      id: 4, 
      image: '/filler/DUO_2.0.jpeg', 
      category: 'Duo',
      title: 'Part Two',
      description: 'Continuing the journey through partnerships and shared spaces...',
      date: new Date().toISOString(),
      link: '/gallery/4'
    },
    { 
      type: 'gallery',
      id: 5, 
      image: '/filler/DUO_3.0.jpeg', 
      category: 'Duo',
      title: 'Part Three',
      description: 'Themes of balance and harmony in visual storytelling...',
      date: new Date().toISOString(),
      link: '/gallery/5'
    },
    { 
      type: 'gallery',
      id: 6, 
      image: '/filler/DETAILS_1.7.jpeg', 
      category: 'Details',
      title: 'Extended',
      description: 'Additional perspectives and discoveries in close-up photography...',
      date: new Date().toISOString(),
      link: '/gallery/6'
    },
    { 
      type: 'gallery',
      id: 7, 
      image: '/filler/DUO_4.0.jpeg', 
      category: 'Duo',
      title: 'Part Four',
      description: 'Fresh perspectives on collaboration and coexistence...',
      date: new Date().toISOString(),
      link: '/gallery/7'
    },
    { 
      type: 'gallery',
      id: 8, 
      image: '/filler/BTC_1.8.jpeg', 
      category: 'BTC',
      title: 'Studio Work',
      description: 'The creative process unveiled through candid moments...',
      date: new Date().toISOString(),
      link: '/gallery/8'
    },
  ]

  // Load recent content from all sources
  useEffect(() => {
    const loadRecentContent = async () => {
      try {
        // Load unified recent content from database
        const response = await fetch('/api/recent?limit=12')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch recent content: ${response.status}`)
        }
        
        const recentContent = await response.json()
        console.log('Loaded recent content:', recentContent.length)
        
        // Convert to content items format
        const contentItems = recentContent.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          description: item.description,
          image: item.image,
          link: item.link,
          type: item.type,
          date: item.date,
          status: item.status
        }))
        
        setItems(contentItems)
      } catch (error) {
        console.error('Error loading recent content:', error)
        // Fallback to default items if API fails
        setItems(defaultItems)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentContent()
  }, [])

  useEffect(() => {
    const container = document.getElementById('grid-container')
    if (container) {
      const updateScrollState = () => {
        const scrollLeft = container.scrollLeft
        const maxScrollLeft = container.scrollWidth - container.clientWidth
        
        setScrollPosition(scrollLeft)
        setMaxScroll(maxScrollLeft)
        
        // Calculate arrow opacities
        const leftOpacity = Math.min(scrollLeft / 100, 1)
        const rightOpacity = Math.min((maxScrollLeft - scrollLeft) / 100, 1)
        
        setLeftArrowOpacity(leftOpacity)
        setRightArrowOpacity(rightOpacity)
      }

      container.addEventListener('scroll', updateScrollState)
      updateScrollState() // Initial call
      
      return () => container.removeEventListener('scroll', updateScrollState)
    }
  }, [])

  const scrollLeft = () => {
    const container = document.getElementById('grid-container')
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById('grid-container')
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  // Calculate shadow gradients based on scroll position
  const leftShadowOpacity = maxScroll > 0 ? Math.min(scrollPosition / maxScroll, 1) : 0
  const rightShadowOpacity = maxScroll > 0 ? Math.min((maxScroll - scrollPosition) / maxScroll, 1) : 0

  return (
    <section className={styles.section}>
      <button 
        className={`${styles.navButton} ${styles.leftButton}`} 
        onClick={scrollLeft}
        style={{ opacity: leftArrowOpacity }}
      >
      </button>
      
      <div className={styles.gridContainer} id="grid-container">
        <div 
          className={styles.leftShadow} 
          style={{ opacity: leftShadowOpacity }}
        ></div>
        <div 
          className={styles.rightShadow} 
          style={{ opacity: rightShadowOpacity }}
        ></div>
        
        <div className={styles.grid}>
          {items.map((item, index) => (
            <Link 
              key={`${item.type}-${item.id}`} 
              href={item.link}
              className={styles.column}
            >
              <div className={`${styles.cell} ${styles.topCell}`}>
                {index % 2 === 0 ? (
                  <div className={styles.textContent}>
                    <div className={styles.contentType}>
                      {item.type === 'blog' ? '📝 Blog' : 
                       item.type === 'gallery' ? '🖼️ Gallery' : 
                       item.type === 'project' ? '🎨 Project' :
                       item.type === 'collaboration' ? '🤝 Collaboration' : '📄 Content'}
                    </div>
                    <div className={styles.category}>{item.category}</div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.description}>{item.description}</div>
                    {item.date && (
                      <div className={styles.contentDate}>
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.image} />
                  </div>
                )}
              </div>
              <div className={`${styles.cell} ${styles.bottomCell}`}>
                {index % 2 === 0 ? (
                  <div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.image} />
                  </div>
                ) : (
                  <div className={styles.textContent}>
                    <div className={styles.contentType}>
                      {item.type === 'blog' ? '📝 Blog' : 
                       item.type === 'gallery' ? '🖼️ Gallery' : 
                       item.type === 'project' ? '🎨 Project' :
                       item.type === 'collaboration' ? '🤝 Collaboration' : '📄 Content'}
                    </div>
                    <div className={styles.category}>{item.category}</div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.description}>{item.description}</div>
                    {item.date && (
                      <div className={styles.contentDate}>
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button 
        className={`${styles.navButton} ${styles.rightButton}`} 
        onClick={scrollRight}
        style={{ opacity: rightArrowOpacity }}
      >
      </button>
    </section>
  )
}