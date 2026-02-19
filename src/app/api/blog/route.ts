import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/sqlite'

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const author = searchParams.get('author')
    const limit = parseInt(searchParams.get('limit') || '100')
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    let query = `SELECT * FROM blog_posts WHERE status = ?`
    const params: any[] = [status]
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    if (author) {
      query += ' AND author = ?'
      params.push(author)
    }
    
    if (tag) {
      query += ' AND tags LIKE ?'
      params.push(`%"${tag}"%`)
    }
    
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`
    
    if (limit > 0) {
      query += ` LIMIT ${limit}`
    }
    
    const posts = db.prepare(query).all(...params)
    
    // Parse JSON fields
    const parsedPosts = posts.map((post: any) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      images: post.images ? JSON.parse(post.images) : [],
      seo: post.seo ? JSON.parse(post.seo) : null,
      isActive: Boolean(post.isActive)
    }))
    
    return NextResponse.json(parsedPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const db = getDatabase()
    const data = await request.json()
    
    const stmt = db.prepare(`
      INSERT INTO blog_posts (
        title, subtitle, subtitlePosition, content, excerpt, coverImage,
        category, tags, author, publishedAt, status, viewCount, likes,
        images, seo, isActive, slug, folderPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      data.title,
      data.subtitle || '',
      data.subtitlePosition || 'after',
      data.content,
      data.excerpt || '',
      data.coverImage || '',
      data.category,
      JSON.stringify(data.tags || []),
      data.author || 'Admin',
      data.publishedAt || new Date().toISOString(),
      data.status || 'draft',
      data.viewCount || 0,
      data.likes || 0,
      JSON.stringify(data.images || []),
      JSON.stringify(data.seo || {}),
      data.isActive !== false ? 1 : 0,
      data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      data.folderPath || ''
    )
    
    const newPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid) as any
    
    if (!newPost) {
      return NextResponse.json({ error: 'Failed to retrieve created post' }, { status: 500 })
    }
    
    return NextResponse.json({
      ...newPost,
      tags: JSON.parse(newPost.tags || '[]'),
      images: JSON.parse(newPost.images || '[]'),
      seo: JSON.parse(newPost.seo || '{}')
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
