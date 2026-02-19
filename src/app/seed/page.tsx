'use client'

import { useState } from 'react'
import { seedDatabase } from '../../lib/database/seedData'
import { dataService } from '../../lib/database/dataService'

export default function SeedPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSeed = async () => {
    setLoading(true)
    setStatus('Seeding database...')
    
    try {
      await seedDatabase()
      
      const stats = await dataService.getContentStats()
      setStatus(`✅ Success! Seeded ${stats.totalBlogPosts} blog posts and ${stats.totalGalleryCollections} gallery collections`)
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('Clear all data?')) return
    
    setLoading(true)
    setStatus('Clearing database...')
    
    try {
      await dataService.clearAllData()
      setStatus('✅ Database cleared')
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStats = async () => {
    setLoading(true)
    
    try {
      const stats = await dataService.getContentStats()
      setStatus(`
📊 Database Stats:
- Blog Posts: ${stats.totalBlogPosts}
- Gallery Collections: ${stats.totalGalleryCollections}
- Total Images: ${stats.totalImages}
      `)
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Database Seed Tool</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          onClick={handleSeed}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Seed Database
        </button>
        
        <button 
          onClick={handleStats}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Show Stats
        </button>
        
        <button 
          onClick={handleClear}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Clear Database
        </button>
      </div>
      
      {status && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f0f0f0',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {status}
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Quick Links:</h3>
        <ul>
          <li><a href="/gallery">Gallery</a></li>
          <li><a href="/gallery/1">Collection Detail (ID 1)</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </div>
    </div>
  )
}
