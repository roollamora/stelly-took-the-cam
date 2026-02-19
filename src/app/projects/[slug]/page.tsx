'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from '../page.module.css'

interface Project {
  id: number
  title: string
  subtitle?: string
  description: string
  category: string
  tags: string[]
  coverImage?: string
  status: string
  startDate?: string
  endDate?: string
  client?: string
  technologies: string[]
  links: any[]
  team: any[]
  budget?: number
  priority: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function ProjectDetail() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setProject(data[0])
          } else {
            setError('Project not found')
          }
        } else {
          setError('Failed to load project')
        }
      } catch (error) {
        console.error('Error loading project:', error)
        setError('Error loading project')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadProject()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <div className={styles.loading}>Loading project...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <h1 className={styles.title}>Project Not Found</h1>
          <p>{error || 'The project you are looking for does not exist.'}</p>
          <Link href="/projects" className={styles.backLink}>← Back to Projects</Link>
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
          <Link href="/projects" className={styles.backLink}>← Back to Projects</Link>
          
          {project.coverImage && (
            <img 
              src={project.coverImage} 
              alt={project.title}
              className={styles.detailCoverImage}
            />
          )}
          
          <div className={styles.detailMeta}>
            <span className={styles.projectCategory}>{project.category}</span>
            <span className={styles.projectStatus}>{project.status}</span>
            <span className={styles.projectPriority}>{project.priority} priority</span>
          </div>
          
          <h1 className={styles.detailTitle}>{project.title}</h1>
          
          {project.subtitle && (
            <p className={styles.detailSubtitle}>{project.subtitle}</p>
          )}
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailMain}>
            <h2>About This Project</h2>
            <p className={styles.detailDescription}>{project.description}</p>

            {project.technologies.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Technologies Used</h3>
                <div className={styles.techList}>
                  {project.technologies.map(tech => (
                    <span key={tech} className={styles.techBadge}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {project.tags.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Tags</h3>
                <div className={styles.projectTags}>
                  {project.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.detailSidebar}>
            {project.client && (
              <div className={styles.sidebarSection}>
                <h4>Client</h4>
                <p>{project.client}</p>
              </div>
            )}

            {(project.startDate || project.endDate) && (
              <div className={styles.sidebarSection}>
                <h4>Timeline</h4>
                {project.startDate && (
                  <p>
                    <strong>Start:</strong>{' '}
                    {new Date(project.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
                {project.endDate && (
                  <p>
                    <strong>End:</strong>{' '}
                    {new Date(project.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            )}

            <div className={styles.sidebarSection}>
              <h4>Status</h4>
              <p className={styles.statusBadge}>{project.status}</p>
            </div>

            <div className={styles.sidebarSection}>
              <h4>Priority</h4>
              <p>{project.priority}</p>
            </div>

            {project.links && project.links.length > 0 && (
              <div className={styles.sidebarSection}>
                <h4>Links</h4>
                <ul className={styles.linksList}>
                  {project.links.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
