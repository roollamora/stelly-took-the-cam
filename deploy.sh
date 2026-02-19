#!/bin/bash

# Deployment Script for Stelly Took The Cam
# This script will help you deploy your website step by step

echo "🚀 STELLY TOOK THE CAM - DEPLOYMENT HELPER"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Stelly Took The Cam website"
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI detected - We can automate GitHub steps!"
    echo ""
    
    # Check if user is logged in
    if gh auth status &> /dev/null; then
        echo "✅ You're logged into GitHub CLI"
        echo ""
        
        # Check if remote already exists
        if git remote get-url origin &> /dev/null; then
            echo "✅ GitHub remote already configured"
            REPO_URL=$(git remote get-url origin)
            echo "🔗 Repository URL: $REPO_URL"
            echo ""
            
            read -p "Push latest changes to GitHub? (y/n): " PUSH_CHANGES
            if [ "$PUSH_CHANGES" = "y" ]; then
                echo ""
                echo "⬆️  Pushing code to GitHub..."
                git add .
                git commit -m "Update: preparing for deployment" || echo "No changes to commit"
                git push origin main
                echo "✅ Code pushed to GitHub!"
            fi
        else
            # Ask for repository name
            read -p "Enter repository name (e.g., stelly-took-the-cam): " REPO_NAME
            read -p "Make repository private? (y/n): " IS_PRIVATE
            
            if [ "$IS_PRIVATE" = "y" ]; then
                VISIBILITY="--private"
            else
                VISIBILITY="--public"
            fi
            
            echo ""
            echo "📦 Creating GitHub repository..."
            gh repo create "$REPO_NAME" $VISIBILITY --source=. --remote=origin --description="Photography portfolio website for Stelly Took The Cam"
            
            echo ""
            echo "⬆️  Pushing code to GitHub..."
            git push -u origin main
            
            echo ""
            echo "✅ Code successfully pushed to GitHub!"
            echo ""
            
            # Get the repository URL
            REPO_URL=$(gh repo view --json url -q .url)
            echo "🔗 Repository URL: $REPO_URL"
        fi
        echo ""
        
    else
        echo "❌ You're not logged into GitHub CLI"
        echo ""
        echo "To automate GitHub steps, please run:"
        echo "  gh auth login"
        echo ""
        read -p "Continue with manual GitHub setup? (y/n): " CONTINUE_MANUAL
        
        if [ "$CONTINUE_MANUAL" != "y" ]; then
            echo "Exiting. Run this script again after logging in."
            exit 0
        fi
        
        echo ""
        echo "MANUAL GITHUB SETUP:"
        echo "1. Go to https://github.com/new"
        echo "2. Create a new repository named 'stelly-took-the-cam'"
        echo "3. Copy the repository URL (e.g., https://github.com/username/stelly-took-the-cam.git)"
        echo ""
        read -p "Paste your GitHub repository URL here: " REPO_URL
        
        echo ""
        echo "🔗 Connecting to GitHub..."
        git remote add origin "$REPO_URL"
        
        echo ""
        echo "⬆️  Pushing code to GitHub..."
        git push -u origin main
        
        echo ""
        echo "✅ Code successfully pushed to GitHub!"
    fi
else
    echo "⚠️  GitHub CLI not installed"
    echo ""
    echo "OPTION 1 - Install GitHub CLI (Recommended for automation):"
    echo "  macOS: brew install gh"
    echo "  Then run: gh auth login"
    echo "  Then run this script again"
    echo ""
    echo "OPTION 2 - Continue with manual setup:"
    echo ""
    read -p "Continue with manual setup? (y/n): " CONTINUE_MANUAL
    
    if [ "$CONTINUE_MANUAL" != "y" ]; then
        echo "Exiting. Install GitHub CLI and run this script again."
        exit 0
    fi
    
    echo ""
    echo "MANUAL GITHUB SETUP:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository named 'stelly-took-the-cam'"
    echo "3. Copy the repository URL (e.g., https://github.com/username/stelly-took-the-cam.git)"
    echo ""
    read -p "Paste your GitHub repository URL here: " REPO_URL
    
    echo ""
    echo "🔗 Connecting to GitHub..."
    git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
    
    echo ""
    echo "⬆️  Pushing code to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Code successfully pushed to GitHub!"
fi

