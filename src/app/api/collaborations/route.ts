import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database/sqlite'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const db = getDatabase()
    
    let query = `
      SELECT 
        id, title, subtitle, description, type, status, partner, coverImage,
        startDate, endDate, deliverables, terms, budget, priority, tags,
        slug, createdAt, updatedAt
      FROM collaborations 
      WHERE isActive = 1
    `
    const params: any[] = []

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }

    if (slug) {
      query += ' AND slug = ?'
      params.push(slug)
    }

    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`
    
    if (limit > 0 && !slug) {
      query += ' LIMIT ?'
      params.push(limit)
    }

    const collaborations = db.prepare(query).all(...params)

    // Parse JSON fields and get images for each collaboration
    const collaborationsWithImages = collaborations.map((collaboration: any) => {
      // Get collaboration images
      const images = db.prepare(`
        SELECT id, url, alt, caption, position, type
        FROM collaboration_images 
        WHERE collaborationId = ? 
        ORDER BY position ASC
      `).all(collaboration.id)

      return {
        ...collaboration,
        partner: collaboration.partner ? JSON.parse(collaboration.partner) : null,
        deliverables: collaboration.deliverables ? JSON.parse(collaboration.deliverables) : [],
        tags: collaboration.tags ? JSON.parse(collaboration.tags) : [],
        images
      }
    })

    return NextResponse.json(collaborationsWithImages)
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collaborations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = getDatabase()

    const result = db.prepare(`
      INSERT INTO collaborations (
        title, subtitle, description, type, status, partner, coverImage,
        startDate, endDate, deliverables, terms, budget, priority, tags, slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.subtitle || null,
      data.description,
      data.type || 'partnership',
      data.status || 'inquiry',
      JSON.stringify(data.partner || {}),
      data.coverImage || null,
      data.startDate || null,
      data.endDate || null,
      JSON.stringify(data.deliverables || []),
      data.terms || null,
      data.budget || null,
      data.priority || 'medium',
      JSON.stringify(data.tags || []),
      data.slug
    )

    const collaborationId = result.lastInsertRowid

    // Insert collaboration images if provided
    if (data.images && data.images.length > 0) {
      const insertImage = db.prepare(`
        INSERT INTO collaboration_images (collaborationId, url, alt, caption, position, type)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      data.images.forEach((image: any, index: number) => {
        insertImage.run(
          collaborationId,
          image.url,
          image.alt,
          image.caption || null,
          image.position || index,
          image.type || 'process'
        )
      })
    }

    // Fetch the created collaboration
    const newCollaboration = db.prepare('SELECT * FROM collaborations WHERE id = ?').get(collaborationId) as any
    const images = db.prepare('SELECT * FROM collaboration_images WHERE collaborationId = ? ORDER BY position ASC').all(collaborationId)

    if (!newCollaboration) {
      return NextResponse.json({ error: 'Failed to retrieve created collaboration' }, { status: 500 })
    }

    const collaborationWithImages = {
      ...newCollaboration,
      partner: newCollaboration.partner ? JSON.parse(newCollaboration.partner) : null,
      deliverables: newCollaboration.deliverables ? JSON.parse(newCollaboration.deliverables) : [],
      tags: newCollaboration.tags ? JSON.parse(newCollaboration.tags) : [],
      images
    }

    return NextResponse.json(collaborationWithImages, { status: 201 })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json(
      { error: 'Failed to create collaboration' },
      { status: 500 }
    )
  }
}