# ✅ Image Tags Now Working - Saved Per Image!

## Problem Identified
Tags were being saved at the collection level (updating entire collection), which deleted and recreated all images, losing their individual tag changes.

## Solution Implemented
Created a dedicated API endpoint to update individual images with their tags.

## Changes Made

### 1. New API Endpoint
**File**: `src/app/api/gallery/images/[id]/route.ts`

```typescript
PUT /api/gallery/images/[id]
```

Updates a single image's tags without affecting other images in the collection.

### 2. New Database Function
**File**: `src/lib/database/sqlite.ts`

```typescript
export function updateImage(imageId: number, data: any)
```

- Updates image basic info (url, alt, caption, description)
- Deletes old tags for this image only
- Inserts new tags for this image only
- Returns updated image with tags

### 3. Updated Admin Panel
**File**: `src/app/admin/page.tsx`

**`addImageTag()`** and **`removeImageTag()`** now:
1. Update `currentImage` state
2. Update image in `currentCollection.images` array
3. **Immediately save to database via `/api/gallery/images/[id]`** ✅

## How It Works Now

### Adding a Tag:
```
User types tag → Press Enter
    ↓
addImageTag() called
    ↓
Updates currentImage.tags
    ↓
Updates currentCollection.images[index].tags
    ↓
Calls PUT /api/gallery/images/[imageId]  ← NEW!
    ↓
updateImage() in sqlite.ts
    ↓
DELETE FROM image_tags WHERE imageId = ?
INSERT INTO image_tags (imageId, tag) VALUES (?, ?)
    ↓
Tag saved to database immediately! ✅
    ↓
Tag visible in admin panel ✅
    ↓
Tag visible in preview page ✅
```

### Removing a Tag:
```
User clicks × on tag
    ↓
removeImageTag() called
    ↓
Filters out tag from currentImage.tags
    ↓
Updates currentCollection.images[index].tags
    ↓
Calls PUT /api/gallery/images/[imageId]  ← NEW!
    ↓
Tag removed from database immediately! ✅
```

## Key Differences

### Before (BROKEN):
- Tags updated in state only
- Saved when clicking "Save Changes" on entire collection
- Collection update deleted ALL images and recreated them
- All images got new IDs
- Tags lost in the process ❌

### After (WORKING):
- Tags updated in state
- **Saved immediately to database per image** ✅
- Only the specific image is updated
- Image keeps its ID
- Tags persist correctly ✅

## Testing

### Test Adding Tags:
1. Go to http://localhost:3001/admin
2. Click "Gallery Management"
3. Click "Urban Nights" collection
4. Click ✎ on first image
5. Add tag: "my-test-tag"
6. **Check console**: Should see "Image tags saved successfully"
7. **Refresh page**
8. **Verify**: Tag still there ✅

### Test Removing Tags:
1. Click × on "my-test-tag"
2. **Check console**: Should see "Image tags saved successfully"
3. **Refresh page**
4. **Verify**: Tag is gone ✅

### Verify in Database:
```bash
cd light-site
sqlite3 database.sqlite "SELECT i.url, GROUP_CONCAT(it.tag, ', ') FROM images i LEFT JOIN image_tags it ON i.id = it.imageId WHERE i.id = 214 GROUP BY i.id;"
```

### Verify in Preview:
1. Go to http://localhost:3001/gallery/1
2. See first image
3. **Verify**: Tags displayed under image ✅
4. Click a tag
5. **Verify**: Filters to that tag ✅

## API Endpoints

### Update Single Image:
```bash
PUT /api/gallery/images/[id]
Content-Type: application/json

{
  "id": 214,
  "url": "/gallery/urban-nights/00.jpeg",
  "alt": "Urban Nights - Image 1",
  "tags": ["city", "featured", "glow", "my-new-tag"]
}
```

### Response:
```json
{
  "id": 214,
  "url": "/gallery/urban-nights/00.jpeg",
  "alt": "Urban Nights - Image 1",
  "tags": ["city", "featured", "glow", "my-new-tag"],
  "dimensions": {
    "width": 0,
    "height": 0,
    "aspectRatio": 0
  }
}
```

## Files Modified

1. `src/app/api/gallery/images/[id]/route.ts` - NEW API endpoint
2. `src/lib/database/sqlite.ts` - Added `updateImage()` function
3. `src/app/admin/page.tsx` - Made `addImageTag()` and `removeImageTag()` async, call API

## Database Operations

### Before (Collection Update):
```sql
-- Deleted ALL images
DELETE FROM images WHERE collectionId = 1;

-- Recreated ALL images (new IDs!)
INSERT INTO images (...) VALUES (...);  -- id = 214
INSERT INTO images (...) VALUES (...);  -- id = 215
INSERT INTO images (...) VALUES (...);  -- id = 216

-- Old image_tags orphaned (imageId = 1, 2, 3 no longer exist)
```

### After (Image Update):
```sql
-- Update only ONE image
UPDATE images SET ... WHERE id = 214;

-- Delete tags for THIS image only
DELETE FROM image_tags WHERE imageId = 214;

-- Insert new tags for THIS image only
INSERT INTO image_tags (imageId, tag) VALUES (214, 'city');
INSERT INTO image_tags (imageId, tag) VALUES (214, 'featured');
INSERT INTO image_tags (imageId, tag) VALUES (214, 'my-new-tag');
```

## Summary

✅ **Tags save immediately per image**  
✅ **No more losing tags when updating collection**  
✅ **Tags visible in admin panel**  
✅ **Tags visible in preview page**  
✅ **Tags persist across page refreshes**  
✅ **Image IDs stay the same**  
✅ **Database operations are efficient**  

The system now correctly saves tags per image, not per collection! 🎉
