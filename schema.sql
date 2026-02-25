-- Collections table
CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    title TEXT,
    description TEXT,
    width INTEGER,
    height INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

-- Image tags table
CREATE TABLE IF NOT EXISTS image_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT DEFAULT 'Stelly',
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    tags TEXT,
    is_published BOOLEAN DEFAULT 1
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    cover_image TEXT,
    client TEXT,
    role TEXT,
    year INTEGER,
    tags TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project images table
CREATE TABLE IF NOT EXISTS project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    cover_image TEXT,
    collaborator TEXT,
    role TEXT,
    year INTEGER,
    tags TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Collaboration images table
CREATE TABLE IF NOT EXISTS collaboration_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collaboration_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collaboration_id) REFERENCES collaborations(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_images_collection ON images(collection_id);
CREATE INDEX IF NOT EXISTS idx_images_order ON images(display_order);
CREATE INDEX IF NOT EXISTS idx_image_tags_image ON image_tags(image_id);
CREATE INDEX IF NOT EXISTS idx_image_tags_tag ON image_tags(tag);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_slug ON collaborations(slug);
CREATE INDEX IF NOT EXISTS idx_collaborations_published ON collaborations(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_collaboration_images_collab ON collaboration_images(collaboration_id);
