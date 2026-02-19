'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from '../page.module.css'

interface Collaboration {
  id: number
  title: string
  subtitle?: string
  description: string
  type: string
  status: string
  partner: {
    name: string
    contact?: string
    website?: string
  }
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

export default function CollaborationDetail() {
  const params = useParams()
  const slug = params.slug as string
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCollaboration = async () => {
      try {
        const response = await fetch(`/api/collaborations?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setCollaboration(data[0])
          } else {
            setError('Collaboration not found')
          }
        } else {
          setError('Failed to load collaboration')
        }
      } catch (error) {
        console.error('Error loading collaboration:', error)
        setError('Error loading collaboration')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadCollaboration()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <div className={styles.loading}>Loading collaboration...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !collaboration) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <h1 className={styles.title}>Collaboration Not Found</h1>
          <p>{error || 'The collaboration you are looking for does not exist.'}</p>
          <Link href="/collaboration" className={styles.backLink}>← Back to Collaborations</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.detailHeader}>
          <Link href="/collaboration" className={styles.backLink}>← Back to Collaborations</Link>
          
          {collaboration.coverImage && (
            <img 
              src={collaboration.coverImage} 
              alt={collaboration.title}
              className={styles.detailCoverImage}
            />
          )}
          
          <div className={styles.detailMeta}>
            <span className={styles.projectCategory}>{collaboration.type}</span>
            <span className={styles.projectStatus}>{collaboration.status}</span>
            <span className={styles.projectPriority}>{collaboration.priority} priority</span>
          </div>
          
          <h1 className={styles.detailTitle}>{collaboration.title}</h1>
          
          {collaboration.subtitle && (
            <p className={styles.detailSubtitle}>{collaboration.subtitle}</p>
          )}
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailMain}>
            <h2>About This Collaboration</h2>
            <p className={styles.detailDescription}>{collaboration.description}</p>

            {collaboration.deliverables.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Deliverables</h3>
                <ul className={styles.deliverablesList}>
                  {collaboration.deliverables.map((deliverable, index) => (
                    <li key={index}>{deliverable}</li>
                  ))}
                </ul>
              </div>
            )}

            {collaboration.terms && (
              <div className={styles.detailSection}>
                <h3>Terms</h3>
                <p>{collaboration.terms}</p>
              </div>
            )}

            {collaboration.tags.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Tags</h3>
                <div className={styles.projectTags}>
                  {collaboration.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.detailSidebar}>
            <div className={styles.sidebarSection}>
              <h4>Partner</h4>
              <p><strong>{collaboration.partner.name}</strong></p>
              {collaboration.partner.contact && (
                <p>Contact: {collaboration.partner.contact}</p>
              )}
              {collaboration.partner.website && (
                <p>
                  <a href={collaboration.partner.website} target="_blank" rel="noopener noreferrer">
                    Visit Website →
                  </a>
                </p>
              )}
            </div>

            {(collaboration.startDate || collaboration.endDate) && (
              <div className={styles.sidebarSection}>
                <h4>Timeline</h4>
                {collaboration.startDate && (
                  <p>
                    <strong>Start:</strong>{' '}
                    {new Date(collaboration.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
                {collaboration.endDate && (
                  <p>
                    <strong>End:</strong>{' '}
                    {new Date(collaboration.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            )}

            <div className={styles.sidebarSection}>
              <h4>Type</h4>
              <p>{collaboration.type}</p>
            </div>

            <div className={styles.sidebarSection}>
              <h4>Status</h4>
              <p className={styles.statusBadge}>{collaboration.status}</p>
            </div>

            <div className={styles.sidebarSection}>
              <h4>Priority</h4>
              <p>{collaboration.priority}</p>
            </div>

            {collaboration.budget && collaboration.budget > 0 && (
              <div className={styles.sidebarSection}>
                <h4>Budget</h4>
                <p>${collaboration.budget.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
