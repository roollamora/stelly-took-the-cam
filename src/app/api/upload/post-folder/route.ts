import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Create post folder and upload file with numbered naming
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderPath = formData.get('folderPath') as string
    const filename = formData.get('filename') as string
    
    if (!file || !folderPath || !filename) {
      return NextResponse.json({ 
        error: 'Missing required fields: file, folderPath, or filename' 
      }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }
    
    // Create directory structure
    const fullFolderPath = path.join(process.cwd(), 'public', folderPath)
    await fs.mkdir(fullFolderPath, { recursive: true })
    
    // Save file with numbered name
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(fullFolderPath, filename)
    await fs.writeFile(filePath, buffer)
    
    // Return public URL
    const publicUrl = `/${folderPath}/${filename}`
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      folderPath: folderPath,
      originalName: file.name,
      size: file.size,
      type: file.type
    })
    
  } catch (error) {
    console.error('Post folder upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// List files in a post folder
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderPath = searchParams.get('folderPath')
    
    if (!folderPath) {
      return NextResponse.json({ error: 'No folder path provided' }, { status: 400 })
    }
    
    const fullFolderPath = path.join(process.cwd(), 'public', folderPath)
    
    try {
      const files = await fs.readdir(fullFolderPath)
      const fileList = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort() // This will sort numerically due to padded naming (00.jpg, 01.jpg, etc.)
        .map(file => ({
          filename: file,
          url: `/${folderPath}/${file}`,
          position: parseInt(file.split('.')[0])
        }))
      
      return NextResponse.json({
        success: true,
        folderPath: folderPath,
        files: fileList
      })
    } catch (error) {
      // Folder doesn't exist
      return NextResponse.json({
        success: true,
        folderPath: folderPath,
        files: []
      })
    }
    
  } catch (error) {
    console.error('Error listing post folder:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// Delete a post folder and all its contents
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderPath = searchParams.get('folderPath')
    
    if (!folderPath) {
      return NextResponse.json({ error: 'No folder path provided' }, { status: 400 })
    }
    
    const fullFolderPath = path.join(process.cwd(), 'public', folderPath)
    
    try {
      await fs.rm(fullFolderPath, { recursive: true, force: true })
      return NextResponse.json({ success: true })
    } catch (error) {
      // Folder might not exist, which is fine
      return NextResponse.json({ success: true })
    }
    
  } catch (error) {
    console.error('Delete post folder error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}