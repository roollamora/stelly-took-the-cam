// Simple script to add new posts to localStorage
// Open this file in your browser console or run via a simple HTML page

const newPosts = require('./new-blog-posts.json');

// Get existing posts
const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

// Filter out duplicates
const existingIds = new Set(existingPosts.map(p => p.id));
const postsToAdd = newPosts.filter(p => !existingIds.has(p.id));

// Add new posts
const allPosts = [...existingPosts, ...postsToAdd];
localStorage.setItem('blogPosts', JSON.stringify(allPosts));

console.log(`Added ${postsToAdd.length} new posts!`);
console.log(`Total posts: ${allPosts.length}`);
