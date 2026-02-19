#!/bin/bash

# Database Migration Helper for Stelly Took The Cam
# This script helps you migrate from SQLite to a production database

echo "🗄️  DATABASE MIGRATION HELPER"
echo "=========================================="
echo ""
echo "Your site currently uses SQLite, which doesn't work on Vercel."
echo "This script will help you set up a production database."
echo ""

# Function to export SQLite data
export_sqlite_data() {
    echo "📤 Exporting data from SQLite..."
    
    if [ ! -f "database.sqlite" ]; then
        echo "❌ database.sqlite not found"
        echo "Make sure you're in the light-site directory"
        exit 1
    fi
    
    # Export schema
    sqlite3 database.sqlite .schema > migration_schema.sql
    
    # Export data
    sqlite3 database.sqlite .dump > migration_data.sql
    
    echo "✅ Data exported to:"
    echo "   - migration_schema.sql (database structure)"
    echo "   - migration_data.sql (complete backup)"
    echo ""
}

# Function to generate Vercel Postgres migration
generate_vercel_postgres() {
    echo "📝 Generating Vercel Postgres migration..."
    
    cat > vercel-postgres-setup.sql << 'EOF'
-- Vercel Postgres Migration
-- Run this in your Vercel Postgres database

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT NOT NULL,
    date TEXT NOT NULL,
    tags TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Collections Table
CREATE TABLE IF NOT EXISTS gallery_collections (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    start_date TEXT,
    end_date TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER REFERENCES gallery_collections(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    photo_date TEXT,
    tags TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT,
    tags TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'planning',
    start_date TEXT,
    end_date TEXT,
    client TEXT,
    technologies TEXT,
    links TEXT,
    team TEXT,
    budget TEXT,
    priority TEXT DEFAULT 'medium',
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collaborations Table
CREATE TABLE IF NOT EXISTS collaborations (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    type TEXT,
    status TEXT DEFAULT 'proposed',
    partner_name TEXT,
    partner_contact TEXT,
    partner_website TEXT,
    cover_image TEXT,
    start_date TEXT,
    end_date TEXT,
    deliverables TEXT,
    terms TEXT,
    budget TEXT,
    priority TEXT DEFAULT 'medium',
    tags TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_date ON blog_posts(date);
CREATE INDEX IF NOT EXISTS idx_gallery_collection_slug ON gallery_collections(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_images_collection ON gallery_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_collaborations_slug ON collaborations(slug);

EOF

    echo "✅ Created vercel-postgres-setup.sql"
    echo ""
}

# Function to generate Supabase migration
generate_supabase() {
    echo "📝 Generating Supabase migration..."
    
    # Supabase uses PostgreSQL, so same schema
    cp vercel-postgres-setup.sql supabase-setup.sql
    
    echo "✅ Created supabase-setup.sql"
    echo ""
}

# Main menu
echo "Choose your production database:"
echo ""
echo "1. Vercel Postgres (Recommended - integrated with Vercel)"
echo "2. Supabase (Free tier, PostgreSQL)"
echo "3. PlanetScale (MySQL, requires schema conversion)"
echo "4. Export SQLite data only"
echo "5. Exit"
echo ""
read -p "Enter your choice (1-5): " CHOICE

case $CHOICE in
    1)
        echo ""
        echo "=========================================="
        echo "VERCEL POSTGRES SETUP"
        echo "=========================================="
        echo ""
        
        export_sqlite_data
        generate_vercel_postgres
        
        echo "NEXT STEPS:"
        echo ""
        echo "1. Go to your Vercel project dashboard"
        echo "2. Click 'Storage' → 'Create Database' → 'Postgres'"
        echo "3. Choose a region and create the database"
        echo "4. Click 'Connect' → '.env.local' tab"
        echo "5. Copy the environment variables"
        echo "6. Go to Settings → Environment Variables"
        echo "7. Add all the database variables"
        echo ""
        echo "8. Connect to your database using Vercel's query tool:"
        echo "   - Go to Storage → Your Database → Query"
        echo "   - Copy and paste the contents of vercel-postgres-setup.sql"
        echo "   - Click 'Run Query'"
        echo ""
        echo "9. Update your code to use Postgres instead of SQLite"
        echo "   - Edit src/lib/database/sqlite.ts"
        echo "   - Use @vercel/postgres package"
        echo ""
        echo "10. Redeploy: vercel --prod"
        echo ""
        ;;
        
    2)
        echo ""
        echo "=========================================="
        echo "SUPABASE SETUP"
        echo "=========================================="
        echo ""
        
        export_sqlite_data
        generate_supabase
        
        echo "NEXT STEPS:"
        echo ""
        echo "1. Go to https://supabase.com"
        echo "2. Create a new project"
        echo "3. Wait for database to initialize (2-3 minutes)"
        echo "4. Go to SQL Editor"
        echo "5. Create a new query"
        echo "6. Copy and paste the contents of supabase-setup.sql"
        echo "7. Click 'Run'"
        echo ""
        echo "8. Get your connection string:"
        echo "   - Go to Settings → Database"
        echo "   - Copy the connection string"
        echo "   - Replace [YOUR-PASSWORD] with your database password"
        echo ""
        echo "9. Add to Vercel environment variables:"
        echo "   - Go to Vercel project → Settings → Environment Variables"
        echo "   - Add: DATABASE_URL = your connection string"
        echo ""
        echo "10. Update your code to use Postgres"
        echo "    - Edit src/lib/database/sqlite.ts"
        echo "    - Use pg or @supabase/supabase-js package"
        echo ""
        echo "11. Redeploy: vercel --prod"
        echo ""
        ;;
        
    3)
        echo ""
        echo "=========================================="
        echo "PLANETSCALE SETUP"
        echo "=========================================="
        echo ""
        
        export_sqlite_data
        
        echo "⚠️  PlanetScale uses MySQL, which requires schema conversion."
        echo "SQLite and MySQL have different syntax."
        echo ""
        echo "NEXT STEPS:"
        echo ""
        echo "1. Go to https://planetscale.com"
        echo "2. Create a new database"
        echo "3. Use PlanetScale's import tool or manually create tables"
        echo "4. Convert SQLite schema to MySQL syntax"
        echo "5. Get connection string from PlanetScale dashboard"
        echo "6. Add to Vercel environment variables"
        echo "7. Update code to use MySQL client"
        echo ""
        echo "Note: Vercel Postgres or Supabase are easier options!"
        echo ""
        ;;
        
    4)
        echo ""
        export_sqlite_data
        echo "Data exported. You can now import it into your chosen database."
        echo ""
        ;;
        
    5)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo "=========================================="
echo "MIGRATION FILES CREATED"
echo "=========================================="
echo ""
echo "Files in your directory:"
ls -lh migration_*.sql vercel-postgres-setup.sql supabase-setup.sql 2>/dev/null
echo ""
echo "⚠️  IMPORTANT: Keep these files safe until migration is complete!"
echo ""
echo "After successful migration:"
echo "  - Test your live site thoroughly"
echo "  - Verify all data is present"
echo "  - Then you can delete these migration files"
echo ""
