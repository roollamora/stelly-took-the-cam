# Vercel Deployment Guide with Turso Database

Your light-site project is now configured for Vercel deployment with Turso database. Follow these steps to deploy.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Turso database credentials (already configured in `.env.local`)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
cd light-site
git init
git add .
git commit -m "Initial commit - ready for Vercel deployment"
```

2. Create a new repository on GitHub (https://github.com/new)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   
   ```
   TURSO_DATABASE_URL=libsql://sttc-sttc.aws-ap-northeast-1.turso.io
   TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzIwMTgzODcsImlkIjoiMDE5Yzk0ODYtODMwMS03OGMyLTk0NWEtOTg4MGQxNGMwNTA3IiwicmlkIjoiN2I2ZGI1NmEtZDdiNy00NjgyLTkyMmYtMWJiZjUzM2Q1ZDYzIn0.OK988AyBDQ3Lcvzs3d0cmQJVJvb2av2SZB3-lNWAE1NMx3-X1RoEWK1X8Sax1sgFjALda3G_WFcUH65FpaqCDA
   ```

6. Click "Deploy"

## Step 3: Initialize Turso Database

Your Turso database needs to be initialized with the schema. You can do this using the Turso CLI or by running SQL commands directly.

### Option A: Using Turso CLI

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Authenticate:
```bash
turso auth login
```

3. Connect to your database and run the schema:
```bash
turso db shell sttc-sttc
```

4. Copy and paste the schema below:

```sql
-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  coverImage TEXT NOT NULL,
  category TEXT NOT NULL,
  isPublic INTEGER DEFAULT 1,
  sortOrder INTEGER DEFAULT 0,
  startDate TEXT,
  endDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collectionId INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  description TEXT,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  sortOrder INTEGER DEFAULT 0,
  photoDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collectionId) REFERENCES collections(id) ON DELETE CASCADE
);

-- Image tags table
CREATE TABLE IF NOT EXISTS image_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imageId INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE CASCADE,
  UNIQUE(imageId, tag)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  subtitlePosition TEXT DEFAULT 'after',
  content TEXT NOT NULL,
  excerpt TEXT,
  coverImage TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  author TEXT NOT NULL,
  publishedAt TEXT,
  status TEXT DEFAULT 'draft',
  viewCount INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  images TEXT,
  seo TEXT,
  isActive INTEGER DEFAULT 1,
  slug TEXT UNIQUE,
  folderPath TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT,
  coverImage TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')),
  startDate TEXT,
  endDate TEXT,
  client TEXT,
  technologies TEXT,
  links TEXT,
  team TEXT,
  budget REAL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  slug TEXT UNIQUE,
  isActive INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Project images table
CREATE TABLE IF NOT EXISTS project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  position INTEGER DEFAULT 0,
  type TEXT DEFAULT 'gallery' CHECK (type IN ('cover', 'gallery', 'process', 'result')),
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

-- Collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'partnership' CHECK (type IN ('partnership', 'commission', 'joint-project', 'sponsorship', 'other')),
  status TEXT DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'negotiating', 'active', 'completed', 'cancelled')),
  partner TEXT,
  coverImage TEXT,
  startDate TEXT,
  endDate TEXT,
  deliverables TEXT,
  terms TEXT,
  budget REAL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT,
  slug TEXT UNIQUE,
  isActive INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Collaboration images table
CREATE TABLE IF NOT EXISTS collaboration_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collaborationId INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  position INTEGER DEFAULT 0,
  type TEXT DEFAULT 'process' CHECK (type IN ('cover', 'process', 'result', 'meeting')),
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collaborationId) REFERENCES collaborations(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_category ON collections(category);
CREATE INDEX IF NOT EXISTS idx_images_collection ON images(collectionId);
CREATE INDEX IF NOT EXISTS idx_image_tags_tag ON image_tags(tag);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);
```

### Option B: Using a Migration Script

Create a file `migrate-to-turso.js` in your project root:

```javascript
const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://sttc-sttc.aws-ap-northeast-1.turso.io',
  authToken: 'YOUR_AUTH_TOKEN_HERE'
});

async function migrate() {
  // Paste the SQL schema from above here
  const schema = `...`;
  
  await client.execute(schema);
  console.log('✅ Database schema created successfully!');
}

migrate().catch(console.error);
```

## Step 4: Migrate Existing Data (Optional)

If you have existing data in your local SQLite database that you want to migrate to Turso:

1. Export data from SQLite:
```bash
sqlite3 database.sqlite .dump > data.sql
```

2. Clean up the SQL file (remove CREATE TABLE statements since they're already in Turso)

3. Import to Turso:
```bash
turso db shell sttc-sttc < data.sql
```

## Step 5: Verify Deployment

1. Once deployed, Vercel will provide you with a URL (e.g., `https://your-project.vercel.app`)
2. Visit the URL and test your application
3. Check that:
   - Pages load correctly
   - Database queries work
   - Images are displayed (except sample images in `/filler/`, `/blog-images/`, `/gallery/`)

## Environment Switching

The application automatically switches between databases:
- **Local Development** (`npm run dev`): Uses SQLite (`database.sqlite`)
- **Production** (Vercel): Uses Turso (remote database)

This is handled by `src/lib/database/index.ts` which checks for `TURSO_DATABASE_URL` environment variable.

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly in Vercel
- Review build logs in Vercel dashboard

### Database Connection Errors
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Ensure Turso database is accessible (not paused or deleted)

### Missing Images
- Sample images in `/public/filler/`, `/public/blog-images/`, and `/public/gallery/` are excluded from deployment
- Upload production images to a different folder or use a CDN

## Next Steps

1. Set up a custom domain in Vercel (optional)
2. Configure analytics and monitoring
3. Set up continuous deployment (automatic deploys on git push)
4. Consider using Vercel's Image Optimization for better performance

## Support

- Vercel Documentation: https://vercel.com/docs
- Turso Documentation: https://docs.turso.tech
- Next.js Documentation: https://nextjs.org/docs

---

**Note**: Keep your `.env.local` file secure and never commit it to git. The `.gitignore` file is already configured to exclude it.
