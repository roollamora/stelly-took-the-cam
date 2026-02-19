# Image Upload System

## Overview
Complete image upload system with automatic compression and server storage for blog and gallery images.

---

## How It Works

### 1. User Selects Image
- Admin panel file input
- Validates file type and size
- Accepts up to 50MB

### 2. Automatic Compression
```typescript
const result = await compressImage(file, {
  maxWidth: 3840,   // 4K
  maxHeight: 2160,
  quality: 0.9,
  maxSizeMB: 5
})
```

### 3. Upload to Server
```typescript
const formData = new FormData()
formData.append('file', compressedFile)
formData.append('folder', 'blog-images')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

### 4. Save to Database
- URL stored in database
- Image accessible at `/blog-images/[filename]`
- Permanent storage in `public/blog-images/`

---

## Upload Flow

```
User selects image
    ↓
Validate file (type, size)
    ↓
Compress to 4K (if needed)
    ↓
Upload to /api/upload
    ↓
Save to public/blog-images/
    ↓
Return public URL
    ↓
Store URL in database
    ↓
Display in blog/gallery
```

---

## API Endpoint

### POST /api/upload

**Request:**
```typescript
FormData {
  file: File           // Compressed image file
  folder: string       // 'blog-images' or 'gallery-images'
}
```

**Response:**
```json
{
  "success": true,
  "url": "/blog-images/1707398765432-abc123.jpg",
  "filename": "1707398765432-abc123.jpg"
}
```

**Error Response:**
```json
{
  "error": "Failed to upload file"
}
```

---

## File Storage

### Directory Structure
```
public/
  blog-images/           # Blog post images
    1707398765432-abc123.jpg
    1707398765433-def456.jpg
  gallery-images/        # Gallery images (future)
    collection-name/
      image1.jpg
      image2.jpg
```

### Filename Format
```
[timestamp]-[random].ext
Example: 1707398765432-abc123.jpg
```

- **timestamp**: Milliseconds since epoch
- **random**: 6-character random string
- **ext**: Original file extension

---

## Admin Panel Integration

### Cover Image Upload
```typescript
handleCoverImageSelect()
  → Validate file
  → Compress image
  → Upload to server
  → Update post.coverImage with URL
  → Save to database
```

### Content Images Upload
```typescript
handleImageFilesSelect()
  → Validate all files
  → Compress each image
  → Upload each to server
  → Collect all URLs
  → Update post.images array
  → Save to database
```

---

## Console Output

### Successful Upload
```
Compressing photo.jpg...
✓ Compressed photo.jpg: 15.2 MB → 2.8 MB (5.43x)
✓ Uploaded photo.jpg to: /blog-images/1707398765432-abc123.jpg
```

### Multiple Images
```
Processing 3 images...
✓ Compressed img1.jpg: 12.5 MB → 3.2 MB (3.9x)
✓ Uploaded img1.jpg to: /blog-images/1707398765432-abc123.jpg
✓ Compressed img2.jpg: 8.7 MB → 2.1 MB (4.1x)
✓ Uploaded img2.jpg to: /blog-images/1707398765433-def456.jpg
✓ Compressed img3.jpg: 15.3 MB → 3.8 MB (4.0x)
✓ Uploaded img3.jpg to: /blog-images/1707398765434-ghi789.jpg
✓ All 3 images uploaded successfully
```

---

## Database Storage

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  ...
  coverImage TEXT,              -- '/blog-images/xxx.jpg'
  images TEXT,                  -- JSON array of URLs
  ...
)
```

### Example Data
```json
{
  "coverImage": "/blog-images/1707398765432-abc123.jpg",
  "images": [
    {
      "id": 1,
      "url": "/blog-images/1707398765433-def456.jpg",
      "alt": "Image 1",
      "position": 1
    },
    {
      "id": 2,
      "url": "/blog-images/1707398765434-ghi789.jpg",
      "alt": "Image 2",
      "position": 2
    }
  ]
}
```

---

## Image Display

### In Blog Posts
```html
<img src="/blog-images/1707398765432-abc123.jpg" alt="Cover" />
```

### In Gallery
```html
<img src="/gallery-images/collection/image.jpg" alt="Gallery" />
```

---

## Features

### ✅ Automatic Compression
- Max 4K resolution
- 90% quality
- Under 5MB file size

### ✅ Unique Filenames
- Timestamp-based
- No collisions
- Sortable by date

### ✅ Organized Storage
- Separate folders per type
- Easy to backup
- Simple to manage

### ✅ Database Integration
- URLs stored in database
- Easy to query
- Portable data

### ✅ Error Handling
- Validation before upload
- Graceful failure
- User feedback

---

## Security

### File Validation
- Only image types allowed
- Max 50MB before compression
- Extension checking
- MIME type validation

### Storage Security
- Files stored in public directory
- No executable files
- Sanitized filenames
- No path traversal

---

## Performance

### Upload Speed
- **Small images** (<2MB): < 1 second
- **Medium images** (2-10MB): 1-3 seconds
- **Large images** (10-50MB): 3-8 seconds

### Compression Impact
- Reduces bandwidth by 3-5x
- Faster page loads
- Better SEO
- Lower hosting costs

---

## Troubleshooting

### Upload Fails
1. Check file size (< 50MB)
2. Check file type (JPEG, PNG, WebP, GIF)
3. Check server permissions on `public/blog-images/`
4. Check console for errors

### Images Not Displaying
1. Verify URL in database
2. Check file exists in `public/blog-images/`
3. Check file permissions
4. Clear browser cache

### Compression Issues
1. Check browser console
2. Verify file is valid image
3. Try smaller file
4. Check browser compatibility

---

## Future Enhancements

### Planned Features
- [ ] Gallery image uploads
- [ ] Image cropping tool
- [ ] Bulk upload with progress bar
- [ ] Image optimization presets
- [ ] CDN integration
- [ ] Image metadata extraction
- [ ] Automatic alt text generation
- [ ] Image versioning

---

## Summary

The image upload system provides:
1. **Automatic compression** to 4K resolution
2. **Server storage** in organized folders
3. **Database integration** with URLs
4. **Error handling** and validation
5. **Console feedback** for monitoring

All images are compressed, uploaded, and stored permanently with URLs saved in the database for easy retrieval and display.
