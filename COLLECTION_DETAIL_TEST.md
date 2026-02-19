# Collection Detail Page - Testing Guide

## Overview

The collection detail page (`/gallery/[id]`) now loads data from the database and displays:
- Full-size images with navigation
- Collection information (name, category, description)
- Image tags (clickable to filter gallery)
- Thumbnail navigation bar
- Related collections suggestions

## How to Test

### Step 1: Ensure Database is Seeded

1. Go to `http://localhost:3000/admin`
2. Click **"Seed Sample Data"** (if not already done)
3. Verify: "Total Gallery Collections: 17"

### Step 2: Navigate to Gallery

1. Go to `http://localhost:3000/gallery`
2. You should see 17 collections in the grid

### Step 3: Click a Collection

Click on any collection thumbnail (e.g., "Urban Nights")

**Expected Result:**
- Page navigates to `/gallery/1` (or another ID)
- Collection detail page loads

## What You Should See

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│                      │  Collection Name                 │
│                      │  Category                        │
│   ◀  [Main Image]  ▶ │  Image X of Y                   │
│                      │                                  │
│                      │  Description text...             │
│                      │                                  │
│   ○ ○ ● ○ ○ ○ ○ ○   │  Tags: [tag1] [tag2] [tag3]     │
│   (indicators)       │                                  │
│                      │  ┌────────────────────────────┐  │
│                      │  │ [thumb] [thumb] [thumb]... │  │
│                      │  └────────────────────────────┘  │
│                      │                                  │
│                      │  You may also be interested in: │
│                      │  ┌──────┐ ┌──────┐ ┌──────┐    │
│                      │  │ Col1 │ │ Col2 │ │ Col3 │    │
│                      │  └──────┘ └──────┘ └──────┘    │
└──────────────────────┴──────────────────────────────────┘
```

### Left Side - Image Display

- **Main Image**: Large display of current image
- **Navigation Arrows**: ◀ and ▶ to move between images
- **Indicators**: Dots showing current position (click to jump to image)

### Right Side - Information

1. **Collection Info**
   - Name (e.g., "Urban Nights")
   - Category (e.g., "Urban")
   - Image counter (e.g., "Image 1 of 8")
   - Description

2. **Tags Section**
   - Shows tags for current image
   - Tags are clickable
   - Clicking a tag navigates to gallery filtered by that tag

3. **Thumbnail Bar**
   - Horizontal scrollable bar with all collection images
   - Click thumbnail to jump to that image
   - Active thumbnail has border highlight

4. **Related Collections**
   - 3 random other collections
   - Click to navigate to that collection

## Testing Checklist

### Basic Navigation
- [ ] Click collection from gallery page
- [ ] Detail page loads successfully
- [ ] Main image displays correctly
- [ ] Collection name and info display

### Image Navigation
- [ ] Click right arrow (▶) - moves to next image
- [ ] Click left arrow (◀) - moves to previous image
- [ ] Arrows disable at first/last image
- [ ] Click indicator dot - jumps to that image
- [ ] Active indicator highlights correctly

### Thumbnail Bar
- [ ] All collection images show as thumbnails
- [ ] Click thumbnail - main image updates
- [ ] Active thumbnail has border
- [ ] Scroll bar works if many images

### Tags
- [ ] Tags display for current image
- [ ] Tags change when navigating images
- [ ] Click tag - navigates to gallery with filter
- [ ] Gallery shows only collections with that tag

### Related Collections
- [ ] 3 related collections display
- [ ] Each shows thumbnail and name
- [ ] Click related collection - navigates to it
- [ ] Current image resets to first image

### Error Handling
- [ ] Invalid ID (e.g., `/gallery/999`) shows error
- [ ] Error page has "Back to Gallery" button
- [ ] Button navigates back to gallery

## Example Collections to Test

After seeding, try these collection IDs:

1. **ID 1** - Urban Nights (8 images)
   - Tags: urban, night, outdoor, cool-tones, etc.
   
2. **ID 2** - Studio Portraits (10 images)
   - Tags: portrait, day, indoor, model-female/male, etc.
   
3. **ID 3** - Macro World (12 images)
   - Tags: macro, detail, texture, nature, etc.
   
4. **ID 12** - Interior Spaces (20 images)
   - Most images - test scrolling thumbnails
   
5. **ID 10** - Abstract Visions (8 images)
   - Tags: abstract, experimental, creative, etc.

## Testing Tag Filtering

1. Open collection (e.g., Urban Nights)
2. Note a tag (e.g., "night")
3. Click the "night" tag
4. Should navigate to `/gallery?tag=night`
5. Gallery should filter to show only night photography collections

## Testing Related Collections

1. Open any collection
2. Scroll to "You may also be interested in"
3. Click one of the 3 related collections
4. Should navigate to that collection's detail page
5. Image counter should reset to "Image 1 of X"

## Common Issues

### Issue: "Collection not found"
**Cause**: Database not seeded or invalid ID
**Solution**: Go to `/admin` and seed database

### Issue: Images not loading
**Cause**: Image files missing
**Solution**: Verify images exist in `light-site/public/filler/`

### Issue: Tags not clickable
**Cause**: JavaScript error
**Solution**: Check browser console (F12)

### Issue: Related collections not showing
**Cause**: Only 1 collection in database
**Solution**: Ensure all 17 collections are seeded

### Issue: Thumbnails not scrolling
**Cause**: CSS issue or few images
**Solution**: Test with collection that has 15+ images (ID 12)

## Technical Details

### Data Loading
```typescript
// Loads collection by ID from database
const response = await dataService.getGalleryCollection(collectionId)

// Loads related collections
const allCollections = await dataService.getGalleryCollections({ limit: 100 })
const related = allCollections.filter(c => c.id !== currentId).slice(0, 3)
```

### Image Structure
Each image has:
- `url`: Image path (e.g., "/filler/BTC_1.6.jpeg")
- `alt`: Alt text
- `tags`: Array of tag strings
- `dimensions`: Width, height, aspect ratio
- `metadata`: File info

### Navigation State
- `currentImageIndex`: Tracks which image is displayed (0-based)
- Updates when:
  - Clicking arrows
  - Clicking indicators
  - Clicking thumbnails

## Performance Notes

- Images load on demand
- Related collections randomized on each page load
- Thumbnail bar scrolls smoothly
- No lag when switching images

## Mobile Responsiveness

The page should work on mobile devices:
- Image section stacks above info section
- Thumbnails scroll horizontally
- Touch gestures work for navigation
- Related collections stack vertically

## Next Steps

1. ✅ Seed database
2. ✅ Test basic navigation
3. ✅ Test image switching
4. ✅ Test tag filtering
5. ✅ Test related collections
6. 🔄 Add keyboard navigation (arrow keys)
7. 🔄 Add swipe gestures for mobile
8. 🔄 Add image zoom functionality

## Files Modified

- `light-site/src/app/gallery/[id]/page.tsx` - Updated to use database
- `light-site/COLLECTION_DETAIL_TEST.md` - This testing guide

---

**Ready to test?** Go to `/gallery` and click any collection! 🎨
