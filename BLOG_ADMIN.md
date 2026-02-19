# Blog Admin Interface

## Overview
The blog admin interface allows you to manage blog posts for the STTC (Stelly Took The Cam) website. It provides a complete CRUD (Create, Read, Update, Delete) system for blog posts with preview functionality.

## Access
Navigate to `/admin` to access the admin interface.

## Features

### Post Management
- **Create New Posts**: Add new blog posts with all metadata
- **Edit Existing Posts**: Modify any existing post
- **Delete Posts**: Remove posts from the blog
- **Preview Posts**: See how posts will look on the blog before publishing

### Post Fields
- **Title**: Main post title
- **Subtitle**: Secondary title/description
- **Subtitle Position**: Choose whether subtitle appears before or after the title
- **Category**: Post category (Photography, Studio, etc.)
- **Date**: Publication date
- **Tags**: Multiple tags for categorization
- **Cover Image**: Optional cover image that floats left
- **Content**: Main post content with embedded images
- **Images**: Manage images that can be inserted into content

### Image Management
- Add image paths to the image library
- Insert images directly into content at cursor position
- Images automatically alternate between left and right float positions
- Cover images count in the alternating sequence

### Data Persistence
- All posts are automatically saved to browser localStorage
- Changes are immediately reflected on the main blog page
- Export posts to JSON file for backup
- Import posts from JSON file to restore data

### Text Wrapping
The blog implements proper text wrapping around floating images:
- Cover images always float left
- Inline images alternate between left and right positions
- Text flows naturally around images without creating empty columns
- Images are limited to 300px width for consistent layout

## Usage Instructions

1. **Creating a Post**:
   - Fill in the title, subtitle, and other metadata
   - Add tags by typing and pressing Enter or clicking "Add"
   - Add images to the image library
   - Write content in the main text area
   - Use the "Insert" button next to images to add them to content
   - Click "Create Post" to save

2. **Editing a Post**:
   - Click "Edit" on any existing post
   - Modify fields as needed
   - Click "Update Post" to save changes

3. **Previewing**:
   - Click "Preview" on any post to see how it will appear on the blog
   - Preview shows proper text wrapping and image positioning

4. **Data Management**:
   - Use "Export Posts" to download all posts as JSON
   - Use "Import Posts" to upload and restore posts from JSON file

## Technical Details

### Image Formatting
Images in content should use the format:
```html
<img src="/filler/image.jpeg" alt="Description" />
```

### Alternating Float Logic
- Cover image (if present): floats left (position 0)
- First inline image: floats right (position 1)
- Second inline image: floats left (position 2)
- And so on...

### Data Structure
Posts are stored with the following structure:
```typescript
interface BlogPost {
  id: number
  title: string
  subtitle: string
  subtitlePosition: 'before' | 'after'
  category: string
  date: string
  tags: string[]
  coverImage: string
  content: string
  images: string[]
}
```

## Integration
The admin interface is fully integrated with the main blog page. Changes made in the admin are immediately visible on the blog without requiring a page refresh or server restart.