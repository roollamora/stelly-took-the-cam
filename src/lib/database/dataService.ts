// Centralized Data Service
// This serves as the main interface for all data operations across the application

import { BlogRepository } from './blogRepository'
import { GalleryRepository } from './galleryRepository'
import { 
  BlogPost, 
  GalleryCollection, 
  APIResponse,
  BlogQueryOptions,
  GalleryQueryOptions
} from './schema'

// Singleton Data Service
class DataService {
  private static instance: DataService
  private blogRepo: BlogRepository
  private galleryRepo: GalleryRepository

  private constructor() {
    this.blogRepo = new BlogRepository()
    this.galleryRepo = new GalleryRepository()
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // Blog Operations
  async getBlogPosts(options?: BlogQueryOptions): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.findAll(options)
  }

  async getBlogPost(id: number): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.findById(id)
  }

  async getBlogPostBySlug(slug: string): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.findBySlug(slug)
  }

  async createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.create(post)
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.update(id, post)
  }

  async deleteBlogPost(id: number): Promise<APIResponse<boolean>> {
    return this.blogRepo.delete(id)
  }

  async getBlogPostsByCategory(category: string, options?: BlogQueryOptions): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.findByCategory(category, options)
  }

  async getBlogPostsByTag(tag: string, options?: BlogQueryOptions): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.findByTag(tag, options)
  }

  async getBlogPostsByAuthor(author: string, options?: BlogQueryOptions): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.findByAuthor(author, options)
  }

  async getPopularBlogPosts(limit?: number): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.getPopularPosts(limit)
  }

  async getRecentBlogPosts(limit?: number): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.getRecentPosts(limit)
  }

  async getRelatedBlogPosts(postId: number, limit?: number): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.getRelatedPosts(postId, limit)
  }

  async incrementBlogPostViews(id: number): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.incrementViewCount(id)
  }

  async likeBlogPost(id: number): Promise<APIResponse<BlogPost>> {
    return this.blogRepo.incrementLikes(id)
  }

  async searchBlogPosts(query: string, options?: BlogQueryOptions): Promise<APIResponse<BlogPost[]>> {
    return this.blogRepo.search(query, options)
  }

  async getBlogCategories(): Promise<string[]> {
    return this.blogRepo.getCategories()
  }

  async getBlogTags(): Promise<string[]> {
    return this.blogRepo.getTags()
  }

  async getBlogAuthors(): Promise<string[]> {
    return this.blogRepo.getAuthors()
  }

  async getBlogCategoryStats(): Promise<Record<string, number>> {
    return this.blogRepo.getCategoryStats()
  }

  async getBlogTagStats(): Promise<Record<string, number>> {
    return this.blogRepo.getTagStats()
  }

  async getBlogMonthlyStats(year: number): Promise<Record<string, number>> {
    return this.blogRepo.getMonthlyStats(year)
  }

  // Gallery Operations
  async getGalleryCollections(options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.findAll(options)
  }

  async getGalleryCollection(id: number): Promise<APIResponse<GalleryCollection>> {
    return this.galleryRepo.findById(id)
  }

  async getGalleryCollectionBySlug(slug: string): Promise<APIResponse<GalleryCollection>> {
    return this.galleryRepo.findBySlug(slug)
  }

  async createGalleryCollection(collection: Omit<GalleryCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<GalleryCollection>> {
    return this.galleryRepo.create(collection)
  }

  async updateGalleryCollection(id: number, collection: Partial<GalleryCollection>): Promise<APIResponse<GalleryCollection>> {
    return this.galleryRepo.update(id, collection)
  }

  async deleteGalleryCollection(id: number): Promise<APIResponse<boolean>> {
    return this.galleryRepo.delete(id)
  }

  async getGalleryCollectionsByCategory(category: string, options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.findByCategory(category, options)
  }

  async getGalleryCollectionsByTag(tag: string, options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.findByTag(tag, options)
  }

  async getPublicGalleryCollections(options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.findPublicCollections(options)
  }

  async getFeaturedGalleryCollections(limit?: number): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.getFeaturedCollections(limit)
  }

  async getRecentGalleryCollections(limit?: number): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.getRecentCollections(limit)
  }

  async searchGalleryCollections(query: string, options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.search(query, options)
  }

  async getGalleryCategories(): Promise<string[]> {
    return this.galleryRepo.getCategories()
  }

  async getGalleryTags(): Promise<string[]> {
    return this.galleryRepo.getTags()
  }

  async getGalleryCategoryStats(): Promise<Record<string, number>> {
    return this.galleryRepo.getCategoryStats()
  }

  async getGalleryTagStats(): Promise<Record<string, number>> {
    // Collections don't have tags - only images have tags
    return this.galleryRepo.getImageTagStats()
  }

  // Image tag operations
  async getAllImageTags(): Promise<string[]> {
    return this.galleryRepo.getAllImageTags()
  }

  async getGalleryCollectionsByImageTag(tag: string, options?: GalleryQueryOptions): Promise<APIResponse<GalleryCollection[]>> {
    return this.galleryRepo.findByImageTag(tag, options)
  }

  async getImagesByTag(tag: string): Promise<APIResponse<{
    collectionId: number
    collectionName: string
    image: any
  }[]>> {
    return this.galleryRepo.findImagesByTag(tag)
  }

  async getImageTagStats(): Promise<Record<string, number>> {
    return this.galleryRepo.getImageTagStats()
  }

  // Cross-content operations
  async globalSearch(query: string): Promise<{
    blogPosts: BlogPost[]
    galleryCollections: GalleryCollection[]
  }> {
    const [blogResults, galleryResults] = await Promise.all([
      this.searchBlogPosts(query),
      this.searchGalleryCollections(query)
    ])

    return {
      blogPosts: blogResults.data || [],
      galleryCollections: galleryResults.data || []
    }
  }

  // Get recent content from all sources (unified feed)
  async getRecentContent(limit: number = 10): Promise<{
    type: 'blog' | 'gallery' | 'project'
    id: number | string
    title: string
    subtitle?: string
    category: string
    image: string
    description?: string
    date: string
    link: string
  }[]> {
    const [blogPosts, galleryCollections] = await Promise.all([
      this.getBlogPosts({ sortBy: 'publishedAt', sortOrder: 'desc', limit: 50 }),
      this.getGalleryCollections({ sortBy: 'createdAt', sortOrder: 'desc', limit: 50 })
    ])

    const unifiedContent: {
      type: 'blog' | 'gallery' | 'project'
      id: number | string
      title: string
      subtitle?: string
      category: string
      image: string
      description?: string
      date: string
      link: string
    }[] = []

    // Add blog posts
    if (blogPosts.success && blogPosts.data) {
      blogPosts.data.forEach(post => {
        unifiedContent.push({
          type: 'blog',
          id: post.id,
          title: post.title,
          subtitle: post.subtitle,
          category: post.category,
          image: post.coverImage || '/filler/DETAILS_1.0.jpeg',
          description: post.excerpt || post.subtitle,
          date: post.publishedAt || post.createdAt,
          link: `/blog#post-${post.id}`
        })
      })
    }

    // Add gallery collections
    if (galleryCollections.success && galleryCollections.data) {
      galleryCollections.data.forEach(collection => {
        unifiedContent.push({
          type: 'gallery',
          id: collection.id,
          title: collection.name,
          subtitle: collection.description,
          category: collection.category,
          image: collection.coverImage,
          description: collection.description,
          date: collection.createdAt,
          link: `/gallery/${collection.id}`
        })
      })
    }

    // Sort by date (most recent first) and limit
    return unifiedContent
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  async getContentStats(): Promise<{
    totalBlogPosts: number
    totalGalleryCollections: number
    totalImages: number
    blogCategories: number
    galleryCategories: number
    totalTags: number
  }> {
    const [
      blogPosts,
      galleryCollections,
      blogCategories,
      galleryCategories,
      blogTags,
      galleryTags
    ] = await Promise.all([
      this.getBlogPosts(),
      this.getGalleryCollections(),
      this.getBlogCategories(),
      this.getGalleryCategories(),
      this.getBlogTags(),
      this.getGalleryTags()
    ])

    const totalImages = (galleryCollections.data || [])
      .reduce((sum, collection) => sum + collection.images.length, 0)

    const allTags = new Set([...blogTags, ...galleryTags])

    return {
      totalBlogPosts: blogPosts.data?.length || 0,
      totalGalleryCollections: galleryCollections.data?.length || 0,
      totalImages,
      blogCategories: blogCategories.length,
      galleryCategories: galleryCategories.length,
      totalTags: allTags.size
    }
  }

  // Data management operations
  async exportAllData(): Promise<{
    blogPosts: BlogPost[]
    galleryCollections: GalleryCollection[]
    exportDate: string
    version: string
  }> {
    const [blogPosts, galleryCollections] = await Promise.all([
      this.getBlogPosts({ limit: 1000 }), // Get all posts
      this.getGalleryCollections({ limit: 1000 }) // Get all collections
    ])

    return {
      blogPosts: blogPosts.data || [],
      galleryCollections: galleryCollections.data || [],
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  async importData(data: {
    blogPosts?: BlogPost[]
    galleryCollections?: GalleryCollection[]
  }): Promise<{
    blogPostsImported: number
    galleryCollectionsImported: number
    errors: string[]
  }> {
    const errors: string[] = []
    let blogPostsImported = 0
    let galleryCollectionsImported = 0

    // Import blog posts
    if (data.blogPosts) {
      for (const post of data.blogPosts) {
        try {
          const { id, createdAt, updatedAt, ...postData } = post
          await this.createBlogPost(postData)
          blogPostsImported++
        } catch (error) {
          errors.push(`Failed to import blog post "${post.title}": ${error}`)
        }
      }
    }

    // Import gallery collections
    if (data.galleryCollections) {
      for (const collection of data.galleryCollections) {
        try {
          const { id, createdAt, updatedAt, ...collectionData } = collection
          await this.createGalleryCollection(collectionData)
          galleryCollectionsImported++
        } catch (error) {
          errors.push(`Failed to import gallery collection "${collection.name}": ${error}`)
        }
      }
    }

    return {
      blogPostsImported,
      galleryCollectionsImported,
      errors
    }
  }

  async clearAllData(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem('blogPosts')
    localStorage.removeItem('galleryCollections')
  }

  async backupData(): Promise<string> {
    const data = await this.exportAllData()
    return JSON.stringify(data, null, 2)
  }

  async restoreFromBackup(backupData: string): Promise<{
    success: boolean
    message: string
    stats?: {
      blogPostsImported: number
      galleryCollectionsImported: number
      errors: string[]
    }
  }> {
    try {
      const data = JSON.parse(backupData)
      
      // Clear existing data
      await this.clearAllData()
      
      // Import new data
      const stats = await this.importData(data)
      
      return {
        success: true,
        message: 'Data restored successfully',
        stats
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to restore data: ${error}`
      }
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance()

// Export types for external use
export type {
  BlogPost,
  GalleryCollection,
  APIResponse,
  BlogQueryOptions,
  GalleryQueryOptions
} from './schema'