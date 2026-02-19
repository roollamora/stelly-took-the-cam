# Unified Content Feed Documentation

## Overview

The unified content feed is a meta-list system that aggregates content from all sources (blog posts, gallery collections, projects, etc.) and displays the most recent items in the center section of the homepage. This creates a dynamic "Recent Input" showcase that automatically updates as new content is added.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                  CONTENT SOURCES                         │
│         (Blog Posts, Gallery, Projects, etc.)           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              DATA SERVICE                                │
│         getRecentContent(limit)                          │
│    • Fetches from all repositories                      │
│    • Normalizes data format                             │
│    • Sorts by date (newest first)                       │
│    • Returns unified array                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           SECOND SECTION COMPONENT                       │
│         (Homepage Center Section)                        │
│    • Loads recent content on mount                      │
│    • Displays in horizontal scroll grid                 │
│    • Shows content type badges                          │
│    • Links to individual content pages                  │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### 1. Data Service Method

Location: `src/lib/database/dataService.ts`

```typescript
async getRecentContent(limit: number = 10): Promise<UnifiedContent[]>
```

**What it does:**
- Fetches recent blog posts (sorted by publishedAt)
- Fetches recent gallery collections (sorted by createdAt)
- Normalizes both into a unified format
- Sorts all content by date (newest first)
- Returns the top N items

**Unified Content Format:**
```typescript
{
  type: 'blog' | 'gallery' | 'project'
  id: number | string
  title: string
  subtitle?: string
  category: string
  image: string
  description?: string
  date: string
  link: string
}
```

### 2. Homepage Component

Location: `src/components/SecondSection.tsx`

**Features:**
- Loads recent content on component mount
- Falls back to default items if database is empty
- Displays content in horizontal scrolling grid
- Shows content type badges (📝 Blog, 🖼️ Gallery, 🎨 Project)
- Wraps each item in a Link component for navigation
- Hover effects for better UX

**Key State:**
```typescript
const [items, setItems] = useState<ContentItem[]>([])
const [isLoading, setIsLoading] = useState(true)
```

**Loading Logic:**
```typescript
useEffect(() => {
  const loadRecentContent = async () => {
    try {
      const recentContent = await dataService.getRecentContent(12)
      if (recentContent.length > 0) {
        setItems(recentContent)
      } else {
        setItems(defaultItems) // Fallback
      }
    } catch (error) {
      console.error('Error loading recent content:', error)
      setItems(defaultItems)
    } finally {
      setIsLoading(false)
    }
  }
  
  loadRecentContent()
}, [])
```

### 3. Visual Design

**Layout:**
- Horizontal scrolling grid
- Each item is 50vh wide × 100vh tall
- Split into two cells (top/bottom)
- Alternating text/image layout
- Smooth scroll navigation with arrow buttons

**Content Type Badges:**
- 📝 Blog - for blog posts
- 🖼️ Gallery - for gallery collections
- 🎨 Project - for project entries (future)

**Hover Effects:**
- Column lifts up slightly (translateY)
- Shadow appears beneath
- Image scales up (1.05x)
- Smooth transitions (0.3s ease)

**Styling:**
```css
.column {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.column:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.column:hover .image {
  transform: scale(1.05);
}
```

## Usage

### Accessing the Feed Programmatically

```typescript
import { dataService } from '@/lib/database/dataService'

// Get 10 most recent items
const recentContent = await dataService.getRecentContent(10)

// Get 20 most recent items
const moreContent = await dataService.getRecentContent(20)

// Process the results
recentContent.forEach(item => {
  console.log(`${item.type}: ${item.title}`)
  console.log(`Date: ${item.date}`)
  console.log(`Link: ${item.link}`)
})
```

### Adding New Content Types

To add a new content type (e.g., "Projects"):

1. **Create Repository** (if needed)
   ```typescript
   // src/lib/database/projectRepository.ts
   export class ProjectRepository extends BaseRepository<Project> {
     // Implementation
   }
   ```

2. **Add to Data Service**
   ```typescript
   // src/lib/database/dataService.ts
   async getRecentContent(limit: number = 10) {
     const [blogPosts, galleryCollections, projects] = await Promise.all([
       this.getBlogPosts({ sortBy: 'publishedAt', sortOrder: 'desc', limit: 50 }),
       this.getGalleryCollections({ sortBy: 'createdAt', sortOrder: 'desc', limit: 50 }),
       this.getProjects({ sortBy: 'createdAt', sortOrder: 'desc', limit: 50 }) // NEW
     ])
     
     // Add projects to unified content
     if (projects.success && projects.data) {
       projects.data.forEach(project => {
         unifiedContent.push({
           type: 'project',
           id: project.id,
           title: project.name,
           subtitle: project.description,
           category: project.category,
           image: project.coverImage,
           description: project.description,
           date: project.createdAt,
           link: `/projects/${project.id}`
         })
       })
     }
     
     // Sort and return
     return unifiedContent
       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, limit)
   }
   ```

3. **Update Type Definition**
   ```typescript
   // src/components/SecondSection.tsx
   interface ContentItem {
     type: 'blog' | 'gallery' | 'project' // Add 'project'
     // ... rest of interface
   }
   ```

