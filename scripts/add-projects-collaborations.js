const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('Adding Projects and Collaborations tables...');

try {
  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT, -- JSON array as string
      coverImage TEXT,
      status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')),
      startDate TEXT,
      endDate TEXT,
      client TEXT,
      technologies TEXT, -- JSON array as string
      links TEXT, -- JSON array as string
      team TEXT, -- JSON array as string
      budget REAL,
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      slug TEXT UNIQUE,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create project_images table
  db.exec(`
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
    )
  `);

  // Create collaborations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaborations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT NOT NULL,
      type TEXT DEFAULT 'partnership' CHECK (type IN ('partnership', 'commission', 'joint-project', 'sponsorship', 'other')),
      status TEXT DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'negotiating', 'active', 'completed', 'cancelled')),
      partner TEXT, -- JSON object as string
      coverImage TEXT,
      startDate TEXT,
      endDate TEXT,
      deliverables TEXT, -- JSON array as string
      terms TEXT,
      budget REAL,
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      tags TEXT, -- JSON array as string
      slug TEXT UNIQUE,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create collaboration_images table
  db.exec(`
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
    )
  `);

  // Insert sample projects
  const insertProject = db.prepare(`
    INSERT INTO projects (title, subtitle, description, category, tags, coverImage, status, startDate, client, technologies, links, team, priority, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    {
      title: 'Brand Identity Redesign',
      subtitle: 'Complete visual identity overhaul',
      description: 'A comprehensive brand identity redesign project focusing on modern aesthetics and brand consistency across all touchpoints.',
      category: 'Branding',
      tags: JSON.stringify(['branding', 'logo', 'identity', 'design']),
      coverImage: '/filler/DETAILS_1.0.jpeg',
      status: 'completed',
      startDate: '2024-01-15',
      client: 'Tech Startup Inc.',
      technologies: JSON.stringify(['Adobe Illustrator', 'Figma', 'Photoshop']),
      links: JSON.stringify([
        { type: 'website', url: 'https://example.com', label: 'Live Site' }
      ]),
      team: JSON.stringify([
        { name: 'John Doe', role: 'Creative Director' },
        { name: 'Jane Smith', role: 'Designer' }
      ]),
      priority: 'high',
      slug: 'brand-identity-redesign'
    },
    {
      title: 'E-commerce Platform',
      subtitle: 'Custom online store development',
      description: 'Development of a modern e-commerce platform with advanced features and seamless user experience.',
      category: 'Web Development',
      tags: JSON.stringify(['ecommerce', 'web', 'development', 'react']),
      coverImage: '/filler/BTC_1.6.jpeg',
      status: 'in-progress',
      startDate: '2024-02-01',
      client: 'Fashion Brand Co.',
      technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe']),
      links: JSON.stringify([
        { type: 'github', url: 'https://github.com/example', label: 'Source Code' },
        { type: 'demo', url: 'https://demo.example.com', label: 'Live Demo' }
      ]),
      team: JSON.stringify([
        { name: 'Alice Johnson', role: 'Full Stack Developer' },
        { name: 'Bob Wilson', role: 'UI/UX Designer' }
      ]),
      priority: 'high',
      slug: 'ecommerce-platform'
    }
  ];

  projects.forEach(project => {
    insertProject.run(
      project.title,
      project.subtitle,
      project.description,
      project.category,
      project.tags,
      project.coverImage,
      project.status,
      project.startDate,
      project.client,
      project.technologies,
      project.links,
      project.team,
      project.priority,
      project.slug
    );
  });

  // Insert sample collaborations
  const insertCollaboration = db.prepare(`
    INSERT INTO collaborations (title, subtitle, description, type, status, partner, coverImage, startDate, deliverables, priority, tags, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const collaborations = [
    {
      title: 'Photography Partnership',
      subtitle: 'Joint creative venture',
      description: 'Collaborative photography project exploring urban landscapes and architectural forms.',
      type: 'partnership',
      status: 'active',
      partner: JSON.stringify({
        name: 'Urban Lens Studio',
        type: 'company',
        website: 'https://urbanlens.com',
        contactPerson: 'Sarah Martinez'
      }),
      coverImage: '/filler/DUO_1.0.jpeg',
      startDate: '2024-01-20',
      deliverables: JSON.stringify([
        'Joint exhibition',
        'Photo book publication',
        'Online gallery'
      ]),
      priority: 'medium',
      tags: JSON.stringify(['photography', 'collaboration', 'urban', 'architecture']),
      slug: 'photography-partnership'
    },
    {
      title: 'Art Installation Commission',
      subtitle: 'Public art project',
      description: 'Large-scale art installation for city center, combining digital and physical elements.',
      type: 'commission',
      status: 'negotiating',
      partner: JSON.stringify({
        name: 'City Arts Council',
        type: 'organization',
        email: 'info@cityarts.gov',
        contactPerson: 'Michael Chen'
      }),
      coverImage: '/filler/DETAILS_1.7.jpeg',
      startDate: '2024-03-01',
      deliverables: JSON.stringify([
        'Concept design',
        'Installation artwork',
        'Maintenance documentation'
      ]),
      priority: 'high',
      tags: JSON.stringify(['art', 'installation', 'public', 'commission']),
      slug: 'art-installation-commission'
    }
  ];

  collaborations.forEach(collaboration => {
    insertCollaboration.run(
      collaboration.title,
      collaboration.subtitle,
      collaboration.description,
      collaboration.type,
      collaboration.status,
      collaboration.partner,
      collaboration.coverImage,
      collaboration.startDate,
      collaboration.deliverables,
      collaboration.priority,
      collaboration.tags,
      collaboration.slug
    );
  });

  console.log('✅ Projects and Collaborations tables created successfully!');
  console.log('✅ Sample data inserted!');

} catch (error) {
  console.error('❌ Error creating tables:', error);
} finally {
  db.close();
}