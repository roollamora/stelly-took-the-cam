// Database Schema Definitions
// This serves as the blueprint for all content types across the website

export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  slug?: string
}

// Blog Post Schema
export interface BlogPost extends BaseEntity {
  title: string
  subtitle: string
  subtitlePosition: 'before' | 'after'
  content: string
  excerpt?: string
  coverImage?: string
  category: string
  tags: string[]
  author: string
  publishedAt?: string
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  likes: number
  images: BlogImage[]
  seo: SEOMetadata
  folderPath?: string
}

export interface BlogImage {
  id: number
  url: string
  alt: string
  caption?: string
  position: number
  width?: number
  height?: number
  fileSize?: number
  mimeType?: string
}

// Gallery Schema
export interface GalleryCollection extends BaseEntity {
  name: string
  description: string
  coverImage: string
  category: string
  images: GalleryImage[]
  isPublic: boolean
  sortOrder: number
  seo: SEOMetadata
}

// Project Schema
export interface Project extends BaseEntity {
  title: string
  subtitle?: string
  description: string
  category: string
  tags: string[]
  coverImage?: string
  images: ProjectImage[]
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  startDate?: string
  endDate?: string
  client?: string
  technologies: string[]
  links: ProjectLink[]
  team: TeamMember[]
  budget?: number
  priority: 'low' | 'medium' | 'high'
  seo: SEOMetadata
}

export interface ProjectImage {
  id: number
  url: string
  alt: string
  caption?: string
  position: number
  type: 'cover' | 'gallery' | 'process' | 'result'
}

export interface ProjectLink {
  type: 'website' | 'github' | 'demo' | 'documentation' | 'other'
  url: string
  label: string
}

export interface TeamMember {
  name: string
  role: string
  avatar?: string
  profileUrl?: string
}

// Collaboration Schema
export interface Collaboration extends BaseEntity {
  title: string
  subtitle?: string
  description: string
  type: 'partnership' | 'commission' | 'joint-project' | 'sponsorship' | 'other'
  status: 'inquiry' | 'negotiating' | 'active' | 'completed' | 'cancelled'
  partner: CollaborationPartner
  coverImage?: string
  images: CollaborationImage[]
  startDate?: string
  endDate?: string
  deliverables: string[]
  terms?: string
  budget?: number
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  seo: SEOMetadata
}

export interface CollaborationPartner {
  name: string
  type: 'individual' | 'company' | 'organization'
  email?: string
  website?: string
  logo?: string
  contactPerson?: string
}

export interface CollaborationImage {
  id: number
  url: string
  alt: string
  caption?: string
  position: number
  type: 'cover' | 'process' | 'result' | 'meeting'
}

export interface GalleryImage extends BaseEntity {
  url: string
  thumbnailUrl?: string
  alt: string
  caption?: string
  description?: string
  tags: string[]
  dimensions: ImageDimensions
  metadata: ImageMetadata
  sortOrder: number
}

export interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}

export interface ImageMetadata {
  fileSize: number
  mimeType: string
  originalName: string
  uploadedAt: string
  exifData?: ExifData
}

export interface ExifData {
  camera?: string
  lens?: string
  focalLength?: string
  aperture?: string
  shutterSpeed?: string
  iso?: string
  dateTaken?: string
  location?: GeoLocation
}

export interface GeoLocation {
  latitude: number
  longitude: number
  address?: string
}

// User/Author Schema
export interface User extends BaseEntity {
  username: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  avatar?: string
  role: 'admin' | 'editor' | 'author' | 'viewer'
  permissions: Permission[]
  socialLinks: SocialLink[]
  preferences: UserPreferences
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export interface SocialLink {
  platform: string
  url: string
  isPublic: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  emailNotifications: boolean
  defaultPostStatus: 'draft' | 'published'
}

// Category Schema
export interface Category extends BaseEntity {
  name: string
  description?: string
  color?: string
  icon?: string
  parentId?: number
  sortOrder: number
  postCount: number
  isVisible: boolean
}

// Tag Schema
export interface Tag extends BaseEntity {
  name: string
  description?: string
  color?: string
  usageCount: number
  relatedTags: string[]
}

// SEO Schema
export interface SEOMetadata {
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

// Comment Schema (for future use)
export interface Comment extends BaseEntity {
  content: string
  author: CommentAuthor
  postId: number
  parentId?: number
  status: 'pending' | 'approved' | 'spam' | 'rejected'
  ipAddress?: string
  userAgent?: string
  replies: Comment[]
}

export interface CommentAuthor {
  name: string
  email: string
  website?: string
  isRegistered: boolean
  userId?: number
}

// Analytics Schema
export interface PageView extends BaseEntity {
  url: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  sessionId: string
  userId?: number
  duration?: number
  bounced: boolean
}

export interface ContentAnalytics {
  contentId: number
  contentType: 'blog' | 'gallery' | 'page'
  views: number
  uniqueViews: number
  averageTimeOnPage: number
  bounceRate: number
  socialShares: number
  comments: number
  likes: number
  lastUpdated: string
}

// Settings Schema
export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  timezone: string
  language: string
  theme: SiteTheme
  features: FeatureFlags
  integrations: Integrations
  seo: GlobalSEO
}

export interface SiteTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  logoUrl?: string
  faviconUrl?: string
}

export interface FeatureFlags {
  commentsEnabled: boolean
  registrationEnabled: boolean
  socialLoginEnabled: boolean
  analyticsEnabled: boolean
  searchEnabled: boolean
  newsletterEnabled: boolean
}

export interface Integrations {
  googleAnalytics?: string
  googleTagManager?: string
  facebookPixel?: string
  mailchimp?: string
  cloudinary?: CloudinaryConfig
  aws?: AWSConfig
}

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  uploadPreset: string
}

export interface AWSConfig {
  region: string
  bucket: string
  accessKeyId: string
}

export interface GlobalSEO {
  defaultMetaTitle: string
  defaultMetaDescription: string
  defaultKeywords: string[]
  ogImage: string
  twitterHandle?: string
  googleSiteVerification?: string
  bingSiteVerification?: string
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Query Types
export interface QueryOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
  include?: string[]
}

export interface BlogQueryOptions extends QueryOptions {
  category?: string
  tags?: string[]
  author?: string
  status?: 'draft' | 'published' | 'archived'
  dateFrom?: string
  dateTo?: string
}

export interface GalleryQueryOptions extends QueryOptions {
  category?: string
  tags?: string[]
  isPublic?: boolean
}

// Validation Schemas
export interface ValidationRule {
  field: string
  type: 'required' | 'email' | 'url' | 'minLength' | 'maxLength' | 'pattern'
  value?: any
  message: string
}

export interface ValidationSchema {
  entity: string
  rules: ValidationRule[]
}

// File Upload Types
export interface FileUploadConfig {
  maxSize: number
  allowedTypes: string[]
  destination: string
  naming: 'original' | 'timestamp' | 'uuid'
  resize?: ImageResizeConfig[]
}

export interface ImageResizeConfig {
  name: string
  width: number
  height?: number
  quality: number
  format?: 'jpg' | 'png' | 'webp'
}

// Backup and Migration Types
export interface BackupConfig {
  frequency: 'daily' | 'weekly' | 'monthly'
  retention: number
  destination: 'local' | 'cloud'
  encryption: boolean
}

export interface MigrationScript {
  version: string
  description: string
  up: string
  down: string
  timestamp: string
}