4. **Update Badge Display**
   ```typescript
   <div className={styles.contentType}>
     {item.type === 'blog' ? '📝 Blog' : 
      item.type === 'gallery' ? '🖼️ Gallery' : 
      item.type === 'project' ? '🎨 Project' : 
      '📄 Content'}
   </div>
   ```

## Benefits

### 1. Centralized Content Discovery
- Users see the latest content from all sources in one place
- No need to navigate to individual sections to find new content
- Creates a unified "what's new" experience

### 2. Automatic Updates
- New blog posts automatically appear in the feed
- New gallery collections automatically appear in the feed
- No manual curation required

### 3. Date-Based Sorting
- Most recent content always appears first
- Ensures fresh content is highlighted
- Older content naturally moves down the list

### 4. Type Identification
- Content type badges help users understand what they're viewing
- Visual distinction between different content types
- Consistent iconography (📝 🖼️ 🎨)

### 5. Direct Navigation
- Each item links directly to its detail page
- Hover effects provide visual feedback
- Smooth user experience

### 6. Scalability
- Easy to add new content types
- Unified format makes integration simple
- Repository pattern ensures consistency

## Performance Considerations

### Caching
The feed data could be cached to improve performance:

```typescript
// Example caching implementation
let cachedContent: ContentItem[] | null = null
let cacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getCachedRecentContent(limit: number = 10) {
  const now = Date.now()
  
  if (cachedContent && (now - cacheTime) < CACHE_DURATION) {
    return cachedContent.slice(0, limit)
  }
  
  const content = await dataService.getRecentContent(limit)
  cachedContent = content
  cacheTime = now
  
  return content
}
```

### Pagination
For large datasets, consider implementing pagination:

```typescript
async getRecentContent(
  limit: number = 10,
  offset: number = 0
): Promise<UnifiedContent[]> {
  // ... fetch and sort logic ...
  
  return unifiedContent
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(offset, offset + limit)
}
```

### Lazy Loading
Images could be lazy-loaded for better initial page load:

```typescript
<img 
  src={item.image} 
  alt={item.title} 
  loading="lazy"
  className={styles.image} 
/>
```

## Future Enhancements

### 1. Filtering
Allow users to filter by content type:

```typescript
const [filter, setFilter] = useState<'all' | 'blog' | 'gallery' | 'project'>('all')

const filteredItems = items.filter(item => 
  filter === 'all' || item.type === filter
)
```

### 2. Search
Add search functionality across all content:

```typescript
const [searchQuery, setSearchQuery] = useState('')

const searchResults = await dataService.globalSearch(searchQuery)
```

### 3. Infinite Scroll
Load more content as user scrolls:

```typescript
const [page, setPage] = useState(0)
const [hasMore, setHasMore] = useState(true)

const loadMore = async () => {
  const moreContent = await dataService.getRecentContent(12, page * 12)
  if (moreContent.length > 0) {
    setItems([...items, ...moreContent])
    setPage(page + 1)
  } else {
    setHasMore(false)
  }
}
```

### 4. Personalization
Show content based on user preferences:

```typescript
async getPersonalizedContent(
  userId: number,
  limit: number = 10
): Promise<UnifiedContent[]> {
  const userPreferences = await getUserPreferences(userId)
  const content = await this.getRecentContent(50)
  
  // Filter and sort based on preferences
  return content
    .filter(item => userPreferences.categories.includes(item.category))
    .slice(0, limit)
}
```

### 5. Analytics
Track which content gets the most engagement:

```typescript
const trackContentView = async (contentId: string, contentType: string) => {
  await dataService.trackView(contentId, contentType)
}

// In component
<Link 
  href={item.link}
  onClick={() => trackContentView(item.id.toString(), item.type)}
>
```

## Troubleshooting

### Content Not Appearing

1. **Check Database**
   ```typescript
   const stats = await dataService.getContentStats()
   console.log('Total blog posts:', stats.totalBlogPosts)
   console.log('Total gallery collections:', stats.totalGalleryCollections)
   ```

2. **Check Date Format**
   Ensure dates are in ISO format: `2024-01-01T00:00:00.000Z`

3. **Check Status**
   Blog posts must have `status: 'published'` to appear

### Images Not Loading

1. **Check Image Paths**
   Ensure images are in `/public/filler/` directory

2. **Check Image URLs**
   URLs should start with `/filler/` not `filler/`

3. **Check Fallback**
   Default image is used if coverImage is empty

### Links Not Working

1. **Check Link Format**
   - Blog: `/blog#post-${id}`
   - Gallery: `/gallery/${id}`
   - Project: `/projects/${id}`

2. **Check ID Type**
   IDs can be numbers or strings depending on content type

## Conclusion

The unified content feed provides a powerful, flexible way to showcase recent content from all sources on the homepage. It's designed to be:

- **Automatic**: Updates as new content is added
- **Unified**: Single interface for all content types
- **Scalable**: Easy to add new content types
- **Performant**: Efficient data fetching and rendering
- **User-Friendly**: Clear visual design with intuitive navigation

The system serves as a central hub for content discovery and helps users stay up-to-date with the latest additions to the website.