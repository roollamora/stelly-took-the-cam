# Database Integration Documentation

## Overview

This document describes the comprehensive database architecture and dataset library implemented for the STELLY TOOK THE CAM website. The system provides a robust, scalable foundation for managing blog posts, gallery collections, and other content types.

## Architecture

### Core Components

1. **Schema Definitions** (`src/lib/database/schema.ts`)
   - Comprehensive TypeScript interfaces for all content types
   - Includes BlogPost, GalleryCollection, User, Category, Tag, Comment, Analytics, and more
   - Provides type safety and validation across the application

2. **Repository Pattern** (`src/lib/database/repository.ts`)
   - Base repository class with CRUD operations
   - LocalStorage adapter for client-side persistence
   - Validation, search, filtering, and pagination support
   - Extensible for future database backends (PostgreSQL, MongoDB, etc.)

3. **Specialized Repositories**
   - **BlogRepository** (`src/lib/database/blogRepository.ts`)
     - Blog-specific operations (by category, tag, author, status)
     - Popular posts, recent posts, related posts
     - View count and likes tracking
     - Category and tag statistics
     - Monthly analytics
   
   - **GalleryRepository** (`src/lib/database/galleryRepository.ts`)
     - Gallery collection management
     - Public/private collections
     - Featured collections
     - Image metadata and EXIF data support
     - Category and tag management

4. **Data Service** (`src/lib/database/dataService.ts`)
   - Centralized singleton service for all data operations
   - Unified API for blog and gallery operations
   - Cross-content search functionality
   - Data export/import capabilities
   - Backup and restore functionality
   - Content statistics and analytics

5. **Seed Data** (`src/lib/database/seedData.ts`)
   - Sample blog posts and gallery collections
   - Development and testing data
   - Database seeding utilities

## Features

### Blog Management

- **CRUD Operations**: Create, read, update, delete blog posts
- **Rich Content**: Support for cover images, inline images, and formatted content
- **Metadata**: Categories, tags, authors, publish dates
- **SEO**: Meta titles, descriptions, keywords, Open Graph tags
- **Analytics**: View counts, likes, engagement tracking
- **Search**: Full-text search across title, subtitle, content
- **Filtering**: By category, tag, author, status, date range
- **Sorting**: By date, title, category, popularity
- **Pagination**: Configurable page sizes
- **Related Posts**: Automatic suggestions based on tags and category
- **Status Management**: Draft, published, archived states

### Gallery Management

- **Collections**: Organize images into themed collections
- **Image Metadata**: Dimensions, file size, MIME type, EXIF data
- **Thumbnails**: Support for thumbnail URLs
- **Captions**: Image descriptions and alt text
- **Tags**: Multi-level tagging system
- **Public/Private**: Visibility control
- **Featured Collections**: Highlight specific collections
- **Sort Order**: Custom ordering within collections
- **SEO**: Collection-level meta tags

### Data Migration

- **Legacy Support**: Backward compatibility with localStorage-based system
- **Migration Tool**: Automated migration from old to new format
- **Data Validation**: Ensures data integrity during migration
- **Backup/Restore**: Export and import functionality
- **Seed Data**: Populate database with sample content

## Integration Points

### Admin Panel (`src/app/admin/page.tsx`)

The admin panel has been updated to use the new database system:

- **Load Posts**: Fetches from database with fallback to legacy storage
- **Create Post**: Validates and saves to database with proper schema
- **Update Post**: Partial updates with validation
- **Delete Post**: Soft delete with confirmation
- **Migration UI**: Built-in data migration component
- **Statistics**: Real-time content statistics

### Blog Page (`src/app/blog/page.tsx`)

The blog page now uses the data service:

- **Load Posts**: Fetches published posts sorted by date
- **Filtering**: By status (published only)
- **Sorting**: Newest first by default
- **Fallback**: Legacy data if database is empty

### Gallery Pages

Gallery pages have been updated to support the new system:

- **Collection List**: Loads from database or legacy storage
- **Collection Detail**: Fetches individual collections
- **Category Filtering**: Dynamic category lists
- **Image Display**: Proper metadata handling

## Usage Examples

### Creating a Blog Post

```typescript
import { dataService } from '@/lib/database/dataService'

const newPost = {
  title: 'My New Post',
  subtitle: 'An exciting article',
  subtitlePosition: 'after',
  content: 'Post content here...',
  category: 'Photography',
  tags: ['urban', 'street'],
  coverImage: '/images/cover.jpg',
  publishedAt: new Date().toISOString(),
  status: 'published',
  author: 'Admin',
  isActive: true,
  viewCount: 0,
  likes: 0,
  images: [],
  seo: {
    keywords: ['urban', 'street'],
    metaTitle: 'My New Post',
    metaDescription: 'An exciting article'
  }
}

const response = await dataService.createBlogPost(newPost)
if (response.success) {
  console.log('Post created:', response.data)
}
```

