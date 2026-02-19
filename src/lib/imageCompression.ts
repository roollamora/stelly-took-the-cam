// Image Compression Utility
// Automatically compresses images to max 4K resolution (3840x2160)

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  originalDimensions: { width: number; height: number }
  compressedDimensions: { width: number; height: number }
  compressionRatio: number
  wasCompressed: boolean
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 3840,  // 4K width
  maxHeight: 2160, // 4K height
  quality: 0.9,    // 90% quality
  maxSizeMB: 5     // 5MB max file size
}

/**
 * Compress an image file to max 4K resolution
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onerror = () => reject(new Error('Failed to load image'))
      
      img.onload = () => {
        try {
          const originalWidth = img.width
          const originalHeight = img.height
          const originalSize = file.size
          
          // Calculate new dimensions while maintaining aspect ratio
          let newWidth = originalWidth
          let newHeight = originalHeight
          
          // Check if image exceeds max dimensions
          if (originalWidth > opts.maxWidth! || originalHeight > opts.maxHeight!) {
            const widthRatio = opts.maxWidth! / originalWidth
            const heightRatio = opts.maxHeight! / originalHeight
            const ratio = Math.min(widthRatio, heightRatio)
            
            newWidth = Math.round(originalWidth * ratio)
            newHeight = Math.round(originalHeight * ratio)
          }
          
          // Check if compression is needed
          const needsResize = newWidth !== originalWidth || newHeight !== originalHeight
          const needsQualityCompression = originalSize > (opts.maxSizeMB! * 1024 * 1024)
          
          if (!needsResize && !needsQualityCompression) {
            // No compression needed
            resolve({
              file,
              originalSize,
              compressedSize: originalSize,
              originalDimensions: { width: originalWidth, height: originalHeight },
              compressedDimensions: { width: originalWidth, height: originalHeight },
              compressionRatio: 1,
              wasCompressed: false
            })
            return
          }
          
          // Create canvas for compression
          const canvas = document.createElement('canvas')
          canvas.width = newWidth
          canvas.height = newHeight
          
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Draw resized image
          ctx.drawImage(img, 0, 0, newWidth, newHeight)
          
          // Convert to blob with quality compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }
              
              // Create new file from blob
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: file.type || 'image/jpeg',
                  lastModified: Date.now()
                }
              )
              
              const compressedSize = compressedFile.size
              const compressionRatio = originalSize / compressedSize
              
              resolve({
                file: compressedFile,
                originalSize,
                compressedSize,
                originalDimensions: { width: originalWidth, height: originalHeight },
                compressedDimensions: { width: newWidth, height: newHeight },
                compressionRatio,
                wasCompressed: true
              })
            },
            file.type || 'image/jpeg',
            opts.quality
          )
        } catch (error) {
          reject(error)
        }
      }
      
      img.src = e.target?.result as string
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []
  
  for (const file of files) {
    try {
      const result = await compressImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error)
      // Return original file if compression fails
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        originalDimensions: { width: 0, height: 0 },
        compressedDimensions: { width: 0, height: 0 },
        compressionRatio: 1,
        wasCompressed: false
      })
    }
  }
  
  return results
}

/**
 * Get image dimensions without loading the full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onerror = () => reject(new Error('Failed to load image'))
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        })
      }
      
      img.src = e.target?.result as string
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Check if image needs compression
 */
export async function needsCompression(
  file: File,
  options: CompressionOptions = {}
): Promise<boolean> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  try {
    const dimensions = await getImageDimensions(file)
    const exceedsSize = file.size > (opts.maxSizeMB! * 1024 * 1024)
    const exceedsDimensions = dimensions.width > opts.maxWidth! || dimensions.height > opts.maxHeight!
    
    return exceedsSize || exceedsDimensions
  } catch (error) {
    console.error('Error checking compression need:', error)
    return false
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.'
    }
  }
  
  // Check file size (max 50MB before compression)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 50MB.'
    }
  }
  
  return { valid: true }
}

/**
 * Compress image with progress callback
 */
export async function compressImageWithProgress(
  file: File,
  options: CompressionOptions = {},
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  if (onProgress) onProgress(0)
  
  const result = await compressImage(file, options)
  
  if (onProgress) onProgress(100)
  
  return result
}

/**
 * Batch compress images with progress
 */
export async function batchCompressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (onProgress) {
      onProgress(i, files.length, file.name)
    }
    
    try {
      const result = await compressImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error)
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        originalDimensions: { width: 0, height: 0 },
        compressedDimensions: { width: 0, height: 0 },
        compressionRatio: 1,
        wasCompressed: false
      })
    }
  }
  
  if (onProgress) {
    onProgress(files.length, files.length, 'Complete')
  }
  
  return results
}
