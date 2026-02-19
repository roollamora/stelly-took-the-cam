'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

interface Collaboration {
  id: number
  title: string
  subtitle?: string
  description: string
  type: string
  status: string
  partner: any
  coverImage?: string
  startDate?: string
  endDate?: string
  deliverables: string[]
  terms?: string
  budget?: number
  priority: string
  tags: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

export default function Collaboration() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadCollaborations = async () => {
      try {
        const response = await fetch('/api/collaborations?limit=50&sortBy=createdAt&sortOrder=desc')
        if (response.ok) {
          const data = await response.json()
          setCollaborations(data)
        }
      } catch (error) {
        console.error('Error loading collaborations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCollaborations()
  }, [])

  const filteredCollaborations = filter === 'all' 
    ? collaborations 
    : collaborations.filter(c => c.status === filter)

  const types = [...new Set(collaborations.map(c => c.type))]
  const statuses = [...new Set(collaborations.map(c => c.status))]

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>Collaborations</h1>
        <p className={styles.subtitle}>Creative partnerships and joint ventures</p>
        
        {/* Filter buttons */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading collaborations...</div>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredCollaborations.map(collaboration => (
              <Link 
                key={collaboration.id} 
                href={`/collaboration/${collaboration.slug}`}
                className={styles.projectCard}
              >
                {collaboration.coverImage && (
                  <img 
                    src={collaboration.coverImage} 
                    alt={collaboration.title}
                    className={styles.projectImage}
                  />
                )}
                <div className={styles.projectContent}>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectCategory}>{collaboration.type}</span>
                    <span className={styles.projectStatus}>{collaboration.status}</span>
                  </div>
                  <h3 className={styles.projectTitle}>{collaboration.title}</h3>
                  {collaboration.subtitle && (
                    <p className={styles.projectSubtitle}>{collaboration.subtitle}</p>
                  )}
                  <p className={styles.projectDescription}>{collaboration.description}</p>
                  
                  {collaboration.partner && (
                    <div className={styles.partnerInfo}>
                      <strong>Partner:</strong> {collaboration.partner.name}
                    </div>
                  )}
                  
                  {collaboration.tags.length > 0 && (
                    <div className={styles.projectTags}>
                      {collaboration.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.projectDate}>
                    {new Date(collaboration.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
      
      <Footer />
    </div>
  )
}