### Searching Content

```typescript
// Search blog posts
const results = await dataService.searchBlogPosts('photography', {
  category: 'Street Photography',
  tags: ['urban'],
  limit: 10
})

// Global search across all content
const globalResults = await dataService.globalSearch('urban')
console.log('Blog posts:', globalResults.blogPosts)
console.log('Gallery collections:', globalResults.galleryCollections)
```

### Getting Statistics

```typescript
const stats = await dataService.getContentStats()
console.log('Total blog posts:', stats.totalBlogPosts)
console.log('Total gallery collections:', stats.totalGalleryCollections)
console.log('Total images:', stats.totalImages)
```

### Exporting Data

```typescript
// Export all data
const backup = await dataService.backupData()
// Save to file or send to server

// Import data
const result = await dataService.restoreFromBackup(backupData)
if (result.success) {
  console.log('Data restored:', result.stats)
}
```

## Migration Guide

### Step 1: Load Current Statistics

Visit the admin panel at `/admin` and click "Load Stats" to see the current database state.

### Step 2: Migrate Legacy Data

Click "Migrate Legacy Data" to move existing localStorage data to the new database system. This process:
- Checks for existing posts to avoid duplicates
- Validates all data before migration
- Reports any errors encountered
- Maintains backward compatibility

### Step 3: Seed Sample Data (Optional)

Click "Seed Sample Data" to populate the database with sample blog posts and gallery collections for testing.

### Step 4: Export Backup

Before making any major changes, use "Export Backup" to create a JSON backup file.

### Step 5: Verify Integration

- Check that blog posts appear correctly on `/blog`
- Verify gallery collections display on `/gallery`
- Test creating, editing, and deleting content in `/admin`

## Data Storage

### Current Implementation

The system currently uses **localStorage** for client-side persistence:
- Blog posts: `localStorage.getItem('blogPosts')`
- Gallery collections: `localStorage.getItem('galleryCollections')`

### Future Enhancements

The repository pattern is designed to support multiple backends:

1. **Server-Side Database**
   - PostgreSQL with Prisma ORM
   - MongoDB with Mongoose
   - MySQL/MariaDB
   - SQLite for development

2. **API Integration**
   - RESTful API endpoints
   - GraphQL queries
   - Real-time updates with WebSockets

3. **Cloud Storage**
   - AWS S3 for images
   - Cloudinary for image optimization
   - CDN integration

## Validation

The system includes comprehensive validation:

- **Required Fields**: Title, content, category, author
- **Length Constraints**: Min/max character limits
- **Format Validation**: Email, URL, date formats
- **Custom Rules**: Business logic validation
- **Error Messages**: User-friendly validation feedback

## Performance Considerations

- **Lazy Loading**: Data loaded on demand
- **Pagination**: Configurable page sizes to limit data transfer
- **Caching**: Repository-level caching for frequently accessed data
- **Indexing**: Optimized search with indexed fields
- **Batch Operations**: Bulk create/update/delete support

## Security

- **Input Validation**: All user input validated before storage
- **XSS Prevention**: Content sanitization
- **SQL Injection**: Parameterized queries (when using SQL backend)
- **Access Control**: Role-based permissions (schema defined)
- **Audit Trail**: Created/updated timestamps on all entities

## Testing

The system includes:
- **Type Safety**: Full TypeScript coverage
- **Validation Tests**: Schema validation
- **Integration Tests**: End-to-end workflows
- **Sample Data**: Realistic test data for development

## Troubleshooting

### Posts Not Appearing

1. Check browser console for errors
2. Verify localStorage has data: `localStorage.getItem('blogPosts')`
3. Try migrating legacy data from admin panel
4. Check that posts have `status: 'published'`

### Migration Errors

1. Export current data as backup first
2. Clear database and try again
3. Check console for specific error messages
4. Verify data format matches schema

### Performance Issues

1. Reduce page size in pagination
2. Clear old data from localStorage
3. Use filtering to limit results
4. Consider implementing server-side storage

## Future Roadmap

1. **Server-Side Storage**: Move from localStorage to database
2. **Real-Time Updates**: WebSocket integration for live updates
3. **Image Optimization**: Automatic resizing and compression
4. **Advanced Search**: Elasticsearch integration
5. **Comments System**: User comments on blog posts
6. **User Management**: Full authentication and authorization
7. **Analytics Dashboard**: Detailed content analytics
8. **API Endpoints**: RESTful API for external integrations
9. **Multi-Language**: i18n support for content
10. **Version Control**: Content versioning and history

## Conclusion

The database integration provides a solid foundation for the STELLY TOOK THE CAM website. The repository pattern ensures flexibility for future enhancements while maintaining clean, maintainable code. The system is production-ready and can scale as the website grows.

For questions or issues, refer to the inline documentation in the source files or check the TypeScript types for detailed interface definitions.