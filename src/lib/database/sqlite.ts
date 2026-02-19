// SQLite database helper for server-side operations
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Collection queries
export function getAllCollections() {
  const db = getDatabase();
  const collections = db.prepare(`
    SELECT * FROM collections 
    ORDER BY sortOrder ASC, id ASC
  `).all();
  
  // Get images for each collection
  return collections.map((collection: any) => {
    const images = db.prepare(`
      SELECT * FROM images 
      WHERE collectionId = ? 
      ORDER BY sortOrder ASC
    `).all(collection.id);
    
    // Get tags for each image
    const imagesWithTags = images.map((image: any) => {
      const imageTags = db.prepare(`
        SELECT tag FROM image_tags 
        WHERE imageId = ?
      `).all(image.id).map((row: any) => row.tag);
      
      return {
        ...image,
        tags: imageTags,
        photoDate: image.photoDate || image.createdAt, // Use photoDate if available, fallback to createdAt
        dimensions: {
          width: image.width,
          height: image.height,
          aspectRatio: image.width && image.height ? image.width / image.height : 0
        }
      };
    });
    
    return {
      ...collection,
      isPublic: Boolean(collection.isPublic),
      dateRange: {
        start: collection.startDate,
        end: collection.endDate
      },
      images: imagesWithTags
    };
  });
}

export function getCollectionById(id: number) {
  const db = getDatabase();
  const collection: any = db.prepare('SELECT * FROM collections WHERE id = ?').get(id);
  
  if (!collection) return null;
  
  const images = db.prepare(`
    SELECT * FROM images 
    WHERE collectionId = ? 
    ORDER BY sortOrder ASC
  `).all(id);
  
  const imagesWithTags = images.map((image: any) => {
    const imageTags = db.prepare(`
      SELECT tag FROM image_tags 
      WHERE imageId = ?
    `).all(image.id).map((row: any) => row.tag);
    
    return {
      ...image,
      tags: imageTags,
      photoDate: image.photoDate || image.createdAt, // Use photoDate if available, fallback to createdAt
      dimensions: {
        width: image.width,
        height: image.height,
        aspectRatio: image.width && image.height ? image.width / image.height : 0
      }
    };
  });
  
  return {
    ...collection,
    isPublic: Boolean(collection.isPublic),
    dateRange: {
      start: collection.startDate,
      end: collection.endDate
    },
    images: imagesWithTags
  };
}

export function createCollection(data: {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  category: string;
  isPublic: boolean;
  sortOrder: number;
  images?: any[];
}) {
  const db = getDatabase();
  
  const insert = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO collections (name, slug, description, coverImage, category, isPublic, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.slug,
      data.description,
      data.coverImage,
      data.category,
      data.isPublic ? 1 : 0,
      data.sortOrder
    );
    
    const collectionId = result.lastInsertRowid as number;
    
    // Insert images if provided
    if (data.images && data.images.length > 0) {
      const insertImage = db.prepare(`
        INSERT INTO images (collectionId, url, alt, caption, description, width, height, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const insertImageTag = db.prepare('INSERT INTO image_tags (imageId, tag) VALUES (?, ?)');
      
      data.images.forEach((image: any, index: number) => {
        const imageResult = insertImage.run(
          collectionId,
          image.url,
          image.alt,
          image.caption || null,
          image.description || null,
          image.dimensions?.width || 0,
          image.dimensions?.height || 0,
          index
        );
        
        const imageId = imageResult.lastInsertRowid;
        
        // Insert image tags
        if (image.tags && image.tags.length > 0) {
          image.tags.forEach((tag: string) => {
            try {
              insertImageTag.run(imageId, tag);
            } catch (err) {
              // Ignore duplicate tags
            }
          });
        }
      });
    }
    
    return collectionId;
  });
  
  const newId = insert();
  return getCollectionById(Number(newId));
}

export function updateCollection(id: number, data: any) {
  const db = getDatabase();
  
  const update = db.transaction(() => {
    // Update collection
    db.prepare(`
      UPDATE collections 
      SET name = ?, slug = ?, description = ?, coverImage = ?, 
          category = ?, isPublic = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name,
      data.slug,
      data.description,
      data.coverImage,
      data.category,
      data.isPublic ? 1 : 0,
      data.sortOrder,
      id
    );
    
    // Update images if provided
    if (data.images) {
      // Delete old images
      db.prepare('DELETE FROM images WHERE collectionId = ?').run(id);
      
      // Insert new images
      const insertImage = db.prepare(`
        INSERT INTO images (collectionId, url, alt, caption, description, width, height, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const insertImageTag = db.prepare('INSERT INTO image_tags (imageId, tag) VALUES (?, ?)');
      
      data.images.forEach((image: any, index: number) => {
        const result = insertImage.run(
          id,
          image.url,
          image.alt,
          image.caption || null,
          image.description || null,
          image.dimensions?.width || 0,
          image.dimensions?.height || 0,
          index
        );
        
        const imageId = result.lastInsertRowid;
        
        // Insert image tags
        if (image.tags && image.tags.length > 0) {
          image.tags.forEach((tag: string) => {
            try {
              insertImageTag.run(imageId, tag);
            } catch (err) {
              // Ignore duplicate tags
            }
          });
        }
      });
    }
  });
  
  update();
  return getCollectionById(id);
}

export function updateImage(imageId: number, data: any) {
  const db = getDatabase();
  
  const update = db.transaction(() => {
    // Update image basic info
    db.prepare(`
      UPDATE images 
      SET url = ?, alt = ?, caption = ?, description = ?, 
          width = ?, height = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.url,
      data.alt,
      data.caption || null,
      data.description || null,
      data.dimensions?.width || data.width || 0,
      data.dimensions?.height || data.height || 0,
      imageId
    );
    
    // Update tags - delete old and insert new
    db.prepare('DELETE FROM image_tags WHERE imageId = ?').run(imageId);
    const insertTag = db.prepare('INSERT INTO image_tags (imageId, tag) VALUES (?, ?)');
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag: string) => {
        try {
          insertTag.run(imageId, tag);
        } catch (err) {
          // Ignore duplicate tags
        }
      });
    }
  });
  
  update();
  
  // Return updated image with tags
  const image: any = db.prepare('SELECT * FROM images WHERE id = ?').get(imageId);
  const tags = db.prepare('SELECT tag FROM image_tags WHERE imageId = ?')
    .all(imageId)
    .map((row: any) => row.tag);
  
  return {
    ...image,
    tags,
    dimensions: {
      width: image.width,
      height: image.height,
      aspectRatio: image.width && image.height ? image.width / image.height : 0
    }
  };
}

export function deleteCollection(id: number) {
  const db = getDatabase();
  db.prepare('DELETE FROM collections WHERE id = ?').run(id);
  return true;
}

// Export for API routes
export default {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  updateImage,
  deleteCollection
};
