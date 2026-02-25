import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

interface RecentContentItem {
  type: 'blog' | 'gallery' | 'project' | 'collaboration'
  id: number
  title: string
  subtitle?: string
  category: string
  image: string
  description?: string
  date: string
  link: string
  status?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const types = searchParams.get('types')?.split(',') || ['blog', 'gallery', 'project', 'collaboration']

    const db = getDatabase()
    const recentItems: RecentContentItem[] = []

    // Fetch blog posts
    if (types.includes('blog')) {
      const blogPosts = db.prepare(`
        SELECT id, title, subtitle, category, coverImage, excerpt, publishedAt, slug
        FROM blog_posts 
        WHERE status = 'published' AND isActive = 1
        ORDER BY publishedAt DESC 
        LIMIT ?
      `).all(Math.ceil(limit / types.length))

      blogPosts.forEach((post: any) => {
        recentItems.push({
          type: 'blog',
          id: post.id,
          title: post.title,
          subtitle: post.subtitle,
          category: post.category,
          image: post.coverImage || '/filler/BTC_1.6.jpeg',
          description: post.excerpt,
          date: post.publishedAt || post.createdAt,
          link: `/blog/${post.slug || post.id}`,
          status: 'published'
        })
      })
    }

    // Fetch gallery collections
    if (types.includes('gallery')) {
      const collections = db.prepare(`
        SELECT id, name, description, category, coverImage, createdAt, slug
        FROM collections 
        WHERE isPublic = 1
        ORDER BY createdAt DESC 
        LIMIT ?
      `).all(Math.ceil(limit / types.length))

      collections.forEach((collection: any) => {
        recentItems.push({
          type: 'gallery',
          id: collection.id,
          title: collection.name,
          category: collection.category,
          image: collection.coverImage,
          description: collection.description,
          date: collection.createdAt,
          link: `/gallery/${collection.id}`
        })
      })
    }

    // Fetch projects
    if (types.includes('project')) {
      const projects = db.prepare(`
        SELECT id, title, subtitle, category, coverImage, description, createdAt, slug, status
        FROM projects 
        WHERE isActive = 1
        ORDER BY createdAt DESC 
        LIMIT ?
      `).all(Math.ceil(limit / types.length))

      projects.forEach((project: any) => {
        recentItems.push({
          type: 'project',
          id: project.id,
          title: project.title,
          subtitle: project.subtitle,
          category: project.category,
          image: project.coverImage || '/filler/DETAILS_1.0.jpeg',
          description: project.description,
          date: project.createdAt,
          link: `/projects/${project.slug || project.id}`,
          status: project.status
        })
      })
    }

    // Fetch collaborations
    if (types.includes('collaboration')) {
      const collaborations = db.prepare(`
        SELECT id, title, subtitle, type as category, coverImage, description, createdAt, slug, status
        FROM collaborations 
        WHERE isActive = 1
        ORDER BY createdAt DESC 
        LIMIT ?
      `).all(Math.ceil(limit / types.length))

      collaborations.forEach((collaboration: any) => {
        recentItems.push({
          type: 'collaboration',
          id: collaboration.id,
          title: collaboration.title,
          subtitle: collaboration.subtitle,
          category: collaboration.category,
          image: collaboration.coverImage || '/filler/DUO_1.0.jpeg',
          description: collaboration.description,
          date: collaboration.createdAt,
          link: `/collaboration/${collaboration.slug || collaboration.id}`,
          status: collaboration.status
        })
      })
    }

    // Sort all items by date (most recent first) and limit
    const sortedItems = recentItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)

    return NextResponse.json(sortedItems)
  } catch (error) {
    console.error('Error fetching recent content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent content' },
      { status: 500 }
    )
  }
}