'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects?limit=50&sortBy=createdAt&sortOrder=desc')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter)

  const categories = [...new Set(projects.map(p => p.category))]
  const statuses = [...new Set(projects.map(p => p.status))]

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>Creative works and collaborations</p>
        
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
          <div className={styles.loading}>Loading projects...</div>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredProjects.map(project => (
              <Link 
                key={project.id} 
                href={`/projects/${project.slug}`}
                className={styles.projectCard}
              >
                {project.coverImage && (
                  <img 
                    src={project.coverImage} 
                    alt={project.title}
                    className={styles.projectImage}
                  />
                )}
                <div className={styles.projectContent}>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectCategory}>{project.category}</span>
                    <span className={styles.projectStatus}>{project.status}</span>
                  </div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  {project.subtitle && (
                    <p className={styles.projectSubtitle}>{project.subtitle}</p>
                  )}
                  <p className={styles.projectDescription}>{project.description}</p>
                  
                  {project.tags.length > 0 && (
                    <div className={styles.projectTags}>
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.projectDate}>
                    {new Date(project.createdAt).toLocaleDateString('en-US', { 
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
