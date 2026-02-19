// Gallery-specific Repository Implementation

import { 
  GalleryCollection, 
  GalleryImage,
  GalleryQueryOptions, 
  ValidationSchema,
  APIResponse
} from './schema'
import { BaseRepository, LocalStorageAdapter } from './repository'

export class GalleryRepository extends BaseRepository<GalleryCollection> {
  protected entityName = 'GalleryCollection'
  protected storage = new LocalStorageAdapter<GalleryCollection>('galleryCollections')

  protected validationSchema: ValidationSchema = {
    entity: 'GalleryCollection',
    rules: [
      {
        field: 'name',
        type: 'required',
        message: 'Collection name is required'
      },
      {
        field: 'name',
        type: 'minLength',
        value: 2,
        message: 'Collection name must be at least 2 characters long'
      },
      {
        field: 'name',
        type: 'maxLength',
        value: 100,
        message: 'Collection name must not exceed 100 characters'
      },
      {
        field: 'coverImage',
        type: 'required',
        message: 'Cover image is required'
      },
      {
        field: 'coverImage',
        type: 'url',
        message: 'Cover image must be a valid URL'
      }
    ]
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description', 'category']
  }

  // Gallery-specific query methods
  async findByCategory(category: string, options: GalleryQueryOptions = {}): Promise<APIResponse<GalleryCollection[]>> {
    return this.findAll({
      ...options,
      filters: { ...options.filters, category }
    })
  }

  // Find collections by image tag (not collection tag - collections don't have tags)
  async findByTag(tag: string, options: GalleryQueryOptions = {}): Promise<APIResponse<GalleryCollection[]>> {
    const data = await this.storage.getAll()
    const filtered = data.filter(collection => 
      collection.images.some(image => image.tags.includes(tag))
    )
    
    return {
      success: true,
      data: filtered
    }
  }

  async findPublicCollections(options: GalleryQueryOptions = {}): Promise<APIResponse<GalleryCollection[]>> {
    return this.findAll({
      ...options,
      filters: { ...options.filters, isPublic: true }
    })
  }

