// Turso database helper for production deployment
import { createClient, Client } from '@libsql/client';

let client: Client | null = null;

export function getDatabase() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    }

    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}

export function closeDatabase() {
  if (client) {
    client.close();
    client = null;
  }
}

// Collection queries
export async function getAllCollections() {
  const db = getDatabase();
  const collectionsResult = await db.execute(`
    SELECT * FROM collections 
    ORDER BY sortOrder ASC, id ASC
  `);
  
  const collections = collectionsResult.rows;
  
  // Get images for each collection
  const collectionsWithImages = await Promise.all(
    collections.map(async (collection: any) => {
      const imagesResult = await db.execute({
        sql: `SELECT * FROM images WHERE collectionId = ? ORDER BY sortOrder ASC`,
        args: [collection.id]
      });
      
      const images = imagesResult.rows;
      
      // Get tags for each image
      const imagesWithTags = await Promise.all(
        images.map(async (image: any) => {
          const tagsResult = await db.execute({
            sql: `SELECT tag FROM image_tags WHERE imageId = ?`,
            args: [image.id]
          });
          
          const imageTags = tagsResult.rows.map((row: any) => row.tag);
          
          return {
            ...image,
            tags: imageTags,
            photoDate: image.photoDate || image.createdAt,
            dimensions: {
              width: image.width,
              height: image.height,
              aspectRatio: image.width && image.height ? Number(image.width) / Number(image.height) : 0
            }
          };
        })
      );
      
      return {
        ...collection,
        isPublic: Boolean(collection.isPublic),
        dateRange: {
          start: collection.startDate,
          end: collection.endDate
        },
        images: imagesWithTags
      };
    })
  );
  
  return collectionsWithImages;
}

export async function getCollectionById(id: number) {
  const db = getDatabase();
  const collectionResult = await db.execute({
    sql: 'SELECT * FROM collections WHERE id = ?',
    args: [id]
  });
  
  const collection = collectionResult.rows[0];
  
  if (!collection) return null;
  
  const imagesResult = await db.execute({
    sql: `SELECT * FROM images WHERE collectionId = ? ORDER BY sortOrder ASC`,
    args: [id]
  });
  
  const images = imagesResult.rows;
  
  const imagesWithTags = await Promise.all(
    images.map(async (image: any) => {
      const tagsResult = await db.execute({
        sql: `SELECT tag FROM image_tags WHERE imageId = ?`,
        args: [image.id]
      });
      
      const imageTags = tagsResult.rows.map((row: any) => row.tag);
      
      return {
        ...image,
        tags: imageTags,
        photoDate: image.photoDate || image.createdAt,
        dimensions: {
          width: image.width,
          height: image.height,
          aspectRatio: image.width && image.height ? Number(image.width) / Number(image.height) : 0
        }
      };
    })
  );
  
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

export async function createCollection(data: {
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
  
  // Insert collection
  const result = await db.execute({
    sql: `
      INSERT INTO collections (name, slug, description, coverImage, category, isPublic, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.slug,
      data.description,
      data.coverImage,
      data.category,
      data.isPublic ? 1 : 0,
      data.sortOrder
    ]
  });
  
  const collectionId = Number(result.lastInsertRowid);
  
  // Insert images if provided
  if (data.images && data.images.length > 0) {
    for (let index = 0; index < data.images.length; index++) {
      const image = data.images[index];
      
      const imageResult = await db.execute({
        sql: `
          INSERT INTO images (collectionId, url, alt, caption, description, width, height, sortOrder)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          collectionId,
          image.url,
          image.alt,
          image.caption || null,
          image.description || null,
          image.dimensions?.width || 0,
          image.dimensions?.height || 0,
          index
        ]
      });
      
      const imageId = Number(imageResult.lastInsertRowid);
      
      // Insert image tags
      if (image.tags && image.tags.length > 0) {
        for (const tag of image.tags) {
          try {
            await db.execute({
              sql: 'INSERT INTO image_tags (imageId, tag) VALUES (?, ?)',
              args: [imageId, tag]
            });
          } catch (err) {
            // Ignore duplicate tags
          }
        }
      }
    }
  }
  
  return getCollectionById(collectionId);
}

export async function updateCollection(id: number, data: any) {
  const db = getDatabase();
  
  // Update collection
  await db.execute({
    sql: `
      UPDATE collections 
      SET name = ?, slug = ?, description = ?, coverImage = ?, 
          category = ?, isPublic = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      data.name,
      data.slug,
      data.description,
      data.coverImage,
      data.category,
      data.isPublic ? 1 : 0,
      data.sortOrder,
      id
    ]
  });
  
  // Update images if provided
  if (data.images) {
    // Delete old images
    await db.execute({
      sql: 'DELETE FROM images WHERE collectionId = ?',
      args: [id]
    });
    
    // Insert new images
    for (let index = 0; index < data.images.length; index++) {
      const image = data.images[index];
      
      const result = await db.execute({
        sql: `
          INSERT INTO images (collectionId, url, alt, caption, description, width, height, sortOrder)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          id,
          image.url,
          image.alt,
          image.caption || null,
          image.description || null,
          image.dimensions?.width || 0,
          image.dimensions?.height || 0,
          index
        ]
      });
      
      const imageId = Number(result.lastInsertRowid);
      
      // Insert image tags
      if (image.tags && image.tags.length > 0) {
        for (const tag of image.tags) {
          try {
            await db.execute({
              sql: 'INSERT INTO image_tags (imageId, tag) VALUES (?, ?)',
              args: [imageId, tag]
            });
          } catch (err) {
            // Ignore duplicate tags
          }
        }
      }
    }
  }
  
  return getCollectionById(id);
}

export async function updateImage(imageId: number, data: any) {
  const db = getDatabase();
  
  // Update image basic info
  await db.execute({
    sql: `
      UPDATE images 
      SET url = ?, alt = ?, caption = ?, description = ?, 
          width = ?, height = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      data.url,
      data.alt,
      data.caption || null,
      data.description || null,
      data.dimensions?.width || data.width || 0,
      data.dimensions?.height || data.height || 0,
      imageId
    ]
  });
  
  // Update tags - delete old and insert new
  await db.execute({
    sql: 'DELETE FROM image_tags WHERE imageId = ?',
    args: [imageId]
  });
  
  if (data.tags && data.tags.length > 0) {
    for (const tag of data.tags) {
      try {
        await db.execute({
          sql: 'INSERT INTO image_tags (imageId, tag) VALUES (?, ?)',
          args: [imageId, tag]
        });
      } catch (err) {
        // Ignore duplicate tags
      }
    }
  }
  
  // Return updated image with tags
  const imageResult = await db.execute({
    sql: 'SELECT * FROM images WHERE id = ?',
    args: [imageId]
  });
  
  const image = imageResult.rows[0];
  
  const tagsResult = await db.execute({
    sql: 'SELECT tag FROM image_tags WHERE imageId = ?',
    args: [imageId]
  });
  
  const tags = tagsResult.rows.map((row: any) => row.tag);
  
  return {
    ...image,
    tags,
    dimensions: {
      width: image.width,
      height: image.height,
      aspectRatio: image.width && image.height ? Number(image.width) / Number(image.height) : 0
    }
  };
}

export async function deleteCollection(id: number) {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM collections WHERE id = ?',
    args: [id]
  });
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