echo ""
echo "=========================================="
echo "NEXT STEPS - VERCEL DEPLOYMENT"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI detected!"
    echo ""
    
    # Check if already logged in
    if vercel whoami &> /dev/null; then
        echo "✅ You're logged into Vercel CLI"
        echo ""
    else
        echo "⚠️  Not logged into Vercel CLI"
        echo ""
        read -p "Login to Vercel now? (y/n): " LOGIN_NOW
        
        if [ "$LOGIN_NOW" = "y" ]; then
            vercel login
            echo ""
        else
            echo "Please run 'vercel login' before deploying"
            exit 0
        fi
    fi
    
    read -p "Deploy to Vercel now? (y/n): " DEPLOY_NOW
    
    if [ "$DEPLOY_NOW" = "y" ]; then
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        echo "IMPORTANT: When prompted:"
        echo "  - Set up and deploy? → Yes"
        echo "  - Which scope? → Select your account"
        echo "  - Link to existing project? → No (first time) or Yes (if updating)"
        echo "  - Project name? → stelly-took-the-cam (or your preferred name)"
        echo "  - Directory? → ./ (press Enter)"
        echo "  - Override settings? → No (press Enter)"
        echo ""
        read -p "Press Enter to continue..."
        
        vercel --prod
        
        echo ""
        echo "✅ Deployment complete!"
        echo ""
        
        # Get deployment URL
        DEPLOY_URL=$(vercel ls --prod 2>/dev/null | grep "stelly-took-the-cam" | head -1 | awk '{print $2}')
        
        if [ ! -z "$DEPLOY_URL" ]; then
            echo "🌐 Your site is live at: https://$DEPLOY_URL"
            echo ""
        fi
        
        echo "=========================================="
        echo "CUSTOM DOMAIN SETUP"
        echo "=========================================="
        echo ""
        read -p "Do you want to add your custom domain now? (y/n): " ADD_DOMAIN
        
        if [ "$ADD_DOMAIN" = "y" ]; then
            read -p "Enter your domain (e.g., stellytookthecam.com): " CUSTOM_DOMAIN
            
            echo ""
            echo "🔗 Adding domain to Vercel..."
            vercel domains add "$CUSTOM_DOMAIN" --prod
            
            echo ""
            echo "✅ Domain added!"
            echo ""
            echo "=========================================="
            echo "DNS CONFIGURATION REQUIRED"
            echo "=========================================="
            echo ""
            echo "Go to your domain registrar (where you bought the domain) and add these DNS records:"
            echo ""
            echo "For root domain ($CUSTOM_DOMAIN):"
            echo "  Type: A"
            echo "  Name: @"
            echo "  Value: 76.76.21.21"
            echo ""
            echo "For www subdomain (www.$CUSTOM_DOMAIN):"
            echo "  Type: CNAME"
            echo "  Name: www"
            echo "  Value: cname.vercel-dns.com"
            echo ""
            echo "DNS changes can take 24-48 hours to propagate."
            echo ""
            echo "To check DNS status, run:"
            echo "  vercel domains inspect $CUSTOM_DOMAIN"
        else
            echo ""
            echo "To add your domain later:"
            echo "  1. Run: vercel domains add yourdomain.com"
            echo "  2. Or go to: https://vercel.com/dashboard"
            echo "     → Select your project → Settings → Domains"
        fi
    else
        echo ""
        echo "To deploy later, run: vercel --prod"
    fi
else
    echo "⚠️  Vercel CLI not installed"
    echo ""
    read -p "Install Vercel CLI now? (y/n): " INSTALL_VERCEL
    
    if [ "$INSTALL_VERCEL" = "y" ]; then
        echo ""
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
        
        echo ""
        echo "✅ Vercel CLI installed!"
        echo ""
        echo "🔐 Logging into Vercel..."
        vercel login
        
        echo ""
        read -p "Deploy to Vercel now? (y/n): " DEPLOY_NOW
        
        if [ "$DEPLOY_NOW" = "y" ]; then
            echo ""
            echo "🚀 Deploying to Vercel..."
            echo ""
            echo "IMPORTANT: When prompted:"
            echo "  - Set up and deploy? → Yes"
            echo "  - Which scope? → Select your account"
            echo "  - Link to existing project? → No"
            echo "  - Project name? → stelly-took-the-cam"
            echo "  - Directory? → ./ (press Enter)"
            echo "  - Override settings? → No (press Enter)"
            echo ""
            read -p "Press Enter to continue..."
            
            vercel --prod
            
            echo ""
            echo "✅ Deployment complete!"
        fi
    else
        echo ""
        echo "MANUAL VERCEL DEPLOYMENT (No CLI needed):"
        echo ""
        echo "1. Go to https://vercel.com/signup"
        echo "2. Click 'Continue with GitHub'"
        echo "3. Authorize Vercel to access your GitHub"
        echo "4. Click 'Add New Project'"
        echo "5. Find and import 'stelly-took-the-cam' repository"
        echo "6. Keep all default settings"
        echo "7. Click 'Deploy'"
        echo ""
        echo "After deployment:"
        echo "8. Go to Settings → Domains"
        echo "9. Add your custom domain"
        echo "10. Follow the DNS configuration instructions"
        echo ""
        echo "Your repository is ready at:"
        echo "$REPO_URL"
    fi
fi

echo ""
echo "=========================================="
echo "DATABASE MIGRATION WARNING"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT: Your site currently uses SQLite database."
echo "SQLite doesn't work on Vercel's serverless platform."
echo ""
echo "You need to migrate to a production database:"
echo ""
echo "RECOMMENDED OPTIONS:"
echo ""
echo "1. Vercel Postgres (Easiest, integrated with Vercel)"
echo "   - Go to your Vercel project dashboard"
echo "   - Click 'Storage' → 'Create Database' → 'Postgres'"
echo "   - Follow setup instructions"
echo "   - Update your database connection in the code"
echo ""
echo "2. Supabase (Free tier available)"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Get your database connection string"
echo "   - Update your database connection in the code"
echo ""
echo "3. PlanetScale (MySQL, free tier available)"
echo "   - Go to https://planetscale.com"
echo "   - Create a new database"
echo "   - Get your connection string"
echo "   - Update your database connection in the code"
echo ""
echo "After setting up a production database:"
echo "  - Update light-site/src/lib/database/sqlite.ts"
echo "  - Add database credentials to Vercel environment variables"
echo "  - Redeploy your site"
echo ""

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT HELPER COMPLETE"
echo "=========================================="
echo ""
echo "SUMMARY:"
echo "✅ Code pushed to GitHub"
if command -v vercel &> /dev/null; then
    if vercel whoami &> /dev/null; then
        echo "✅ Vercel CLI ready"
    fi
fi
echo ""
echo "NEXT STEPS:"
echo "1. Complete Vercel deployment (if not done)"
echo "2. Set up production database"
echo "3. Configure custom domain DNS"
echo "4. Test your live site"
echo ""
echo "Need help? Check the documentation or run this script again."
echo ""