  async getCollectionImages(collectionId: number): Promise<APIResponse<GalleryImage[]>> {
    const collectionResult = await this.findById(collectionId)
    if (!collectionResult.success || !collectionResult.data) {
      return { success: false, error: 'Collection not found' }
    }

    const images = collectionResult.data.images.sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      success: true,
      data: images
    }
  }

  async addImageToCollection(collectionId: number, image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<GalleryCollection>> {
    const collectionResult = await this.findById(collectionId)
    if (!collectionResult.success || !collectionResult.data) {
      return { success: false, error: 'Collection not found' }
    }

    const collection = collectionResult.data
    const newImage: GalleryImage = {
      ...image,
      id: Math.max(...collection.images.map(img => img.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      sortOrder: image.sortOrder || collection.images.length
    }

    collection.images.push(newImage)
    return this.update(collectionId, collection)
  }

  async removeImageFromCollection(collectionId: number, imageId: number): Promise<APIResponse<GalleryCollection>> {
    const collectionResult = await this.findById(collectionId)
    if (!collectionResult.success || !collectionResult.data) {
      return { success: false, error: 'Collection not found' }
    }

    const collection = collectionResult.data
    collection.images = collection.images.filter(img => img.id !== imageId)
    
    // Reorder remaining images
    collection.images.forEach((img, index) => {
      img.sortOrder = index
    })

    return this.update(collectionId, collection)
  }

  async updateImageOrder(collectionId: number, imageOrders: { id: number; sortOrder: number }[]): Promise<APIResponse<GalleryCollection>> {
    const collectionResult = await this.findById(collectionId)
    if (!collectionResult.success || !collectionResult.data) {
      return { success: false, error: 'Collection not found' }
    }

    const collection = collectionResult.data
    
    // Update sort orders
    imageOrders.forEach(order => {
      const image = collection.images.find(img => img.id === order.id)
      if (image) {
        image.sortOrder = order.sortOrder
      }
    })

    // Sort images by new order
    collection.images.sort((a, b) => a.sortOrder - b.sortOrder)

    return this.update(collectionId, collection)
  }

  async getCategories(): Promise<string[]> {
    const data = await this.storage.getAll()
    const categories = [...new Set(data.map(collection => collection.category).filter(Boolean))]
    return categories.sort()
  }

  // Get all unique tags from images across all collections (collections don't have tags)
  async getTags(): Promise<string[]> {
    const data = await this.storage.getAll()
    const imageTags = data.flatMap(collection => 
      collection.images.flatMap(image => image.tags)
    )
    return [...new Set(imageTags)].sort()
  }

  // Alias for getTags (same thing - only images have tags)
  async getAllImageTags(): Promise<string[]> {
    return this.getTags()
  }

  // Find collections that contain images with a specific tag
  async findByImageTag(tag: string, options: GalleryQueryOptions = {}): Promise<APIResponse<GalleryCollection[]>> {
    const data = await this.storage.getAll()
    const filtered = data.filter(collection => 
      collection.images.some(image => image.tags.includes(tag))
    )
    
    return {
      success: true,
      data: filtered
    }
  }

  // Get all images across all collections that have a specific tag
  async findImagesByTag(tag: string): Promise<APIResponse<{
    collectionId: number
    collectionName: string
    image: GalleryImage
  }[]>> {
    const data = await this.storage.getAll()
    const results: {
      collectionId: number
      collectionName: string
      image: GalleryImage
    }[] = []

    data.forEach(collection => {
      collection.images
        .filter(image => image.tags.includes(tag))
        .forEach(image => {
          results.push({
            collectionId: collection.id!,
            collectionName: collection.name,
            image
          })
        })
    })

    return {
      success: true,
      data: results
    }
  }

  // Get tag statistics from images
  async getImageTagStats(): Promise<Record<string, number>> {
    const data = await this.storage.getAll()
    const stats: Record<string, number> = {}
    
    data.forEach(collection => {
      collection.images.forEach(image => {
        image.tags.forEach(tag => {
          stats[tag] = (stats[tag] || 0) + 1
        })
      })
    })
    
    return stats
  }

  async getCategoryStats(): Promise<Record<string, number>> {
    const data = await this.storage.getAll()
    const stats: Record<string, number> = {}
    
    data.forEach(collection => {
      if (collection.category) {
        stats[collection.category] = (stats[collection.category] || 0) + 1
      }
    })
    
    return stats
  }

  // Removed: Collections don't have tags anymore - only images have tags
  // Use getImageTagStats() instead
  async getTagStats(): Promise<Record<string, number>> {
    return this.getImageTagStats()
  }

  async getCollectionStats(collectionId: number): Promise<APIResponse<{
    totalImages: number
    totalSize: number
    averageSize: number
    imageTypes: Record<string, number>
    dimensions: { width: number; height: number }[]
  }>> {
    const collectionResult = await this.findById(collectionId)
    if (!collectionResult.success || !collectionResult.data) {
      return { success: false, error: 'Collection not found' }
    }

    const collection = collectionResult.data
    const images = collection.images

    const totalImages = images.length
    const totalSize = images.reduce((sum, img) => sum + (img.metadata?.fileSize || 0), 0)
    const averageSize = totalImages > 0 ? totalSize / totalImages : 0

    const imageTypes: Record<string, number> = {}
    images.forEach(img => {
      const type = img.metadata?.mimeType || 'unknown'
      imageTypes[type] = (imageTypes[type] || 0) + 1
    })

    const dimensions = images.map(img => ({
      width: img.dimensions.width,
      height: img.dimensions.height
    }))

    return {
      success: true,
      data: {
        totalImages,
        totalSize,
        averageSize,
        imageTypes,
        dimensions
      }
    }
  }

  async searchImages(query: string, collectionId?: number): Promise<APIResponse<GalleryImage[]>> {
    const data = await this.storage.getAll()
    let allImages: GalleryImage[] = []

    if (collectionId) {
      const collection = data.find(c => c.id === collectionId)
      if (collection) {
        allImages = collection.images
      }
    } else {
      allImages = data.flatMap(collection => collection.images)
    }

    const lowerQuery = query.toLowerCase()
    const filtered = allImages.filter(image => 
      image.alt.toLowerCase().includes(lowerQuery) ||
      (image.caption && image.caption.toLowerCase().includes(lowerQuery)) ||
      (image.description && image.description.toLowerCase().includes(lowerQuery)) ||
      image.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )

    return {
      success: true,
      data: filtered
    }
  }

  async getFeaturedCollections(limit: number = 6): Promise<APIResponse<GalleryCollection[]>> {
    return this.findAll({
      limit,
      sortBy: 'sortOrder',
      sortOrder: 'asc',
      filters: { isPublic: true }
    })
  }

  async getRecentCollections(limit: number = 10): Promise<APIResponse<GalleryCollection[]>> {
    return this.findAll({
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      filters: { isPublic: true }
    })
  }

  // Bulk operations
  async bulkUpdateVisibility(ids: number[], isPublic: boolean): Promise<APIResponse<boolean>> {
    try {
      for (const id of ids) {
        await this.update(id, { isPublic })
      }
      return {
        success: true,
        data: true,
        message: `Updated visibility for ${ids.length} collections`
      }
    } catch (error) {
      return {
        success: false,
        error: `Bulk update failed: ${error}`
      }
    }
  }

  async bulkUpdateCategory(ids: number[], category: string): Promise<APIResponse<boolean>> {
    try {
      for (const id of ids) {
        await this.update(id, { category })
      }
      return {
        success: true,
        data: true,
        message: `Updated category for ${ids.length} collections`
      }
    } catch (error) {
      return {
        success: false,
        error: `Bulk update failed: ${error}`
      }
    }
  }

  // Override create to add default values
  async create(entity: Omit<GalleryCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<GalleryCollection>> {
    const collection = {
      ...entity,
      images: entity.images || [],
      isPublic: entity.isPublic !== undefined ? entity.isPublic : true,
      sortOrder: entity.sortOrder || 0,
      seo: entity.seo || {
        keywords: [], // Collections don't have tags - use image tags instead
        metaTitle: entity.name,
        metaDescription: entity.description || entity.name
      }
    } as Omit<GalleryCollection, 'id' | 'createdAt' | 'updatedAt'>

    return super.create(collection)
  }
}