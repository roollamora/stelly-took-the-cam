import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/sqlite'

// GET /api/blog/[id] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase()
    
    // Try to find by slug first, then by ID
    let post: any
    if (isNaN(Number(params.id))) {
      // It's a slug
      post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(params.id)
    } else {
      // It's an ID
      post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(params.id)
    }
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      images: JSON.parse(post.images || '[]'),
      seo: JSON.parse(post.seo || '{}'),
      isActive: Boolean(post.isActive)
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase()
    const data = await request.json()
    
    const stmt = db.prepare(`
      UPDATE blog_posts SET
        title = ?,
        subtitle = ?,
        subtitlePosition = ?,
        content = ?,
        excerpt = ?,
        coverImage = ?,
        category = ?,
        tags = ?,
        author = ?,
        publishedAt = ?,
        status = ?,
        viewCount = ?,
        likes = ?,
        images = ?,
        seo = ?,
        isActive = ?,
        slug = ?,
        folderPath = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(
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
      data.folderPath || '',
      params.id
    )
    
    const updatedPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(params.id) as any
    
    return NextResponse.json({
      ...updatedPost,
      tags: JSON.parse(updatedPost.tags || '[]'),
      images: JSON.parse(updatedPost.images || '[]'),
      seo: JSON.parse(updatedPost.seo || '{}')
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase()
    const stmt = db.prepare('DELETE FROM blog_posts WHERE id = ?')
    stmt.run(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
