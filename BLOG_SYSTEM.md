# Blog System Documentation

## Overview
The blog system uses a dual-storage architecture with automatic fallback and migration capabilities. Posts can be stored in either localStorage (legacy) or SQLite database (current), with automatic seeding when no data exists.

---

## Where Blog Posts Are Read From

### 1. **Primary Source: SQLite Database**
- **Location**: `light-site/database.sqlite`
- **Table**: `blog_posts`
- **Access**: Via `dataService.getBlogPosts()`
- **Repository**: `BlogRepository` in `src/lib/database/blogRepository.ts`

### 2. **Fallback Source: localStorage**
- **Key**: `'blogPosts'`
- **Function**: `getBlogPosts()` in `src/lib/blogData.ts`
- **Used when**: Database is empty or unavailable

### 3. **Default Seed Data**
- **Location**: `src/lib/database/seedData.ts`
- **Contains**: 2 sample blog posts
- **Triggered**: Automatically when both database and localStorage are empty

---

## Data Loading Flow

```
Blog Page Load
    ↓
Try localStorage (getBlogPosts())
    ↓
If empty → Try Database (dataService.getBlogPosts())
    ↓
If empty → Auto-seed Database (seedDatabase())
    ↓
Final fallback → Legacy localStorage data
```

### Code Reference (from `src/app/blog/page.tsx`):
```typescript
// 1. Try localStorage first (for auto-posted content)
let posts = getBlogPosts()

// 2. If empty, try database
if (posts.length === 0) {
  const dbResponse = await dataService.getBlogPosts({
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    limit: 100
  })
  
  if (dbResponse.success && dbResponse.data) {
    posts = dbResponse.data.map(convertToBlogFormat)
  }
}

// 3. If database is empty, seed it
if (posts.length === 0) {
  await seedDatabase()
  const dbResponse = await dataService.getBlogPosts(...)
  posts = dbResponse.data.map(convertToBlogFormat)
}

// 4. Filter for published posts only
posts = posts.filter(post => post.status === 'published')
```

---

## How Blog Posts Are Updated

### Method 1: Admin Panel (Recommended)
**Location**: `/admin` page

**Features**:
- Create new posts
- Edit existing posts
- Delete posts
- Change post status (draft/published/archived)
- Add/remove tags
- Upload cover images
- Manage categories

**Storage**: Saves directly to SQLite database via `dataService.createBlogPost()` or `dataService.updateBlogPost()`

**Code**:
```typescript
// Create new post
await dataService.createBlogPost({
  title: "Post Title",
  subtitle: "Subtitle",
  content: "Content...",
  category: "Category",
  tags: ["tag1", "tag2"],
  author: "Author Name",
  status: "published"
})

// Update existing post
await dataService.updateBlogPost(postId, {
  title: "Updated Title",
  content: "Updated content..."
})

// Delete post
await dataService.deleteBlogPost(postId)
```

---

### Method 2: API Routes
**Location**: `src/app/api/blog/` (if implemented)

**Endpoints**:
- `POST /api/blog` - Create new post
- `PUT /api/blog/[id]` - Update post
- `DELETE /api/blog/[id]` - Delete post
- `GET /api/blog` - List posts
- `GET /api/blog/[id]` - Get single post

**Usage**: For external integrations or automated posting

---

### Method 3: Direct Database Access
**Tool**: Any SQLite browser (DB Browser for SQLite, TablePlus, etc.)

**Steps**:
1. Open `light-site/database.sqlite`
2. Navigate to `blog_posts` table
3. Insert/Update/Delete rows directly
4. Refresh the website to see changes

**Schema**:
```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  subtitlePosition TEXT DEFAULT 'after',
  content TEXT NOT NULL,
  excerpt TEXT,
  coverImage TEXT,
  category TEXT NOT NULL,
  tags TEXT, -- JSON array
  author TEXT NOT NULL,
  publishedAt TEXT,
  status TEXT DEFAULT 'draft',
  viewCount INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  images TEXT, -- JSON array
  seo TEXT, -- JSON object
  isActive INTEGER DEFAULT 1,
  slug TEXT UNIQUE,
  folderPath TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)
```

---

### Method 4: Scripts
**Location**: `light-site/create-blog-posts.js`

**Purpose**: Bulk import posts from JSON files

**Usage**:
```bash
cd light-site
node create-blog-posts.js
```

**Input Format** (`new-blog-posts.json`):
```json
[
  {
    "title": "Post Title",
    "subtitle": "Subtitle",
    "content": "Content with <img> tags...",
    "category": "Category",
    "tags": ["tag1", "tag2"],
    "coverImage": "/path/to/image.jpg",
    "date": "2024-01-15"
  }
]
```

---

### Method 5: Programmatic (Code)
**Direct Repository Access**:
```typescript
import { BlogRepository } from '@/lib/database/blogRepository'

const blogRepo = new BlogRepository()

// Create
await blogRepo.create({
  title: "New Post",
  content: "Content...",
  category: "Tech",
  tags: ["coding"],
  author: "Admin",
  status: "published"
})

// Update
await blogRepo.update(postId, { title: "Updated Title" })

// Delete
await blogRepo.delete(postId)
```

---

## Data Migration

### Legacy to Database Migration
**Function**: `migrateLegacyDataToDatabase()` in `src/lib/blogData.ts`

**Purpose**: Moves posts from localStorage to SQLite database

