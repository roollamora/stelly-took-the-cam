// Repository Pattern Implementation
// Generic data access layer that can be extended for different storage backends

import { 
  BaseEntity, 
  APIResponse, 
  QueryOptions, 
  PaginationInfo,
  ValidationSchema,
  ValidationRule
} from './schema'

// Generic Repository Interface
export interface IRepository<T extends BaseEntity> {
  findAll(options?: QueryOptions): Promise<APIResponse<T[]>>
  findById(id: number): Promise<APIResponse<T>>
  findBySlug(slug: string): Promise<APIResponse<T>>
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<T>>
  update(id: number, entity: Partial<T>): Promise<APIResponse<T>>
  delete(id: number): Promise<APIResponse<boolean>>
  count(filters?: Record<string, any>): Promise<number>
  search(query: string, options?: QueryOptions): Promise<APIResponse<T[]>>
  validate(entity: Partial<T>): ValidationResult
}

// Validation Result Type
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Base Repository Implementation
export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected abstract entityName: string
  protected abstract validationSchema: ValidationSchema
  protected abstract storage: IStorageAdapter<T>

  async findAll(options: QueryOptions = {}): Promise<APIResponse<T[]>> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sortBy = 'createdAt', 
        sortOrder = 'desc',
        filters = {},
        search
      } = options

      let data = await this.storage.getAll()

      // Apply filters
      if (Object.keys(filters).length > 0) {
        data = this.applyFilters(data, filters)
      }

      // Apply search
      if (search) {
        data = this.applySearch(data, search)
      }

      // Apply sorting
      data = this.applySorting(data, sortBy, sortOrder)

      // Calculate pagination
      const total = data.length
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      const paginatedData = data.slice(offset, offset + limit)

      const pagination: PaginationInfo = {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }

      return {
        success: true,
        data: paginatedData,
        pagination
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch ${this.entityName}s: ${error}`
      }
    }
  }

  async findById(id: number): Promise<APIResponse<T>> {
    try {
      const entity = await this.storage.getById(id)
      if (!entity) {
        return {
          success: false,
          error: `${this.entityName} with id ${id} not found`
        }
      }
      return {
        success: true,
        data: entity
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch ${this.entityName}: ${error}`
      }
    }
  }

  async findBySlug(slug: string): Promise<APIResponse<T>> {
    try {
      const entity = await this.storage.getBySlug(slug)
      if (!entity) {
        return {
          success: false,
          error: `${this.entityName} with slug ${slug} not found`
        }
      }
      return {
        success: true,
        data: entity
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch ${this.entityName}: ${error}`
      }
    }
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<T>> {
    try {
      // Validate entity
      const validation = this.validate(entity as Partial<T>)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          data: validation.errors as any
        }
      }

      // Add timestamps and generate ID
      const now = new Date().toISOString()
      const newEntity = {
        ...entity,
        id: await this.generateId(),
        createdAt: now,
        updatedAt: now,
        isActive: true
      } as T

      // Generate slug if applicable
      if ('title' in newEntity && !newEntity.slug) {
        newEntity.slug = this.generateSlug((newEntity as any).title)
      }

      const savedEntity = await this.storage.create(newEntity)
      
      return {
        success: true,
        data: savedEntity,
        message: `${this.entityName} created successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to create ${this.entityName}: ${error}`
      }
    }
  }

  async update(id: number, entity: Partial<T>): Promise<APIResponse<T>> {
    try {
      // Check if entity exists
      const existing = await this.storage.getById(id)
      if (!existing) {
        return {
          success: false,
          error: `${this.entityName} with id ${id} not found`
        }
      }

      // Validate updates
      const validation = this.validate(entity)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          data: validation.errors as any
        }
      }

      // Update entity
      const updatedEntity = {
        ...existing,
        ...entity,
        updatedAt: new Date().toISOString()
      }

      const savedEntity = await this.storage.update(id, updatedEntity)
      
      return {
        success: true,
        data: savedEntity,
        message: `${this.entityName} updated successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update ${this.entityName}: ${error}`
      }
    }
  }

  async delete(id: number): Promise<APIResponse<boolean>> {
    try {
      const existing = await this.storage.getById(id)
      if (!existing) {
        return {
          success: false,
          error: `${this.entityName} with id ${id} not found`
        }
      }

      await this.storage.delete(id)
      
      return {
        success: true,
        data: true,
        message: `${this.entityName} deleted successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete ${this.entityName}: ${error}`
      }
    }
  }

  async count(filters: Record<string, any> = {}): Promise<number> {
    try {
      let data = await this.storage.getAll()
      if (Object.keys(filters).length > 0) {
        data = this.applyFilters(data, filters)
      }
      return data.length
    } catch (error) {
      return 0
    }
  }

  async search(query: string, options: QueryOptions = {}): Promise<APIResponse<T[]>> {
    return this.findAll({ ...options, search: query })
  }

  validate(entity: Partial<T>): ValidationResult {
    const errors: ValidationError[] = []

    for (const rule of this.validationSchema.rules) {
      const value = (entity as any)[rule.field]
      
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
          
        case 'email':
          if (value && !this.isValidEmail(value)) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
          
        case 'url':
          if (value && !this.isValidUrl(value)) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
          
        case 'minLength':
          if (value && value.length < rule.value) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
          
        case 'maxLength':
          if (value && value.length > rule.value) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
          
        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            errors.push({
              field: rule.field,
              message: rule.message,
              value
            })
          }
          break
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Helper methods
  protected applyFilters(data: T[], filters: Record<string, any>): T[] {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        const itemValue = (item as any)[key]
        
        if (Array.isArray(value)) {
          return Array.isArray(itemValue) 
            ? value.some(v => itemValue.includes(v))
            : value.includes(itemValue)
        }
        
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }
        
        return itemValue === value
      })
    })
  }

  protected applySearch(data: T[], query: string): T[] {
    const searchFields = this.getSearchableFields()
    const lowerQuery = query.toLowerCase()
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = (item as any)[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery)
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(lowerQuery)
          )
        }
        return false
      })
    })
  }

  protected applySorting(data: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortBy]
      const bValue = (b as any)[sortBy]
      
      let comparison = 0
      
      if (aValue < bValue) comparison = -1
      else if (aValue > bValue) comparison = 1
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  protected async generateId(): Promise<number> {
    const data = await this.storage.getAll()
    return Math.max(...data.map(item => item.id), 0) + 1
  }

  protected generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }

  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  protected isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  protected abstract getSearchableFields(): string[]
}

// Storage Adapter Interface
export interface IStorageAdapter<T extends BaseEntity> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | null>
  getBySlug(slug: string): Promise<T | null>
  create(entity: T): Promise<T>
  update(id: number, entity: T): Promise<T>
  delete(id: number): Promise<void>
  backup(): Promise<string>
  restore(data: string): Promise<void>
}

// LocalStorage Adapter Implementation
export class LocalStorageAdapter<T extends BaseEntity> implements IStorageAdapter<T> {
  constructor(private key: string) {}

  async getAll(): Promise<T[]> {
    try {
      const data = localStorage.getItem(this.key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  async getById(id: number): Promise<T | null> {
    const data = await this.getAll()
    return data.find(item => item.id === id) || null
  }

  async getBySlug(slug: string): Promise<T | null> {
    const data = await this.getAll()
    return data.find(item => item.slug === slug) || null
  }

  async create(entity: T): Promise<T> {
    const data = await this.getAll()
    data.push(entity)
    localStorage.setItem(this.key, JSON.stringify(data))
    return entity
  }

  async update(id: number, entity: T): Promise<T> {
    const data = await this.getAll()
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Entity not found')
    
    data[index] = entity
    localStorage.setItem(this.key, JSON.stringify(data))
    return entity
  }

  async delete(id: number): Promise<void> {
    const data = await this.getAll()
    const filtered = data.filter(item => item.id !== id)
    localStorage.setItem(this.key, JSON.stringify(filtered))
  }

  async backup(): Promise<string> {
    return localStorage.getItem(this.key) || '[]'
  }

  async restore(data: string): Promise<void> {
    localStorage.setItem(this.key, data)
  }
}