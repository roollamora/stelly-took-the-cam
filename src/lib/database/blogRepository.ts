// Blog-specific Repository Implementation

import { 
  BlogPost, 
  BlogQueryOptions, 
  ValidationSchema,
  APIResponse
} from './schema'
import { BaseRepository, LocalStorageAdapter } from './repository'

export class BlogRepository extends BaseRepository<BlogPost> {
  protected entityName = 'BlogPost'
  protected storage = new LocalStorageAdapter<BlogPost>('blogPosts')

  protected validationSchema: ValidationSchema = {
    entity: 'BlogPost',
    rules: [
      {
        field: 'title',
        type: 'required',
        message: 'Title is required'
      },
      {
        field: 'title',
        type: 'minLength',
        value: 3,
        message: 'Title must be at least 3 characters long'
      },
      {
        field: 'title',
        type: 'maxLength',
        value: 200,
        message: 'Title must not exceed 200 characters'
      },
      {
        field: 'content',
        type: 'required',
        message: 'Content is required'
      },
      {
        field: 'content',
        type: 'minLength',
        value: 50,
        message: 'Content must be at least 50 characters long'
      },
      {
        field: 'category',
        type: 'required',
        message: 'Category is required'
      },
      {
        field: 'author',
        type: 'required',
        message: 'Author is required'
      }
    ]
  }

  protected getSearchableFields(): string[] {
    return ['title', 'subtitle', 'content', 'category', 'tags', 'author']
  }

  // Blog-specific query methods
  async findByCategory(category: string, options: BlogQueryOptions = {}): Promise<APIResponse<BlogPost[]>> {
    return this.findAll({
      ...options,
      filters: { ...options.filters, category }
    })
  }

  async findByTag(tag: string, options: BlogQueryOptions = {}): Promise<APIResponse<BlogPost[]>> {
    const data = await this.storage.getAll()
    const filtered = data.filter(post => post.tags.includes(tag))
    
    return {
      success: true,
      data: filtered
    }
  }

  async findByAuthor(author: string, options: BlogQueryOptions = {}): Promise<APIResponse<BlogPost[]>> {
    return this.findAll({
      ...options,
      filters: { ...options.filters, author }
    })
  }

  async findByStatus(status: 'draft' | 'published' | 'archived', options: BlogQueryOptions = {}): Promise<APIResponse<BlogPost[]>> {
    return this.findAll({
      ...options,
      filters: { ...options.filters, status }
    })
  }

  async findByDateRange(dateFrom: string, dateTo: string, options: BlogQueryOptions = {}): Promise<APIResponse<BlogPost[]>> {
    const data = await this.storage.getAll()
    const filtered = data.filter(post => {
      const postDate = new Date(post.publishedAt || post.createdAt)
      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)
      return postDate >= fromDate && postDate <= toDate
    })
    
