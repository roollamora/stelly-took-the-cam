# Quick Start Deployment Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Run the automated script
```bash
cd light-site
chmod +x deploy.sh
./deploy.sh
```

Follow the prompts. The script will:
- ✅ Push your code to GitHub
- ✅ Deploy to Vercel
- ✅ Guide you through domain setup

### Step 2: Set up production database
```bash
chmod +x migrate-database.sh
./migrate-database.sh
```

Choose option 1 (Vercel Postgres) and follow the instructions.

### Step 3: Add your domain
In Vercel dashboard:
1. Settings → Domains
2. Add your domain
3. Update DNS at your domain registrar

Done! 🎉

---

## 📋 Manual Deployment (if script doesn't work)

### GitHub
```bash
# Install GitHub CLI
brew install gh

# Login
gh auth login

# Create repo and push
gh repo create stelly-took-the-cam --public --source=. --remote=origin
git push -u origin main
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Domain
```bash
# Add domain
vercel domains add yourdomain.com
```

Then add DNS records at your domain registrar:
- A record: `@` → `76.76.21.21`
- CNAME record: `www` → `cname.vercel-dns.com`

---

## 🗄️ Database Migration

Your site uses SQLite which doesn't work on Vercel. Choose one:

### Option 1: Vercel Postgres (Easiest)
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Run the SQL from `vercel-postgres-setup.sql`
3. Environment variables are auto-added
4. Update `src/lib/database/sqlite.ts` to use Postgres
5. Redeploy

### Option 2: Supabase (Free)
1. Go to https://supabase.com
2. Create project
3. SQL Editor → Run `supabase-setup.sql`
4. Get connection string from Settings → Database
5. Add to Vercel: Settings → Environment Variables → `DATABASE_URL`
6. Update code to use Postgres
7. Redeploy

---

## 🔧 Common Commands

### Development
```bash
npm run dev          # Start dev server (port 3001)
```

### Deployment
```bash
git add .
git commit -m "Update"
git push             # Auto-deploys to Vercel

vercel --prod        # Manual deploy
vercel logs          # View deployment logs
```

### Domain Management
```bash
vercel domains ls                    # List domains
vercel domains add yourdomain.com    # Add domain
vercel domains inspect yourdomain.com # Check DNS status
```

### Database
```bash
./migrate-database.sh    # Run migration helper
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Database migrated from SQLite
- [ ] Environment variables set
- [ ] Custom domain added
- [ ] DNS records configured
- [ ] Site loads correctly
- [ ] Admin panel works
- [ ] Images upload successfully
- [ ] All pages work (blog, gallery, projects, collaborations, countdown)

---

## 🆘 Quick Troubleshooting

### "Command not found"
```bash
brew install gh        # For GitHub CLI
npm install -g vercel  # For Vercel CLI
```

### "Permission denied"
```bash
chmod +x deploy.sh
chmod +x migrate-database.sh
```

### "Database connection failed"
- Make sure you've migrated from SQLite
- Check environment variables in Vercel
- Verify connection string is correct

### "Domain not working"
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Use `dig yourdomain.com` to verify

### "Build failed"
- Check Vercel dashboard logs
- Verify all dependencies in package.json
- Make sure database is set up

---

## 📚 Full Documentation

For detailed explanations, see:
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `README.md` - Project overview
- Vercel Docs: https://vercel.com/docs

---

## 💰 Cost

Everything can be FREE:
- GitHub: Free (public repos)
- Vercel: Free tier (100GB bandwidth/month)
- Vercel Postgres: Free tier
- Supabase: Free tier (500MB database)

Perfect for small to medium traffic sites!

---

## 🎯 Next Steps After Deployment

1. Test all features on live site
2. Set up analytics (optional)
3. Configure email notifications (optional)
4. Set up automated backups
5. Monitor site performance
6. Share your photography! 📸

---

Need help? Run `./deploy.sh` or check `DEPLOYMENT_GUIDE.md`
