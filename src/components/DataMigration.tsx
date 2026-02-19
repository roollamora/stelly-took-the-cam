'use client'

import { useState } from 'react'
import { migrateLegacyDataToDatabase } from '../lib/blogData'
import { dataService } from '../lib/database/dataService'
import { seedDatabase } from '../lib/database/seedData'

interface MigrationResult {
  success: boolean
  migratedCount: number
  errors: string[]
}

export default function DataMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)
  const [stats, setStats] = useState<any>(null)

  const handleMigration = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const migrationResult = await migrateLegacyDataToDatabase()
      setResult(migrationResult)
      
      // Get updated stats
      const contentStats = await dataService.getContentStats()
      setStats(contentStats)
    } catch (error) {
      setResult({
        success: false,
        migratedCount: 0,
        errors: [`Migration failed: ${error}`]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const contentStats = await dataService.getContentStats()
      setStats(contentStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const exportData = async () => {
    try {
      const backup = await dataService.backupData()
      const blob = new Blob([backup], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert(`Export failed: ${error}`)
    }
  }

  const seedSampleData = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const seedResult = await seedDatabase()
      
      // Count what was seeded
      const stats = await dataService.getContentStats()
      
      setResult({
        success: true,
        migratedCount: stats.totalBlogPosts + stats.totalGalleryCollections,
        errors: []
      })
      
      setStats(stats)
      alert(`Successfully seeded ${stats.totalBlogPosts} blog posts and ${stats.totalGalleryCollections} gallery collections!`)
    } catch (error) {
      setResult({
        success: false,
        migratedCount: 0,
        errors: [`Seeding failed: ${error}`]
      })
      alert(`Seeding failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }
  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all database data? This cannot be undone.')) {
      return
    }
    
    try {
      await dataService.clearAllData()
      setStats(null)
      alert('Database cleared successfully')
    } catch (error) {
      alert(`Clear failed: ${error}`)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '1rem 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Database Migration & Management</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={loadStats}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load Stats
        </button>
        
        <button 
          onClick={handleMigration}
          disabled={isLoading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: isLoading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Migrating...' : 'Migrate Legacy Data'}
        </button>
        
        <button 
          onClick={seedSampleData}
          disabled={isLoading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: isLoading ? '#ccc' : '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Seeding...' : 'Seed Sample Data'}
        </button>
        
        <button 
          onClick={exportData}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export Backup
        </button>
        
        <button 
          onClick={clearDatabase}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Database
        </button>
      </div>

      {stats && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e9ecef', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <h4>Database Statistics</h4>
          <ul>
            <li>Total Blog Posts: {stats.totalBlogPosts}</li>
            <li>Total Gallery Collections: {stats.totalGalleryCollections}</li>
            <li>Total Images: {stats.totalImages}</li>
            <li>Blog Categories: {stats.blogCategories}</li>
            <li>Gallery Categories: {stats.galleryCategories}</li>
            <li>Total Tags: {stats.totalTags}</li>
          </ul>
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: result.success ? '#155724' : '#721c24'
        }}>
          <h4>Migration Result</h4>
          <p>Status: {result.success ? 'Success' : 'Failed'}</p>
          <p>Migrated Posts: {result.migratedCount}</p>
          
          {result.errors.length > 0 && (
            <div>
              <h5>Errors:</h5>
              <ul>
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Migration Guide:</strong>
        <ol>
          <li>Click "Load Stats" to see current database status</li>
          <li>Click "Migrate Legacy Data" to move localStorage data to the new database system</li>
          <li>Click "Seed Sample Data" to populate the database with sample blog posts and gallery collections</li>
          <li>Use "Export Backup" to create a backup file before making changes</li>
          <li>The system maintains backward compatibility with localStorage</li>
          <li>All data operations use the new repository pattern with validation and error handling</li>
        </ol>
      </div>
    </div>
  )
}