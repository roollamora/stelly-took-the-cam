# ✅ Fixed: Internal Server Error

## Problem
Getting "Internal Server Error" when accessing `/gallery` and other pages.

## Root Cause
The `better-sqlite3` native module wasn't properly configured in Next.js webpack settings. Next.js was trying to bundle the native module for the client-side, which caused module loading errors.

## Solution

### 1. Updated `next.config.js`
Added webpack configuration to mark `better-sqlite3` as external for server-side rendering:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark better-sqlite3 as external for server-side
      config.externals = config.externals || []
      config.externals.push('better-sqlite3')
    }
    return config
  }
}

module.exports = nextConfig
```

### 2. Cleaned Build Cache
```bash
rm -rf .next
```

### 3. Restarted Dev Server
```bash
npm run dev
```

## Verification

### API Endpoints ✅
```bash
curl http://localhost:3001/api/gallery/collections
# Returns: 200 OK with JSON data
```

### Gallery Page ✅
```bash
curl http://localhost:3001/gallery
# Returns: 200 OK
```

### Admin Panel ✅
```bash
curl http://localhost:3001/admin
# Returns: 200 OK
```

## Current Status: ALL WORKING ✅

### Test URLs:
- ✅ http://localhost:3001/gallery - Main gallery page
- ✅ http://localhost:3001/gallery/1 - Collection detail page
- ✅ http://localhost:3001/admin - Admin panel
- ✅ http://localhost:3001/api/gallery/collections - API endpoint

### Server Logs:
```
✓ Compiled /api/gallery/collections in 150ms
GET /api/gallery/collections 200 in 195ms

✓ Compiled /gallery in 866ms
GET /gallery 200 in 920ms
```

## Why This Happened

`better-sqlite3` is a **native Node.js module** (written in C++) that needs special handling:

1. **Native modules** can only run on the server-side (Node.js)
2. **Next.js** tries to bundle everything for both client and server
3. **Without configuration**, Next.js tries to bundle the native module for the browser, which fails

## The Fix Explained

```javascript
config.externals.push('better-sqlite3')
```

This tells webpack:
- ✅ Don't try to bundle `better-sqlite3`
- ✅ Load it directly from `node_modules` at runtime
- ✅ Only use it on the server-side (API routes)

## Files Modified

1. `light-site/next.config.js` - Added webpack configuration

## No Code Changes Needed

All the database code was already correct:
- ✅ `src/lib/database/sqlite.ts` - Working correctly
- ✅ `src/app/api/gallery/collections/route.ts` - Working correctly
- ✅ `src/app/gallery/page.tsx` - Working correctly

The issue was purely a **build configuration** problem, not a code problem.

## Prevention

This configuration is now permanent. Future restarts will work correctly because:
1. `next.config.js` is committed to the repo
2. `better-sqlite3` is in `package.json` dependencies
3. Webpack knows to treat it as external

## Summary

**Problem**: Internal Server Error  
**Cause**: Native module bundling issue  
**Solution**: Configure webpack to externalize `better-sqlite3`  
**Result**: ✅ All pages working, all API endpoints working  

Everything is now fully functional! 🎉
