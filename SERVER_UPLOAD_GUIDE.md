# Server Upload Implementation Guide - Folder-Based System

## Overview
The admin interface now supports a folder-based file management system where each blog post gets its own dedicated folder with numbered files. This provides better organization and prevents file conflicts.

## Folder Structure
```
public/
└── posts/
    ├── post-1234567890-my-first-blog-post/
    │   ├── 00.jpg  (cover image)
    │   ├── 01.jpg  (first content image)
    │   ├── 02.jpg  (second content image)
    │   └── ...
    └── post-1234567891-another-blog-post/
        ├── 00.jpg
        ├── 01.jpg
        └── ...
```

## Current Implementation
- ✅ Folder creation based on post title and timestamp
- ✅ Numbered file naming (00.jpg for cover, 01.jpg, 02.jpg for content)
- ✅ Sequential upload with position tracking
- ✅ Visual folder structure display in admin
- ✅ Automatic folder cleanup on post deletion
- ✅ API routes for folder-based uploads (`/api/upload/post-folder`)

## File Naming Convention
- **Cover Image**: Always `00.jpg` (or appropriate extension)
- **Content Images**: Sequential numbering starting from `01.jpg`
- **Extensions**: Preserved from original files (.jpg, .png, .gif, .webp)
- **Folder Names**: `post-{timestamp}-{sanitized-title}`

## Blog Post Ordering
- ✅ **Newest First**: Posts are now sorted by date (newest first), then by ID
- ✅ **Proper Sorting**: Later posts appear at the top of the blog

## To Enable Server Upload

### 1. Create Posts Directory
```bash
mkdir -p light-site/public/posts
```

### 2. Update API Route (`src/app/api/upload/post-folder/route.ts`)
The API route is already implemented and ready to use. It handles:
- Folder creation with proper permissions
- Numbered file naming
- File validation and size limits
- Cleanup operations

### 3. Update Upload Utils (`src/lib/uploadUtils.ts`)
Uncomment the server upload code in the folder-based functions:

```typescript
// Enable the fetch calls to /api/upload/post-folder
const formData = new FormData()
formData.append('file', file)
formData.append('folderPath', folderPath)
formData.append('filename', numberedFilename)

const response = await fetch('/api/upload/post-folder', {
  method: 'POST',
  body: formData
})
```

### 4. Add Required Dependencies
```bash
npm install fs-extra
npm install @types/fs-extra --save-dev
```

## Alternative Storage Options

### Option 1: Local File System (Current Setup)
- Files stored in `public/uploads/`
- Accessible via `/uploads/filename.jpg`
- Simple but not scalable for production

### Option 2: Cloud Storage (Recommended for Production)

#### AWS S3
```bash
npm install @aws-sdk/client-s3
```

#### Cloudinary
```bash
npm install cloudinary
```

#### Vercel Blob (if deploying to Vercel)
```bash
npm install @vercel/blob
```

### Option 3: Database Storage (Base64)
- Store images as base64 strings in database
- Good for small images, not recommended for large files

## File Structure After Implementation
```
light-site/
├── public/
│   └── uploads/           # Uploaded images
│       ├── 1234567890-abc123.jpg
│       └── 1234567890-def456.png
├── src/
│   ├── app/
│   │   └── api/
│   │       └── upload/
│   │           └── route.ts    # Upload API endpoint
│   └── lib/
│       └── uploadUtils.ts      # Upload utilities
```

## Security Considerations

### File Validation
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- 🔄 Add filename sanitization
- 🔄 Add virus scanning for production

### Access Control
- 🔄 Add authentication to upload endpoint
- 🔄 Implement user-specific upload directories
- 🔄 Add rate limiting

### Storage Security
- 🔄 Generate unique filenames to prevent conflicts
- 🔄 Store files outside web root if possible
- 🔄 Implement file cleanup for unused images

## Environment Variables
Add to `.env.local`:
```
# For cloud storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket

# Or for Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Testing Upload Functionality

### 1. Test File Validation
- Try uploading non-image files (should fail)
- Try uploading files > 5MB (should fail)
- Try uploading valid images (should succeed)

### 2. Test Multiple Uploads
- Select multiple images at once
- Verify all images are processed
- Check that previews work correctly

### 3. Test Cleanup
- Create posts with images
- Delete posts
- Verify temporary URLs are cleaned up

## Production Deployment Notes

### Vercel Deployment
- Use Vercel Blob for file storage
- Files in `public/uploads` won't persist between deployments

### Traditional Hosting
- Ensure `public/uploads` directory has write permissions
- Set up regular cleanup of unused files
- Consider CDN for image delivery

## Current File Flow
1. User selects image file(s) via file browser
2. Files are validated (type, size)
3. Temporary blob URLs created for immediate preview
4. Files stored in component state for future upload
5. When post is saved, files are ready for server upload
6. Temporary URLs cleaned up when form is reset

## Ready for Production
The current implementation is production-ready for the preview functionality. To enable actual server storage, simply:
1. Uncomment the server upload code
2. Create the uploads directory
3. Test the upload endpoint

All the infrastructure is in place - just needs the server storage implementation activated.