    return {
      success: true,
      data: filtered
    }
  }

  async getPopularPosts(limit: number = 10): Promise<APIResponse<BlogPost[]>> {
    return this.findAll({
      limit,
      sortBy: 'viewCount',
      sortOrder: 'desc',
      filters: { status: 'published' }
    })
  }

  async getRecentPosts(limit: number = 10): Promise<APIResponse<BlogPost[]>> {
    return this.findAll({
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
      filters: { status: 'published' }
    })
  }

  async getRelatedPosts(postId: number, limit: number = 5): Promise<APIResponse<BlogPost[]>> {
    const postResult = await this.findById(postId)
    if (!postResult.success || !postResult.data) {
      return { success: false, error: 'Post not found' }
    }

    const post = postResult.data
    const allPosts = await this.storage.getAll()
    
    // Find posts with similar tags or same category
    const related = allPosts
      .filter(p => p.id !== postId && p.status === 'published')
      .map(p => ({
        post: p,
        score: this.calculateSimilarityScore(post, p)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post)

    return {
      success: true,
      data: related
    }
  }

  async incrementViewCount(id: number): Promise<APIResponse<BlogPost>> {
    const postResult = await this.findById(id)
    if (!postResult.success || !postResult.data) {
      return { success: false, error: 'Post not found' }
    }

    const post = postResult.data
    return this.update(id, {
      viewCount: (post.viewCount || 0) + 1
    })
  }

  async incrementLikes(id: number): Promise<APIResponse<BlogPost>> {
    const postResult = await this.findById(id)
    if (!postResult.success || !postResult.data) {
      return { success: false, error: 'Post not found' }
    }

    const post = postResult.data
    return this.update(id, {
      likes: (post.likes || 0) + 1
    })
  }

  async getCategories(): Promise<string[]> {
    const data = await this.storage.getAll()
    const categories = [...new Set(data.map(post => post.category).filter(Boolean))]
    return categories.sort()
  }

  async getTags(): Promise<string[]> {
    const data = await this.storage.getAll()
    const tags = [...new Set(data.flatMap(post => post.tags))]
    return tags.sort()
  }

  async getAuthors(): Promise<string[]> {
    const data = await this.storage.getAll()
    const authors = [...new Set(data.map(post => post.author).filter(Boolean))]
    return authors.sort()
  }

  async getCategoryStats(): Promise<Record<string, number>> {
    const data = await this.storage.getAll()
    const stats: Record<string, number> = {}
    
    data.forEach(post => {
      if (post.category) {
        stats[post.category] = (stats[post.category] || 0) + 1
      }
    })
    
    return stats
  }

  async getTagStats(): Promise<Record<string, number>> {
    const data = await this.storage.getAll()
    const stats: Record<string, number> = {}
    
    data.forEach(post => {
      post.tags.forEach(tag => {
        stats[tag] = (stats[tag] || 0) + 1
      })
    })
    
    return stats
  }

  async getMonthlyStats(year: number): Promise<Record<string, number>> {
    const data = await this.storage.getAll()
    const stats: Record<string, number> = {}
    
    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0')
      stats[`${year}-${month}`] = 0
    }
    
    data.forEach(post => {
      const date = new Date(post.publishedAt || post.createdAt)
      if (date.getFullYear() === year) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const key = `${year}-${month}`
        stats[key] = (stats[key] || 0) + 1
      }
    })
    
    return stats
  }

  // Helper method to calculate similarity between posts
  private calculateSimilarityScore(post1: BlogPost, post2: BlogPost): number {
    let score = 0
    
    // Same category gets high score
    if (post1.category === post2.category) {
      score += 10
    }
    
    // Common tags
    const commonTags = post1.tags.filter(tag => post2.tags.includes(tag))
    score += commonTags.length * 3
    
    // Same author
    if (post1.author === post2.author) {
      score += 5
    }
    
    return score
  }

  // Override create to add default values
  async create(entity: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<BlogPost>> {
    const blogPost = {
      ...entity,
      author: entity.author || 'Anonymous',
      status: entity.status || 'draft',
      viewCount: 0,
      likes: 0,
      images: entity.images || [],
      seo: entity.seo || {
        keywords: entity.tags || [],
        metaTitle: entity.title,
        metaDescription: entity.subtitle || entity.title
      }
    } as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

    return super.create(blogPost)
  }

  // Generate excerpt from content
  generateExcerpt(content: string, maxLength: number = 200): string {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    
    if (plainText.length <= maxLength) {
      return plainText
    }
    
    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...'
  }

  // Bulk operations
  async bulkUpdateStatus(ids: number[], status: 'draft' | 'published' | 'archived'): Promise<APIResponse<boolean>> {
    try {
      for (const id of ids) {
        await this.update(id, { status })
      }
      return {
        success: true,
        data: true,
        message: `Updated ${ids.length} posts`
      }
    } catch (error) {
      return {
        success: false,
        error: `Bulk update failed: ${error}`
      }
    }
  }

  async bulkDelete(ids: number[]): Promise<APIResponse<boolean>> {
    try {
      for (const id of ids) {
        await this.delete(id)
      }
      return {
        success: true,
        data: true,
        message: `Deleted ${ids.length} posts`
      }
    } catch (error) {
      return {
        success: false,
        error: `Bulk delete failed: ${error}`
      }
    }
  }
}