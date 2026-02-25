import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const db = getDatabase()
    
    let query = `
      SELECT 
        id, title, subtitle, description, category, tags, coverImage, 
        status, startDate, endDate, client, technologies, links, team, 
        budget, priority, slug, createdAt, updatedAt
      FROM projects 
      WHERE isActive = 1
    `
    const params: any[] = []

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (category) {
      query += ' AND category = ?'
      params.push(category)
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

    const projects = db.prepare(query).all(...params)

    // Parse JSON fields and get images for each project
    const projectsWithImages = projects.map((project: any) => {
      // Get project images
      const images = db.prepare(`
        SELECT id, url, alt, caption, position, type
        FROM project_images 
        WHERE projectId = ? 
        ORDER BY position ASC
      `).all(project.id)

      return {
        ...project,
        tags: project.tags ? JSON.parse(project.tags) : [],
        technologies: project.technologies ? JSON.parse(project.technologies) : [],
        links: project.links ? JSON.parse(project.links) : [],
        team: project.team ? JSON.parse(project.team) : [],
        images
      }
    })

    return NextResponse.json(projectsWithImages)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = getDatabase()

    const result = db.prepare(`
      INSERT INTO projects (
        title, subtitle, description, category, tags, coverImage, 
        status, startDate, endDate, client, technologies, links, 
        team, budget, priority, slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.subtitle || null,
      data.description,
      data.category,
      JSON.stringify(data.tags || []),
      data.coverImage || null,
      data.status || 'planning',
      data.startDate || null,
      data.endDate || null,
      data.client || null,
      JSON.stringify(data.technologies || []),
      JSON.stringify(data.links || []),
      JSON.stringify(data.team || []),
      data.budget || null,
      data.priority || 'medium',
      data.slug
    )

    const projectId = result.lastInsertRowid

    // Insert project images if provided
    if (data.images && data.images.length > 0) {
      const insertImage = db.prepare(`
        INSERT INTO project_images (projectId, url, alt, caption, position, type)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      data.images.forEach((image: any, index: number) => {
        insertImage.run(
          projectId,
          image.url,
          image.alt,
          image.caption || null,
          image.position || index,
          image.type || 'gallery'
        )
      })
    }

    // Fetch the created project
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId) as any
    const images = db.prepare('SELECT * FROM project_images WHERE projectId = ? ORDER BY position ASC').all(projectId)

    if (!newProject) {
      return NextResponse.json({ error: 'Failed to retrieve created project' }, { status: 500 })
    }

    const projectWithImages = {
      ...newProject,
      tags: newProject.tags ? JSON.parse(newProject.tags) : [],
      technologies: newProject.technologies ? JSON.parse(newProject.technologies) : [],
      links: newProject.links ? JSON.parse(newProject.links) : [],
      team: newProject.team ? JSON.parse(newProject.team) : [],
      images
    }

    return NextResponse.json(projectWithImages, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}