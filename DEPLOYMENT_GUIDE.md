# Deployment Guide - Stelly Took The Cam

Complete step-by-step guide to deploy your photography portfolio website.

## Prerequisites

- ✅ GitHub account (you have this)
- ✅ Domain purchased (you have this)
- Node.js and npm installed
- Terminal/command line access

## Quick Start (Automated)

The easiest way to deploy is using the automated script:

```bash
cd light-site
chmod +x deploy.sh
./deploy.sh
```

The script will guide you through:
1. GitHub repository setup
2. Vercel deployment
3. Custom domain configuration
4. Database migration warnings

## Manual Deployment Steps

If you prefer to do it manually or the script encounters issues:

### Phase 1: GitHub Setup

#### Option A: Using GitHub CLI (Recommended)

1. Install GitHub CLI:
   ```bash
   brew install gh
   ```

2. Login to GitHub:
   ```bash
   gh auth login
   ```
   - Select "GitHub.com"
   - Select "HTTPS"
   - Authenticate with your browser

3. Create repository and push:
   ```bash
   cd light-site
   gh repo create stelly-took-the-cam --public --source=. --remote=origin
   git push -u origin main
   ```

#### Option B: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `stelly-took-the-cam`
3. Choose Public or Private
4. Don't initialize with README (you already have code)
5. Click "Create repository"
6. Copy the repository URL
7. In terminal:
   ```bash
   cd light-site
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

### Phase 2: Vercel Deployment

#### Option A: Using Vercel CLI (Recommended for automation)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```
   - Enter your email
   - Click the verification link in your email

3. Deploy:
   ```bash
   vercel --prod
   ```
   
   When prompted:
   - "Set up and deploy?" → **Yes**
   - "Which scope?" → Select your account
   - "Link to existing project?" → **No** (first time)
   - "Project name?" → **stelly-took-the-cam**
   - "Directory?" → **./** (press Enter)
   - "Override settings?" → **No** (press Enter)

4. Your site is now live! Vercel will show you the URL.

#### Option B: Using Vercel Dashboard (Easier, no CLI needed)

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Click "Add New Project"
5. Find and select your `stelly-took-the-cam` repository
6. Click "Import"
7. Keep all default settings (Vercel auto-detects Next.js)
8. Click "Deploy"
9. Wait 2-3 minutes for deployment to complete
10. Your site is live at the provided Vercel URL!

### Phase 3: Custom Domain Setup

#### Step 1: Add Domain to Vercel

**Using CLI:**
```bash
vercel domains add yourdomain.com
```

**Using Dashboard:**
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Enter your domain name
4. Click "Add"

#### Step 2: Configure DNS at Your Domain Registrar

Go to where you bought your domain and add these DNS records:

**For root domain (example.com):**
- Type: `A`
- Name: `@` or leave blank
- Value: `76.76.21.21`
- TTL: `3600` (or default)

**For www subdomain (www.example.com):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `3600` (or default)

**Note:** DNS changes can take 24-48 hours to fully propagate, but often work within 1-2 hours.

#### Step 3: Verify Domain

After adding DNS records, check status:

```bash
vercel domains inspect yourdomain.com
```

Or check in Vercel dashboard under Settings → Domains.

### Phase 4: Database Migration (CRITICAL)

⚠️ **IMPORTANT:** Your site currently uses SQLite, which doesn't work on Vercel's serverless platform. You MUST migrate to a production database.

#### Recommended: Vercel Postgres

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a region close to your users
6. Click "Create"
7. Vercel will automatically add environment variables to your project

#### Alternative: Supabase (Free tier available)

1. Go to https://supabase.com
2. Create account and new project
3. Wait for database to initialize
4. Go to Settings → Database
5. Copy the connection string
6. Add to Vercel environment variables:
   - Go to Vercel project → Settings → Environment Variables
   - Add: `DATABASE_URL` = your connection string

#### Alternative: PlanetScale (MySQL)

1. Go to https://planetscale.com
2. Create account and new database
3. Get connection string
4. Add to Vercel environment variables

#### Update Your Code

After setting up a production database, you'll need to update:

1. `light-site/src/lib/database/sqlite.ts` - Change to use your new database
2. Add environment variables in Vercel dashboard
3. Redeploy: `vercel --prod` or push to GitHub (auto-deploys)

## Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=your_database_connection_string
NODE_ENV=production
```

## Troubleshooting

### "Command not found: gh"
Install GitHub CLI: `brew install gh`

### "Command not found: vercel"
Install Vercel CLI: `npm install -g vercel`

### "Permission denied: ./deploy.sh"
Make script executable: `chmod +x deploy.sh`

### "Database connection failed"
Make sure you've migrated from SQLite to a production database.

### "Domain not working"
- Check DNS records are correct
- Wait 24-48 hours for DNS propagation
- Use `dig yourdomain.com` to check DNS status

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Verify Node.js version compatibility

## Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] Custom domain configured
- [ ] DNS records added
- [ ] Database migrated from SQLite
- [ ] Environment variables set
- [ ] Admin panel works (/admin)
- [ ] Image uploads work
- [ ] Blog posts load
- [ ] Gallery works
- [ ] Projects page works
- [ ] Collaborations page works
- [ ] Countdown page works

## Updating Your Site

After initial deployment, updates are automatic:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel automatically deploys the changes
4. Check deployment status in Vercel dashboard

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Documentation: https://docs.github.com
- Vercel Support: https://vercel.com/support

## Cost Estimate

- GitHub: Free (public repositories)
- Vercel: Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Custom domains
- Database:
  - Vercel Postgres: Free tier available
  - Supabase: Free tier (500MB database)
  - PlanetScale: Free tier (5GB storage)

Total: **$0/month** for small to medium traffic sites!

## Next Steps

1. Run `./deploy.sh` to start automated deployment
2. Follow the prompts
3. Set up production database
4. Configure custom domain
5. Test your live site
6. Share your photography with the world! 📸

---

Need help? Review this guide or run `./deploy.sh` again.
