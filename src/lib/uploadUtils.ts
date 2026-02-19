// Upload utility functions for handling image uploads with post-specific folders

export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
  folderPath?: string
}

export interface PostFolder {
  postId: string
  folderPath: string
  files: {
    cover?: string
    images: string[]
  }
}

// Create a folder for a new post
export function createPostFolder(postTitle: string): string {
  // Generate folder name from post title and timestamp
  const timestamp = Date.now()
  const sanitizedTitle = postTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50) // Limit length
  
  return `post-${timestamp}-${sanitizedTitle}`
}

// Generate numbered filename based on position
export function generateNumberedFilename(originalName: string, position: number): string {
  const extension = originalName.split('.').pop()
  return `${position.toString().padStart(2, '0')}.${extension}`
}

// Upload a file to a specific post folder
export async function uploadFileToPostFolder(
  file: File, 
  folderName: string, 
  position: number
): Promise<UploadResult> {
  try {
    const numberedFilename = generateNumberedFilename(file.name, position)
    const folderPath = `posts/${folderName}`
    const fullPath = `${folderPath}/${numberedFilename}`
    
    // TODO: Enable when server upload is ready
    /*
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folderPath', folderPath)
    formData.append('filename', numberedFilename)
    
    const response = await fetch('/api/upload/post-folder', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Upload failed' }
    }
    
    const result = await response.json()
    return {
      success: true,
      url: result.url,
      filename: numberedFilename,
      folderPath: folderPath
    }
    */
    
    // For now, return a temporary URL with the expected path structure
    const tempUrl = URL.createObjectURL(file)
    return {
      success: true,
      url: tempUrl,
      filename: numberedFilename,
      folderPath: folderPath
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Upload failed'
    }
  }
}

// Upload a single file to the server (legacy function for backward compatibility)
export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    // TODO: Enable when server upload is ready
    /*
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Upload failed' }
    }
    
    const result = await response.json()
    return {
      success: true,
      url: result.url,
      filename: result.filename
    }
    */
    
    // For now, return a temporary URL for preview
    const tempUrl = URL.createObjectURL(file)
    return {
      success: true,
      url: tempUrl,
      filename: file.name
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Upload failed'
    }
  }
}

// Upload multiple files to a post folder with sequential numbering
export async function uploadFilesToPostFolder(
  files: File[], 
  folderName: string, 
  startPosition: number = 1
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const position = startPosition + i
    const result = await uploadFileToPostFolder(files[i], folderName, position)
    results.push(result)
  }
  
  return results
}

// Create post folder structure
export function createPostFolderStructure(postTitle: string): PostFolder {
  const folderName = createPostFolder(postTitle)
  const folderPath = `posts/${folderName}`
  
  return {
    postId: folderName,
    folderPath: folderPath,
    files: {
      images: []
    }
  }
}

// Upload multiple files
export async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  const results = await Promise.all(files.map(file => uploadFile(file)))
  return results
}

// Validate file before upload
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 50 * 1024 * 1024 // 50MB (will be compressed to max 5MB at 4K resolution)
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.'
    }
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File is too large. Please select an image smaller than 50MB.'
    }
  }
  
  return { valid: true }
}

// Clean up temporary URLs
export function cleanupTempUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// Generate a unique filename
export function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}

// Check if URL is a temporary blob URL
export function isTempUrl(url: string): boolean {
  return url.startsWith('blob:')
}

// Convert file to base64 (alternative storage method)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}