**Usage**:
```typescript
import { migrateLegacyDataToDatabase } from '@/lib/blogData'

const result = await migrateLegacyDataToDatabase()
console.log(`Migrated ${result.migratedCount} posts`)
```

**Behavior**:
- Checks for existing posts in database (avoids duplicates)
- Converts legacy format to database format
- Preserves all post data
- Returns migration statistics

---

## Post Status Workflow

### Status Types:
1. **draft** - Not visible on blog page
2. **published** - Visible to all users
3. **archived** - Hidden but preserved

### Filtering:
```typescript
// Only published posts are shown
posts = posts.filter(post => post.status === 'published')
```

### Changing Status:
```typescript
// Publish a draft
await dataService.updateBlogPost(postId, { status: 'published' })

// Archive a post
await dataService.updateBlogPost(postId, { status: 'archived' })
```

---

## Database Seeding

### Auto-Seed on Empty Database
**Trigger**: Automatically when database has no posts

**Function**: `seedDatabase()` in `src/lib/database/seedData.ts`

**Contains**:
- 2 sample blog posts
- 17 gallery collections

**Manual Seeding**:
```typescript
import { seedDatabase, resetAndSeedDatabase } from '@/lib/database/seedData'

// Add seed data (keeps existing)
await seedDatabase()

// Reset and seed (clears all first)
await resetAndSeedDatabase()
```

---

## Data Format Conversion

### Legacy Format → Database Format
```typescript
// Legacy (localStorage)
{
  id: 1,
  title: "Title",
  subtitle: "Subtitle",
  content: "Content...",
  date: "2024-01-15",
  category: "Tech",
  tags: ["tag1"],
  coverImage: "/image.jpg",
  images: ["/img1.jpg", "/img2.jpg"]
}

// Database Format
{
  id: 1,
  title: "Title",
  subtitle: "Subtitle",
  content: "Content...",
  publishedAt: "2024-01-15T00:00:00.000Z",
  category: "Tech",
  tags: ["tag1"],
  coverImage: "/image.jpg",
  images: [
    { id: 1, url: "/img1.jpg", alt: "Image 1", position: 1 },
    { id: 2, url: "/img2.jpg", alt: "Image 2", position: 2 }
  ],
  author: "Admin",
  status: "published",
  viewCount: 0,
  likes: 0,
  seo: { ... },
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z"
}
```

---

## Key Files Reference

### Data Layer:
- `src/lib/database/sqlite.ts` - SQLite connection and queries
- `src/lib/database/blogRepository.ts` - Blog CRUD operations
- `src/lib/database/dataService.ts` - Unified data service
- `src/lib/database/schema.ts` - TypeScript interfaces
- `src/lib/database/seedData.ts` - Sample data for seeding

### Legacy Layer:
- `src/lib/blogData.ts` - localStorage utilities and migration

### UI Layer:
- `src/app/blog/page.tsx` - Blog listing page
- `src/app/admin/page.tsx` - Admin panel for managing posts

### Scripts:
- `create-blog-posts.js` - Bulk import script
- `scripts/init-database.js` - Database initialization

---

## Common Operations

### Add a New Post
```typescript
await dataService.createBlogPost({
  title: "My New Post",
  subtitle: "An exciting article",
  subtitlePosition: "after",
  content: "Full content here...",
  category: "Photography",
  tags: ["urban", "street"],
  author: "Stelly",
  coverImage: "/images/cover.jpg",
  status: "published",
  images: [
    { id: 1, url: "/images/1.jpg", alt: "Photo 1", position: 1 }
  ]
})
```

### Update Post Content
```typescript
await dataService.updateBlogPost(5, {
  content: "Updated content...",
  updatedAt: new Date().toISOString()
})
```

### Delete a Post
```typescript
await dataService.deleteBlogPost(5)
```

### Get Posts by Category
```typescript
const response = await dataService.getBlogPostsByCategory("Photography")
const posts = response.data
```

### Search Posts
```typescript
const response = await dataService.searchBlogPosts("urban photography")
const results = response.data
```

### Increment View Count
```typescript
await dataService.incrementBlogPostViews(postId)
```

---

## Best Practices

1. **Always use dataService** for data operations (not direct repository access)
2. **Set status to 'published'** for posts to appear on blog page
3. **Include cover images** for better visual presentation
4. **Add tags** for better discoverability and filtering
5. **Use meaningful slugs** for SEO-friendly URLs
6. **Backup database.sqlite** before bulk operations
7. **Test in draft status** before publishing

---

## Troubleshooting

### Posts Not Showing Up
- Check `status` field is set to `'published'`
- Verify post exists in database: `await dataService.getBlogPosts()`
- Check browser console for errors
- Clear localStorage and refresh

### Database Empty After Restart
- Database file should persist at `light-site/database.sqlite`
- Check file permissions
- Verify SQLite initialization in `sqlite.ts`

### Migration Issues
- Check for duplicate IDs
- Verify data format matches schema
- Review migration errors in console
- Use `resetAndSeedDatabase()` to start fresh

---

## Summary

**Reading Posts**: Database → localStorage → Seed Data (automatic fallback chain)

**Updating Posts**: Admin Panel (UI) → API Routes → Direct DB → Scripts → Code

**Storage**: SQLite database (`database.sqlite`) is the primary source, localStorage is legacy fallback

**Status**: Only posts with `status: 'published'` appear on the blog page
