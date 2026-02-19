'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { BlogPost } from '../../lib/blogData'
import { uploadFileToPostFolder, uploadFilesToPostFolder, validateImageFile, cleanupTempUrl, createPostFolderStructure, PostFolder } from '../../lib/uploadUtils'
import { compressImage, formatFileSize, type CompressionResult } from '../../lib/imageCompression'
import { dataService } from '../../lib/database/dataService'
import type { BlogPost as DBBlogPost } from '../../lib/database/schema'
import DataMigration from '../../components/DataMigration'

export default function AdminPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'blog' | 'gallery' | 'database' | 'projects' | 'collaborations'>('blog')
  
  // Gallery state
  const [galleryCollections, setGalleryCollections] = useState<any[]>([])
  const [currentCollection, setCurrentCollection] = useState<any>({
    id: 0,
    name: '',
    slug: '',
    description: '',
    coverImage: '',
    coverImageSource: 'collection', // 'collection' or 'external'
    coverImageIndex: 0, // which image from collection to use as cover
    category: '',
    tags: [],
    images: [],
    isPublic: true,
    sortOrder: 0,
    startDate: '',
    endDate: ''
  })
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null)
  const [currentImage, setCurrentImage] = useState<any>({
    url: '',
    alt: '',
    caption: '',
    description: '',
    tags: [],
    dimensions: { width: 0, height: 0, aspectRatio: 0 },
    metadata: { fileSize: 0, mimeType: '', originalName: '', uploadedAt: '' },
    sortOrder: 0,
    photoDate: ''
  })
  const [newImageTag, setNewImageTag] = useState('')
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null)
  const [expandedCollectionId, setExpandedCollectionId] = useState<number | null>(null)

  // Projects state
  const [projects, setProjects] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any>({
    id: 0,
    title: '',
    subtitle: '',
    description: '',
    category: '',
    tags: [],
    coverImage: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    client: '',
    technologies: [],
    links: [],
    team: [],
    budget: 0,
    priority: 'medium',
    slug: ''
  })
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [newProjectTag, setNewProjectTag] = useState('')
  const [newTechnology, setNewTechnology] = useState('')

  // Collaborations state
  const [collaborations, setCollaborations] = useState<any[]>([])
  const [currentCollaboration, setCurrentCollaboration] = useState<any>({
    id: 0,
    title: '',
    subtitle: '',
    description: '',
    type: 'partnership',
    status: 'inquiry',
    partner: { name: '', contact: '', website: '' },
    coverImage: '',
    startDate: '',
    endDate: '',
    deliverables: [],
    terms: '',
    budget: 0,
    priority: 'medium',
    tags: [],
    slug: ''
  })
  const [editingCollaborationId, setEditingCollaborationId] = useState<number | null>(null)
  const [newCollaborationTag, setNewCollaborationTag] = useState('')
  const [newDeliverable, setNewDeliverable] = useState('')

  // Load posts from API on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/blog?sortBy=publishedAt&sortOrder=desc&limit=1000')
        
        if (response.ok) {
          const dbPosts = await response.json()
          
          // Convert database format to admin format
          const adminPosts: BlogPost[] = dbPosts.map((dbPost: any) => ({
            id: dbPost.id,
            title: dbPost.title,
            subtitle: dbPost.subtitle,
            subtitlePosition: dbPost.subtitlePosition,
            category: dbPost.category,
            date: dbPost.publishedAt ? dbPost.publishedAt.split('T')[0] : dbPost.createdAt.split('T')[0],
            tags: dbPost.tags,
            coverImage: dbPost.coverImage || '',
            content: dbPost.content,
            images: dbPost.images.map((img: any) => img.url || img)
          }))
          setPosts(adminPosts)
        }
      } catch (error) {
        console.error('Error loading posts from API:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPosts()
  }, [])

  // Load gallery collections from API
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetch('/api/gallery/collections')
        if (response.ok) {
          const collections = await response.json()
          setGalleryCollections(collections)
          console.log(`Loaded ${collections.length} collections from database`)
        } else {
          console.error('Failed to load collections:', response.statusText)
        }
      } catch (error) {
        console.error('Error loading gallery collections:', error)
      }
    }
    
    loadCollections()
  }, [])

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects?limit=1000&sortBy=createdAt&sortOrder=desc')
        if (response.ok) {
          const projectsData = await response.json()
          setProjects(projectsData)
          console.log(`Loaded ${projectsData.length} projects from database`)
        } else {
          console.error('Failed to load projects:', response.statusText)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    }
    
    loadProjects()
  }, [])

  // Load collaborations from API
  useEffect(() => {
    const loadCollaborations = async () => {
      try {
        const response = await fetch('/api/collaborations?limit=1000&sortBy=createdAt&sortOrder=desc')
        if (response.ok) {
          const collaborationsData = await response.json()
          setCollaborations(collaborationsData)
          console.log(`Loaded ${collaborationsData.length} collaborations from database`)
        } else {
          console.error('Failed to load collaborations:', response.statusText)
        }
      } catch (error) {
        console.error('Error loading collaborations:', error)
      }
    }
    
    loadCollaborations()
  }, [])

  const [currentPost, setCurrentPost] = useState<BlogPost>({
    id: 0,
    title: '',
    subtitle: '',
    subtitlePosition: 'after',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    coverImage: '',
    content: '',
    images: []
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [newTag, setNewTag] = useState('')
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null)
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({}) // filename -> URL mapping
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set()) // track uploading files
  const [currentPostFolder, setCurrentPostFolder] = useState<PostFolder | null>(null) // current post folder structure
  const [contentEditMode, setContentEditMode] = useState<'text' | 'visual'>('text') // content editor mode
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null) // for drag and drop
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterTag, setFilterTag] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [postsPerPage] = useState(20)
  const [currentPostsPage, setCurrentPostsPage] = useState(0)

  const handleSave = async () => {
    if (!currentPost.title.trim()) {
      alert('Please enter a title')
      return
    }
    
    try {
      const postData = {
        title: currentPost.title,
        subtitle: currentPost.subtitle,
        subtitlePosition: currentPost.subtitlePosition,
        content: currentPost.content,
        category: currentPost.category,
        tags: currentPost.tags,
        coverImage: currentPost.coverImage,
        author: 'Admin',
        publishedAt: currentPost.date + 'T00:00:00.000Z',
        status: 'published',
        images: currentPost.images.map((url, index) => ({
          id: index + 1,
          url,
          alt: `Image ${index + 1}`,
          position: index + 1
        })),
        slug: currentPost.title.toLowerCase().replace(/\s+/g, '-')
      }
      
      if (editingId) {
        // Update existing post
        const response = await fetch(`/api/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
        
        if (response.ok) {
          // Reload posts
          const postsResponse = await fetch('/api/blog?sortBy=publishedAt&sortOrder=desc&limit=1000')
          if (postsResponse.ok) {
            const dbPosts = await postsResponse.json()
            const adminPosts: BlogPost[] = dbPosts.map((dbPost: any) => ({
              id: dbPost.id,
              title: dbPost.title,
              subtitle: dbPost.subtitle,
              subtitlePosition: dbPost.subtitlePosition,
              category: dbPost.category,
              date: dbPost.publishedAt ? dbPost.publishedAt.split('T')[0] : dbPost.createdAt.split('T')[0],
              tags: dbPost.tags,
              coverImage: dbPost.coverImage || '',
              content: dbPost.content,
              images: dbPost.images.map((img: any) => img.url || img)
            }))
            setPosts(adminPosts)
          }
          resetForm()
          alert('Post updated successfully!')
        } else {
          alert('Error updating post')
        }
      } else {
        // Create new post
        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
        
        if (response.ok) {
          // Reload posts
          const postsResponse = await fetch('/api/blog?sortBy=publishedAt&sortOrder=desc&limit=1000')
          if (postsResponse.ok) {
            const dbPosts = await postsResponse.json()
            const adminPosts: BlogPost[] = dbPosts.map((dbPost: any) => ({
              id: dbPost.id,
              title: dbPost.title,
              subtitle: dbPost.subtitle,
              subtitlePosition: dbPost.subtitlePosition,
              category: dbPost.category,
              date: dbPost.publishedAt ? dbPost.publishedAt.split('T')[0] : dbPost.createdAt.split('T')[0],
              tags: dbPost.tags,
              coverImage: dbPost.coverImage || '',
              content: dbPost.content,
              images: dbPost.images.map((img: any) => img.url || img)
            }))
            setPosts(adminPosts)
          }
          resetForm()
          alert('Post created successfully!')
        } else {
          alert('Error creating post')
        }
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post: ' + error)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post)
    setEditingId(post.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Reload posts
        const postsResponse = await fetch('/api/blog?sortBy=publishedAt&sortOrder=desc&limit=1000')
        if (postsResponse.ok) {
          const dbPosts = await postsResponse.json()
          const adminPosts: BlogPost[] = dbPosts.map((dbPost: any) => ({
            id: dbPost.id,
            title: dbPost.title,
            subtitle: dbPost.subtitle,
            subtitlePosition: dbPost.subtitlePosition,
            category: dbPost.category,
            date: dbPost.publishedAt ? dbPost.publishedAt.split('T')[0] : dbPost.createdAt.split('T')[0],
            tags: dbPost.tags,
            coverImage: dbPost.coverImage || '',
            content: dbPost.content,
            images: dbPost.images.map((img: any) => img.url || img)
          }))
          setPosts(adminPosts)
        }
        alert('Post deleted successfully!')
      } else {
        alert('Error deleting post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    }
  }

  const resetForm = () => {
    // Clean up temporary URLs
    Object.values(uploadedImages).forEach(url => {
      cleanupTempUrl(url)
    })
    
    setCurrentPost({
      id: 0,
      title: '',
      subtitle: '',
      subtitlePosition: 'after',
      category: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      coverImage: '',
      content: '',
      images: []
    })
    setEditingId(null)
    setSelectedCoverFile(null)
    setSelectedImageFiles([])
    setUploadedImages({})
    setUploadingFiles(new Set())
    setCurrentPostFolder(null)
  }

  const addTag = () => {
    if (newTag.trim() && !currentPost.tags.includes(newTag.trim())) {
      setCurrentPost({
        ...currentPost,
        tags: [...currentPost.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const removeImage = (imageToRemove: string) => {
    setCurrentPost({
      ...currentPost,
      images: currentPost.images.filter(img => img !== imageToRemove)
    })
    
    // Also update the post folder structure
    if (currentPostFolder) {
      currentPostFolder.files.images = currentPostFolder.files.images.filter(img => img !== imageToRemove)
      setCurrentPostFolder({...currentPostFolder})
    }
  }

  const insertImageInContent = (imagePath: string) => {
    const imageTag = `<img src="${imagePath}" alt="Image" />`
    setCurrentPost({
      ...currentPost,
      content: currentPost.content + '\n\n' + imageTag + '\n\n'
    })
  }

  const exportPosts = () => {
    const dataStr = JSON.stringify(posts, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'blog-posts.json'
    link.click()
  }

  const importPosts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedPosts = JSON.parse(e.target?.result as string)
          if (Array.isArray(importedPosts)) {
            setPosts(importedPosts)
            alert('Posts imported successfully!')
          } else {
            alert('Invalid file format')
          }
        } catch (error) {
          alert('Error importing posts: ' + error)
        }
      }
      reader.readAsText(file)
    }
  }

  const importSamplePosts = async () => {
    if (!confirm('This will import 20 sample blog posts. Continue?')) {
      return
    }
    
    try {
      // Fetch the sample posts JSON
      const response = await fetch('/new-blog-posts.json')
      if (!response.ok) {
        throw new Error('Failed to load sample posts file')
      }
      
      const samplePosts = await response.json()
      
      // Filter out posts that already exist
      const existingIds = new Set(posts.map(p => p.id))
      const newPosts = samplePosts.filter((p: BlogPost) => !existingIds.has(p.id))
      
      if (newPosts.length === 0) {
        alert('All sample posts already exist!')
        return
      }
      
      // Add new posts to database
      let successCount = 0
      for (const post of newPosts) {
        try {
          const dbPost: Omit<DBBlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
            title: post.title,
            subtitle: post.subtitle,
            subtitlePosition: post.subtitlePosition,
            content: post.content,
            category: post.category,
            tags: post.tags,
            coverImage: post.coverImage,
            publishedAt: post.date + 'T00:00:00.000Z',
            images: post.images.map((url: string, index: number) => ({
              id: index + 1,
              url,
              alt: `Image ${index + 1}`,
              position: index + 1
            })),
            status: 'published',
            author: 'Admin',
            isActive: true,
            viewCount: 0,
            likes: 0,
            seo: {
              keywords: post.tags,
              metaTitle: post.title,
              metaDescription: post.subtitle || post.title
            }
          }
          
          const result = await dataService.createBlogPost(dbPost)
          if (result.success) {
            successCount++
          }
        } catch (error) {
          console.error(`Failed to import post "${post.title}":`, error)
        }
      }
      
      // Reload posts
      const reloadResponse = await dataService.getBlogPosts({ 
        sortBy: 'publishedAt', 
        sortOrder: 'desc',
        limit: 1000 
      })
      
      if (reloadResponse.success && reloadResponse.data) {
        const adminPosts: BlogPost[] = reloadResponse.data.map(dbPost => ({
          id: dbPost.id,
          title: dbPost.title,
          subtitle: dbPost.subtitle,
          subtitlePosition: dbPost.subtitlePosition,
          category: dbPost.category,
          date: dbPost.publishedAt ? dbPost.publishedAt.split('T')[0] : dbPost.createdAt.split('T')[0],
          tags: dbPost.tags,
          coverImage: dbPost.coverImage || '',
          content: dbPost.content,
          images: dbPost.images.map(img => img.url)
        }))
        setPosts(adminPosts)
      }
      
      alert(`Successfully imported ${successCount} sample posts!`)
    } catch (error) {
      console.error('Error importing sample posts:', error)
      alert('Error importing sample posts. Check console for details.')
    }
  }

  const previewPostContent = (post: BlogPost) => {
    setPreviewPost(post)
  }

  const closePreview = () => {
    setPreviewPost(null)
  }

  // Handle cover image file selection
  const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    
    try {
      setUploadingFiles(prev => new Set(prev).add(file.name))
      
      // Compress image to max 4K resolution
      console.log(`Compressing ${file.name}...`)
      const compressionResult = await compressImage(file, {
        maxWidth: 3840,
        maxHeight: 2160,
        quality: 0.9,
        maxSizeMB: 5
      })
      
      if (compressionResult.wasCompressed) {
        console.log(`✓ Compressed ${file.name}:`)
        console.log(`  Original: ${formatFileSize(compressionResult.originalSize)} (${compressionResult.originalDimensions.width}x${compressionResult.originalDimensions.height})`)
        console.log(`  Compressed: ${formatFileSize(compressionResult.compressedSize)} (${compressionResult.compressedDimensions.width}x${compressionResult.compressedDimensions.height})`)
        console.log(`  Ratio: ${compressionResult.compressionRatio.toFixed(2)}x`)
      }
      
      // Upload compressed file to server
      const formData = new FormData()
      formData.append('file', compressionResult.file)
      formData.append('folder', 'blog-images')
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      
      const uploadResult = await uploadResponse.json()
      
      if (uploadResult.success && uploadResult.url) {
        setCurrentPost({
          ...currentPost,
          coverImage: uploadResult.url
        })
        setSelectedCoverFile(compressionResult.file)
        console.log(`✓ Uploaded to: ${uploadResult.url}`)
      } else {
        throw new Error('Upload failed')
      }
      
    } catch (error) {
      console.error('Error processing cover image:', error)
      alert('Error processing image')
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(file.name)
        return newSet
      })
    }
  }

  // Handle multiple image file selection
  const handleImageFilesSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    
    // Validate all files first
    for (const file of files) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`)
        return
      }
    }
    
    try {
      // Compress and upload all images
      console.log(`Processing ${files.length} images...`)
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadingFiles(prev => new Set(prev).add(file.name))
        
        // Compress
        const result = await compressImage(file, {
          maxWidth: 3840,
          maxHeight: 2160,
          quality: 0.9,
          maxSizeMB: 5
        })
        
        if (result.wasCompressed) {
          console.log(`✓ Compressed ${file.name}: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${result.compressionRatio.toFixed(2)}x)`)
        }
        
        // Upload to server
        const formData = new FormData()
        formData.append('file', result.file)
        formData.append('folder', 'blog-images')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          if (uploadResult.success && uploadResult.url) {
            uploadedUrls.push(uploadResult.url)
            console.log(`✓ Uploaded ${file.name} to: ${uploadResult.url}`)
          }
        } else {
          console.error(`Failed to upload ${file.name}`)
        }
        
        setUploadingFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(file.name)
          return newSet
        })
      }
      
      // Update state with uploaded URLs
      if (uploadedUrls.length > 0) {
        setCurrentPost(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }))
        
        console.log(`✓ All ${uploadedUrls.length} images uploaded successfully`)
      }
      
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images')
    }
  }

  // Simulate server upload (for now just returns the temporary URL)
  const uploadImageToServer = async (file: File): Promise<string> => {
    // TODO: Replace with actual server upload logic
    // For now, return the temporary URL
    return uploadedImages[file.name] || URL.createObjectURL(file)
  }

  // Clean up temporary URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(uploadedImages).forEach(url => {
        cleanupTempUrl(url)
      })
    }
  }, [uploadedImages])

  // Get filtered and sorted posts
  const getFilteredAndSortedPosts = () => {
    let filteredPosts = posts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!post.title.toLowerCase().includes(query) && 
            !post.subtitle.toLowerCase().includes(query) &&
            !post.content.toLowerCase().includes(query)) {
          return false
        }
      }
      
      // Category filter
      if (filterCategory && post.category !== filterCategory) {
        return false
      }
      
      // Tag filter
      if (filterTag && !post.tags.includes(filterTag)) {
        return false
      }
      
      return true
    })
    
    // Sort posts
    filteredPosts.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    return filteredPosts
  }

  // Get unique categories and tags for filters
  const getUniqueCategories = () => {
    return [...new Set(posts.map(post => post.category).filter(Boolean))]
  }

  const getUniqueTags = () => {
    return [...new Set(posts.flatMap(post => post.tags))]
  }

  // Paginated posts
  const filteredPosts = getFilteredAndSortedPosts()
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage)
  const paginatedPosts = filteredPosts.slice(
    currentPostsPage * postsPerPage,
    (currentPostsPage + 1) * postsPerPage
  )

  // Gallery Management Functions
  const handleSaveCollection = async () => {
    if (!currentCollection.name.trim()) {
      alert('Please enter a collection name')
      return
    }
    
    // Determine cover image based on source
    let coverImage = currentCollection.coverImage
    if (currentCollection.coverImageSource === 'collection' && currentCollection.images.length > 0) {
      const coverIndex = Math.min(currentCollection.coverImageIndex, currentCollection.images.length - 1)
      coverImage = currentCollection.images[coverIndex]?.url || currentCollection.images[0]?.url
    }
    
    if (!coverImage) {
      alert('Please add at least one image or provide an external cover image')
      return
    }
    
    // Generate slug from name if not provided
    const slug = currentCollection.slug || currentCollection.name.toLowerCase().replace(/\s+/g, '-')
    
    try {
      const dataToSave = {
        ...currentCollection,
        slug,
        coverImage
      }
      
      if (editingCollectionId) {
        // Update existing collection
        const response = await fetch(`/api/gallery/collections/${editingCollectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          // Reload collections
          const collectionsResponse = await fetch('/api/gallery/collections')
          if (collectionsResponse.ok) {
            const collections = await collectionsResponse.json()
            setGalleryCollections(collections)
          }
          setExpandedCollectionId(null)
          resetCollectionForm()
          alert('Collection updated successfully!')
        } else {
          const error = await response.json()
          alert('Error updating collection: ' + (error.error || 'Unknown error'))
        }
      } else {
        // Create new collection
        const response = await fetch('/api/gallery/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          // Reload collections
          const collectionsResponse = await fetch('/api/gallery/collections')
          if (collectionsResponse.ok) {
            const collections = await collectionsResponse.json()
            setGalleryCollections(collections)
          }
          setExpandedCollectionId(null)
          resetCollectionForm()
          alert('Collection created successfully!')
        } else {
          const error = await response.json()
          alert('Error creating collection: ' + (error.error || 'Unknown error'))
        }
      }
    } catch (error) {
      console.error('Error saving collection:', error)
      alert('Error saving collection')
    }
  }

  const handleEditCollection = (collection: any) => {
    // Determine cover image source
    const coverImageSource = collection.images && collection.images.length > 0 && 
                            collection.images.some((img: any) => img.url === collection.coverImage)
                            ? 'collection' : 'external'
    
    const coverImageIndex = coverImageSource === 'collection' 
      ? collection.images.findIndex((img: any) => img.url === collection.coverImage)
      : 0
    
    setCurrentCollection({
      ...collection,
      coverImageSource,
      coverImageIndex: coverImageIndex >= 0 ? coverImageIndex : 0
    })
    setEditingCollectionId(collection.id)
    setExpandedCollectionId(collection.id)
  }

  const toggleExpandCollection = (collectionId: number) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null)
      if (editingCollectionId === collectionId) {
        resetCollectionForm()
      }
    } else {
      const collection = galleryCollections.find(c => c.id === collectionId)
      if (collection) {
        handleEditCollection(collection)
      }
    }
  }

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/gallery/collections/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Reload collections
        const collectionsResponse = await fetch('/api/gallery/collections')
        if (collectionsResponse.ok) {
          const collections = await collectionsResponse.json()
          setGalleryCollections(collections)
        }
        alert('Collection deleted successfully!')
      } else {
        const error = await response.json()
        alert('Error deleting collection: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Error deleting collection')
    }
  }

  const resetCollectionForm = () => {
    setCurrentCollection({
      id: 0,
      name: '',
      slug: '',
      description: '',
      coverImage: '',
      coverImageSource: 'collection',
      coverImageIndex: 0,
      category: '',
      tags: [],
      images: [],
      isPublic: true,
      sortOrder: 0,
      startDate: '',
      endDate: ''
    })
    setEditingCollectionId(null)
    setExpandedCollectionId(null)
    setCurrentImage({
      url: '',
      alt: '',
      caption: '',
      description: '',
      tags: [],
      dimensions: { width: 0, height: 0, aspectRatio: 0 },
      metadata: { fileSize: 0, mimeType: '', originalName: '', uploadedAt: '' },
      sortOrder: 0,
      photoDate: ''
    })
    setEditingImageIndex(null)
  }

  // Image management within collection
  const addImageToCollection = () => {
    if (!currentImage.url.trim()) {
      alert('Please enter an image URL')
      return
    }
    
    if (editingImageIndex !== null) {
      // Update existing image
      const updatedImages = [...currentCollection.images]
      updatedImages[editingImageIndex] = {
        ...currentImage,
        sortOrder: editingImageIndex
      }
      setCurrentCollection({
        ...currentCollection,
        images: updatedImages
      })
      setEditingImageIndex(null)
    } else {
      // Add new image
      const newImage = {
        ...currentImage,
        sortOrder: currentCollection.images.length
      }
      setCurrentCollection({
        ...currentCollection,
        images: [...currentCollection.images, newImage]
      })
    }
    
    // Reset image form
    setCurrentImage({
      url: '',
      alt: '',
      caption: '',
      description: '',
      tags: [],
      dimensions: { width: 0, height: 0, aspectRatio: 0 },
      metadata: { fileSize: 0, mimeType: '', originalName: '', uploadedAt: new Date().toISOString() },
      sortOrder: 0
    })
  }

  const editImage = (index: number) => {
    const image = currentCollection.images[index]
    setCurrentImage({
      ...image,
      tags: image.tags || [] // Ensure tags is always an array
    })
    setEditingImageIndex(index)
  }

  const removeImageFromCollection = (index: number) => {
    const updatedImages = currentCollection.images.filter((_: any, i: number) => i !== index)
    // Reorder
    updatedImages.forEach((img: any, i: number) => {
      img.sortOrder = i
    })
    setCurrentCollection({
      ...currentCollection,
      images: updatedImages
    })
  }

  const moveCollectionImageUp = (index: number) => {
    if (index === 0) return
    const updatedImages = [...currentCollection.images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index - 1]
    updatedImages[index - 1] = temp
    // Update sort orders
    updatedImages.forEach((img: any, i: number) => {
      img.sortOrder = i
    })
    setCurrentCollection({
      ...currentCollection,
      images: updatedImages
    })
  }

  const moveCollectionImageDown = (index: number) => {
    if (index === currentCollection.images.length - 1) return
    const updatedImages = [...currentCollection.images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index + 1]
    updatedImages[index + 1] = temp
    // Update sort orders
    updatedImages.forEach((img: any, i: number) => {
      img.sortOrder = i
    })
    setCurrentCollection({
      ...currentCollection,
      images: updatedImages
    })
  }

  const addImageTag = async () => {
    const tags = currentImage.tags || []
    if (newImageTag.trim() && !tags.includes(newImageTag.trim())) {
      const updatedImage = {
        ...currentImage,
        tags: [...tags, newImageTag.trim()]
      }
      setCurrentImage(updatedImage)
      
      // Update the image in the collection
      if (editingImageIndex !== null) {
        const updatedImages = [...currentCollection.images]
        updatedImages[editingImageIndex] = updatedImage
        setCurrentCollection({
          ...currentCollection,
          images: updatedImages
        })
        
        // Save to database immediately if image has an ID
        if (updatedImage.id) {
          try {
            const response = await fetch(`/api/gallery/images/${updatedImage.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedImage)
            })
            
            if (response.ok) {
              console.log('Image tags saved successfully')
            } else {
              console.error('Failed to save image tags')
            }
          } catch (error) {
            console.error('Error saving image tags:', error)
          }
        }
      }
      
      setNewImageTag('')
    }
  }

  const removeImageTag = async (tagToRemove: string) => {
    const tags = currentImage.tags || []
    const updatedImage = {
      ...currentImage,
      tags: tags.filter((tag: string) => tag !== tagToRemove)
    }
    setCurrentImage(updatedImage)
    
    // Update the image in the collection
    if (editingImageIndex !== null) {
      const updatedImages = [...currentCollection.images]
      updatedImages[editingImageIndex] = updatedImage
      setCurrentCollection({
        ...currentCollection,
        images: updatedImages
      })
      
      // Save to database immediately if image has an ID
      if (updatedImage.id) {
        try {
          const response = await fetch(`/api/gallery/images/${updatedImage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedImage)
          })
          
          if (response.ok) {
            console.log('Image tags saved successfully')
          } else {
            console.error('Failed to save image tags')
          }
        } catch (error) {
          console.error('Error saving image tags:', error)
        }
      }
    }
  }

  const exportCollections = () => {
    const dataStr = JSON.stringify(galleryCollections, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gallery-collections.json'
    link.click()
  }

  // ============ PROJECTS MANAGEMENT ============
  
  const handleSaveProject = async () => {
    if (!currentProject.title.trim()) {
      alert('Please enter a project title')
      return
    }
    
    const slug = currentProject.slug || currentProject.title.toLowerCase().replace(/\s+/g, '-')
    
    try {
      const dataToSave = {
        ...currentProject,
        slug
      }
      
      if (editingProjectId) {
        // Update existing project
        const response = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          const projectsResponse = await fetch('/api/projects?limit=1000&sortBy=createdAt&sortOrder=desc')
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json()
            setProjects(projectsData)
          }
          resetProjectForm()
          alert('Project updated successfully!')
        } else {
          const error = await response.json()
          alert('Error updating project: ' + (error.error || 'Unknown error'))
        }
      } else {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          const projectsResponse = await fetch('/api/projects?limit=1000&sortBy=createdAt&sortOrder=desc')
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json()
            setProjects(projectsData)
          }
          resetProjectForm()
          alert('Project created successfully!')
        } else {
          const error = await response.json()
          alert('Error creating project: ' + (error.error || 'Unknown error'))
        }
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    }
  }

  const handleEditProject = (project: any) => {
    setCurrentProject(project)
    setEditingProjectId(project.id)
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const projectsResponse = await fetch('/api/projects?limit=1000&sortBy=createdAt&sortOrder=desc')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }
        alert('Project deleted successfully!')
      } else {
        const error = await response.json()
        alert('Error deleting project: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  const resetProjectForm = () => {
    setCurrentProject({
      id: 0,
      title: '',
      subtitle: '',
      description: '',
      category: '',
      tags: [],
      coverImage: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      client: '',
      technologies: [],
      links: [],
      team: [],
      budget: 0,
      priority: 'medium',
      slug: ''
    })
    setEditingProjectId(null)
  }

  const addProjectTag = () => {
    if (newProjectTag.trim() && !currentProject.tags.includes(newProjectTag.trim())) {
      setCurrentProject({
        ...currentProject,
        tags: [...currentProject.tags, newProjectTag.trim()]
      })
      setNewProjectTag('')
    }
  }

  const removeProjectTag = (tagToRemove: string) => {
    setCurrentProject({
      ...currentProject,
      tags: currentProject.tags.filter((tag: string) => tag !== tagToRemove)
    })
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !currentProject.technologies.includes(newTechnology.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, newTechnology.trim()]
      })
      setNewTechnology('')
    }
  }

  const removeTechnology = (techToRemove: string) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter((tech: string) => tech !== techToRemove)
    })
  }

  // ============ COLLABORATIONS MANAGEMENT ============
  
  const handleSaveCollaboration = async () => {
    if (!currentCollaboration.title.trim()) {
      alert('Please enter a collaboration title')
      return
    }
    
    const slug = currentCollaboration.slug || currentCollaboration.title.toLowerCase().replace(/\s+/g, '-')
    
    try {
      const dataToSave = {
        ...currentCollaboration,
        slug
      }
      
      if (editingCollaborationId) {
        // Update existing collaboration
        const response = await fetch(`/api/collaborations/${editingCollaborationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          const collaborationsResponse = await fetch('/api/collaborations?limit=1000&sortBy=createdAt&sortOrder=desc')
          if (collaborationsResponse.ok) {
            const collaborationsData = await collaborationsResponse.json()
            setCollaborations(collaborationsData)
          }
          resetCollaborationForm()
          alert('Collaboration updated successfully!')
        } else {
          const error = await response.json()
          alert('Error updating collaboration: ' + (error.error || 'Unknown error'))
        }
      } else {
        // Create new collaboration
        const response = await fetch('/api/collaborations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
        
        if (response.ok) {
          const collaborationsResponse = await fetch('/api/collaborations?limit=1000&sortBy=createdAt&sortOrder=desc')
          if (collaborationsResponse.ok) {
            const collaborationsData = await collaborationsResponse.json()
            setCollaborations(collaborationsData)
          }
          resetCollaborationForm()
          alert('Collaboration created successfully!')
        } else {
          const error = await response.json()
          alert('Error creating collaboration: ' + (error.error || 'Unknown error'))
        }
      }
    } catch (error) {
      console.error('Error saving collaboration:', error)
      alert('Error saving collaboration')
    }
  }

  const handleEditCollaboration = (collaboration: any) => {
    setCurrentCollaboration(collaboration)
    setEditingCollaborationId(collaboration.id)
  }

  const handleDeleteCollaboration = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collaboration?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/collaborations/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const collaborationsResponse = await fetch('/api/collaborations?limit=1000&sortBy=createdAt&sortOrder=desc')
        if (collaborationsResponse.ok) {
          const collaborationsData = await collaborationsResponse.json()
          setCollaborations(collaborationsData)
        }
        alert('Collaboration deleted successfully!')
      } else {
        const error = await response.json()
        alert('Error deleting collaboration: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting collaboration:', error)
      alert('Error deleting collaboration')
    }
  }

  const resetCollaborationForm = () => {
    setCurrentCollaboration({
      id: 0,
      title: '',
      subtitle: '',
      description: '',
      type: 'partnership',
      status: 'inquiry',
      partner: { name: '', contact: '', website: '' },
      coverImage: '',
      startDate: '',
      endDate: '',
      deliverables: [],
      terms: '',
      budget: 0,
      priority: 'medium',
      tags: [],
      slug: ''
    })
    setEditingCollaborationId(null)
  }

  const addCollaborationTag = () => {
    if (newCollaborationTag.trim() && !currentCollaboration.tags.includes(newCollaborationTag.trim())) {
      setCurrentCollaboration({
        ...currentCollaboration,
        tags: [...currentCollaboration.tags, newCollaborationTag.trim()]
      })
      setNewCollaborationTag('')
    }
  }

  const removeCollaborationTag = (tagToRemove: string) => {
    setCurrentCollaboration({
      ...currentCollaboration,
      tags: currentCollaboration.tags.filter((tag: string) => tag !== tagToRemove)
    })
  }

  const addDeliverable = () => {
    if (newDeliverable.trim() && !currentCollaboration.deliverables.includes(newDeliverable.trim())) {
      setCurrentCollaboration({
        ...currentCollaboration,
        deliverables: [...currentCollaboration.deliverables, newDeliverable.trim()]
      })
      setNewDeliverable('')
    }
  }

  const removeDeliverable = (deliverableToRemove: string) => {
    setCurrentCollaboration({
      ...currentCollaboration,
      deliverables: currentCollaboration.deliverables.filter((d: string) => d !== deliverableToRemove)
    })
  }

  // Render collection form (used in both new and edit modes)
  const renderCollectionForm = () => (
    <div className={styles.collectionForm}>
      {/* Basic Info - One Line */}
      <div className={styles.formRow}>
        <input
          type="text"
          value={currentCollection.name}
          onChange={(e) => setCurrentCollection({...currentCollection, name: e.target.value})}
          placeholder="Collection Name"
          className={styles.inlineInput}
        />
        <input
          type="text"
          value={currentCollection.category}
          onChange={(e) => setCurrentCollection({...currentCollection, category: e.target.value})}
          placeholder="Category"
          className={styles.inlineInput}
        />
        <input
          type="text"
          value={currentCollection.slug}
          onChange={(e) => setCurrentCollection({...currentCollection, slug: e.target.value})}
          placeholder="slug (auto)"
          className={styles.inlineInputSmall}
        />
      </div>

      {/* Description */}
      <textarea
        value={currentCollection.description}
        onChange={(e) => setCurrentCollection({...currentCollection, description: e.target.value})}
        placeholder="Description"
        rows={2}
        className={styles.inlineTextarea}
      />

      {/* Date Range */}
      <div className={styles.formRow}>
        <div className={styles.dateField}>
          <label>Start Date:</label>
          <input
            type="date"
            value={currentCollection.startDate || ''}
            onChange={(e) => setCurrentCollection({...currentCollection, startDate: e.target.value})}
            className={styles.inlineInput}
          />
        </div>
        <div className={styles.dateField}>
          <label>End Date:</label>
          <input
            type="date"
            value={currentCollection.endDate || ''}
            onChange={(e) => setCurrentCollection({...currentCollection, endDate: e.target.value})}
            className={styles.inlineInput}
          />
        </div>
      </div>

      {/* Cover Image Selection */}
      <div className={styles.coverImageSection}>
        <label>Cover Image:</label>
        <div className={styles.coverOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              checked={currentCollection.coverImageSource === 'collection'}
              onChange={() => setCurrentCollection({...currentCollection, coverImageSource: 'collection'})}
            />
            From Collection (Image #{currentCollection.coverImageIndex + 1})
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              checked={currentCollection.coverImageSource === 'external'}
              onChange={() => setCurrentCollection({...currentCollection, coverImageSource: 'external'})}
            />
            External URL
          </label>
        </div>
        
        {currentCollection.coverImageSource === 'external' && (
          <input
            type="text"
            value={currentCollection.coverImage}
            onChange={(e) => setCurrentCollection({...currentCollection, coverImage: e.target.value})}
            placeholder="External cover image URL"
            className={styles.inlineInput}
          />
        )}
      </div>

      {/* Images Grid - Thumbnails in One Line */}
      <div className={styles.imagesGrid}>
        <div className={styles.imagesHeader}>
          <h4>Images ({currentCollection.images.length})</h4>
          <button onClick={() => {
            setEditingImageIndex(null)
            setCurrentImage({
              url: '',
              alt: '',
              caption: '',
              description: '',
              tags: [],
              dimensions: { width: 0, height: 0, aspectRatio: 0 },
              metadata: { fileSize: 0, mimeType: '', originalName: '', uploadedAt: new Date().toISOString() },
              sortOrder: currentCollection.images.length,
              photoDate: ''
            })
          }} className={styles.smallBtn}>
            + Add Image
          </button>
        </div>
        
        <div className={styles.imagesRow}>
          {currentCollection.images.map((image: any, index: number) => (
            <div 
              key={index} 
              className={`${styles.imageThumbnail} ${currentCollection.coverImageSource === 'collection' && currentCollection.coverImageIndex === index ? styles.coverImage : ''}`}
              onClick={() => {
                if (currentCollection.coverImageSource === 'collection') {
                  setCurrentCollection({...currentCollection, coverImageIndex: index})
                }
              }}
            >
              <img src={image.url} alt={image.alt} />
              <div className={styles.imageOverlay}>
                <span className={styles.imageNumber}>#{index + 1}</span>
                {currentCollection.coverImageSource === 'collection' && currentCollection.coverImageIndex === index && (
                  <span className={styles.coverBadge}>COVER</span>
                )}
              </div>
              <div className={styles.imageMeta}>
                <div className={styles.imageAlt}>{image.alt}</div>
                <div className={styles.imageTags}>
                  {(image.tags || []).slice(0, 2).map((tag: string) => (
                    <span key={tag} className={styles.tagTiny}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.imageControls}>
                <button onClick={(e) => { e.stopPropagation(); moveCollectionImageUp(index); }} disabled={index === 0}>↑</button>
                <button onClick={(e) => { e.stopPropagation(); moveCollectionImageDown(index); }} disabled={index === currentCollection.images.length - 1}>↓</button>
                <button onClick={(e) => { e.stopPropagation(); editImage(index); }}>✎</button>
                <button onClick={(e) => { e.stopPropagation(); removeImageFromCollection(index); }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Edit Form (when editing) */}
      {editingImageIndex !== null && (
        <div className={styles.imageEditForm}>
          <h4>Edit Image #{editingImageIndex + 1}</h4>
          <div className={styles.formRow}>
            <input
              type="text"
              value={currentImage.url}
              onChange={(e) => setCurrentImage({...currentImage, url: e.target.value})}
              placeholder="Image URL"
              className={styles.inlineInput}
            />
            <input
              type="text"
              value={currentImage.alt}
              onChange={(e) => setCurrentImage({...currentImage, alt: e.target.value})}
              placeholder="Alt text"
              className={styles.inlineInput}
            />
          </div>
          <input
            type="text"
            value={currentImage.caption}
            onChange={(e) => setCurrentImage({...currentImage, caption: e.target.value})}
            placeholder="Caption (optional)"
            className={styles.inlineInput}
          />
          <div className={styles.dateField}>
            <label>Photo Date:</label>
            <input
              type="date"
              value={currentImage.photoDate || ''}
              onChange={(e) => setCurrentImage({...currentImage, photoDate: e.target.value})}
              className={styles.inlineInput}
            />
          </div>
          <div className={styles.tagSection}>
            <label>Image Tags:</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={newImageTag}
                onChange={(e) => setNewImageTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageTag())}
              />
              <button onClick={addImageTag} className={styles.smallBtn}>+</button>
            </div>
            <div className={styles.tagList}>
              {(currentImage.tags || []).map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button onClick={() => removeImageTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={addImageToCollection} className={styles.saveBtn}>
              Update Image
            </button>
            <button onClick={() => {
              setEditingImageIndex(null)
              setCurrentImage({
                url: '',
                alt: '',
                caption: '',
                description: '',
                tags: [],
                dimensions: { width: 0, height: 0, aspectRatio: 0 },
                metadata: { fileSize: 0, mimeType: '', originalName: '', uploadedAt: '' },
                sortOrder: 0,
                photoDate: ''
              })
            }} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add New Image Form */}
      {editingImageIndex === null && currentImage.url === '' && (
        <div className={styles.imageEditForm}>
          <h4>Add New Image</h4>
          <div className={styles.formRow}>
            <input
              type="text"
              value={currentImage.url}
              onChange={(e) => setCurrentImage({...currentImage, url: e.target.value})}
              placeholder="Image URL"
              className={styles.inlineInput}
            />
            <input
              type="text"
              value={currentImage.alt}
              onChange={(e) => setCurrentImage({...currentImage, alt: e.target.value})}
              placeholder="Alt text"
              className={styles.inlineInput}
            />
          </div>
          <input
            type="text"
            value={currentImage.caption}
            onChange={(e) => setCurrentImage({...currentImage, caption: e.target.value})}
            placeholder="Caption (optional)"
            className={styles.inlineInput}
          />
          <div className={styles.dateField}>
            <label>Photo Date:</label>
            <input
              type="date"
              value={currentImage.photoDate || ''}
              onChange={(e) => setCurrentImage({...currentImage, photoDate: e.target.value})}
              className={styles.inlineInput}
            />
          </div>
          <div className={styles.tagSection}>
            <label>Image Tags:</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={newImageTag}
                onChange={(e) => setNewImageTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageTag())}
              />
              <button onClick={addImageTag} className={styles.smallBtn}>+</button>
            </div>
            <div className={styles.tagList}>
              {(currentImage.tags || []).map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button onClick={() => removeImageTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <button onClick={addImageToCollection} className={styles.saveBtn}>
            Add Image
          </button>
        </div>
      )}

      {/* Save/Cancel Actions */}
      <div className={styles.formActions}>
        <button onClick={handleSaveCollection} className={styles.saveBtn}>
          {editingCollectionId ? 'Save Changes' : 'Create Collection'}
        </button>
        <button onClick={() => {
          setExpandedCollectionId(null)
          resetCollectionForm()
        }} className={styles.cancelBtn}>
          Cancel
        </button>
        {editingCollectionId && (
          <button onClick={() => handleDeleteCollection(editingCollectionId)} className={styles.deleteBtn}>
            Delete Collection
          </button>
        )}
      </div>
    </div>
  )

  // Process content with alternating image floats (same as blog page)
  const processContentWithAlternatingFloats = (content: string, hasCoverImage: boolean) => {
    let imageCount = hasCoverImage ? 1 : 0
    
    // First, wrap text blocks in paragraph tags if they aren't already
    let processedContent = content
      .split('\n\n')
      .map(block => {
        block = block.trim()
        if (!block) return ''
        
        // If it's an image tag, leave it as is
        if (block.startsWith('<img')) {
          return block
        }
        
        // If it's already wrapped in a tag, leave it as is
        if (block.startsWith('<')) {
          return block
        }
        
        // Otherwise, wrap in paragraph tags
        return `<p>${block}</p>`
      })
      .join('\n\n')
    
    // Then process images with alternating floats
    return processedContent.replace(/<img([^>]*)>/g, (match, attributes) => {
      const floatDirection = imageCount % 2 === 0 ? 'left' : 'right'
      imageCount++
      return `<img${attributes} style="max-width: 300px; height: auto; float: ${floatDirection}; margin: 1rem ${floatDirection === 'left' ? '1rem 1rem 0' : '0 1rem 1rem'}; border-radius: 4px;" />`
    })
  }

  // Visual editor: render content with draggable images
  const renderVisualContent = () => {
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    
    return blocks.map((block, index) => {
      const isImage = block.trim().startsWith('<img')
      
      if (isImage) {
        // Extract image src
        const srcMatch = block.match(/src="([^"]+)"/)
        const src = srcMatch ? srcMatch[1] : ''
        
        return (
          <div 
            key={index}
            className={styles.visualBlock}
            draggable
            onDragStart={() => setDraggedImageIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleImageDrop(index)
            }}
          >
            <div className={styles.visualImage}>
              <span className={styles.dragHandle}>⋮⋮</span>
              <img src={src} alt="Content" style={{ maxWidth: '150px', height: 'auto' }} />
              <div className={styles.imageControls}>
                <button onClick={() => moveImageUp(index)} disabled={index === 0} title="Move up">↑</button>
                <button onClick={() => moveImageDown(index)} disabled={index === blocks.length - 1} title="Move down">↓</button>
                <button onClick={() => removeBlockAtIndex(index)} title="Remove image">✕</button>
              </div>
            </div>
          </div>
        )
      } else {
        // Text block - show only first 5 words
        const words = block.split(/\s+/)
        const preview = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '')
        
        return (
          <div 
            key={index} 
            className={styles.visualBlock}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleImageDrop(index)
            }}
          >
            <div className={styles.visualTextRow}>
              <span className={styles.paragraphPreview}>{preview}</span>
              <button 
                className={styles.insertImageBtnInline}
                onClick={() => insertImageAtIndex(index + 1)}
              >
                + Insert Image
              </button>
            </div>
          </div>
        )
      }
    })
  }

  // Move image up in content
  const moveImageUp = (index: number) => {
    if (index === 0) return
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    const temp = blocks[index]
    blocks[index] = blocks[index - 1]
    blocks[index - 1] = temp
    setCurrentPost({ ...currentPost, content: blocks.join('\n\n') })
  }

  // Move image down in content
  const moveImageDown = (index: number) => {
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    if (index === blocks.length - 1) return
    const temp = blocks[index]
    blocks[index] = blocks[index + 1]
    blocks[index + 1] = temp
    setCurrentPost({ ...currentPost, content: blocks.join('\n\n') })
  }

  // Handle drag and drop
  const handleImageDrop = (targetIndex: number) => {
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
      setDraggedImageIndex(null)
      return
    }
    
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    const draggedBlock = blocks[draggedImageIndex]
    
    // Only allow dragging images
    if (!draggedBlock.trim().startsWith('<img')) {
      setDraggedImageIndex(null)
      return
    }
    
    // Remove from old position
    blocks.splice(draggedImageIndex, 1)
    
    // Insert at new position (adjust index if dragging down)
    const adjustedIndex = draggedImageIndex < targetIndex ? targetIndex - 1 : targetIndex
    blocks.splice(adjustedIndex, 0, draggedBlock)
    
    setCurrentPost({ ...currentPost, content: blocks.join('\n\n') })
    setDraggedImageIndex(null)
  }

  // Remove block at specific index
  const removeBlockAtIndex = (index: number) => {
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    blocks.splice(index, 1)
    setCurrentPost({ ...currentPost, content: blocks.join('\n\n') })
  }

  // Insert image at specific index
  const insertImageAtIndex = (index: number) => {
    if (currentPost.images.length === 0) {
      alert('Please upload images first')
      return
    }
    
    // Show image selector
    const imageUrl = prompt('Enter image URL or select from uploaded images:\n\n' + 
      currentPost.images.map((img, i) => `${i + 1}. ${img}`).join('\n') + 
      '\n\nEnter number or full URL:')
    
    if (!imageUrl) return
    
    let selectedImage = imageUrl
    const imageIndex = parseInt(imageUrl)
    if (!isNaN(imageIndex) && imageIndex > 0 && imageIndex <= currentPost.images.length) {
      selectedImage = currentPost.images[imageIndex - 1]
    }
    
    const blocks = currentPost.content.split('\n\n').filter(b => b.trim())
    const imageTag = `<img src="${selectedImage}" alt="Image" />`
    blocks.splice(index, 0, imageTag)
    setCurrentPost({ ...currentPost, content: blocks.join('\n\n') })
  }

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1>Admin Panel</h1>
        <div className={styles.headerActions}>
          <a href="/blog" target="_blank" className={styles.viewBtn}>
            View Blog
          </a>
          <a href="/gallery" target="_blank" className={styles.viewBtn}>
            View Gallery
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'blog' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'gallery' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'database' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('database')}
        >
          Database
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'collaborations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('collaborations')}
        >
          Collaborations
        </button>
      </div>

      <div className={styles.content}>
        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className={styles.tabContent}>
            <DataMigration />
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <>
            {/* Collections List with Inline Editing */}
            <div className={styles.postsSection}>
              <div className={styles.sectionHeader}>
                <h2>Gallery Collections ({galleryCollections.length} collections)</h2>
                <button onClick={() => {
                  resetCollectionForm()
                  setExpandedCollectionId(-1)
                }} className={styles.saveBtn}>
                  + New Collection
                </button>
              </div>
              
              {/* New Collection Form */}
              {expandedCollectionId === -1 && (
                <div className={styles.expandedCollection}>
                  <h3>Create New Collection</h3>
                  {renderCollectionForm()}
                </div>
              )}
              
              <div className={styles.collectionsList}>
                {galleryCollections.map(collection => (
                  <div key={collection.id} className={styles.collectionItem}>
                    {/* Collapsed View */}
                    {expandedCollectionId !== collection.id && (
                      <div className={styles.collectionCollapsed} onClick={() => toggleExpandCollection(collection.id)}>
                        <div className={styles.collectionPreview}>
                          <img 
                            src={collection.coverImage} 
                            alt={collection.name}
                            className={styles.collectionThumb}
                          />
                          <div className={styles.collectionInfo}>
                            <h3>{collection.name}</h3>
                            <p className={styles.collectionMeta}>
                              {collection.category} • {collection.images?.length || 0} images
                            </p>
                          </div>
                        </div>
                        <div className={styles.collectionActions}>
                          <span className={styles.expandHint}>Click to edit ▼</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded View */}
                    {expandedCollectionId === collection.id && editingCollectionId === collection.id && (
                      <div className={styles.expandedCollection}>
                        <div className={styles.expandedHeader}>
                          <h3>Edit Collection</h3>
                          <button onClick={() => toggleExpandCollection(collection.id)} className={styles.closeBtn}>
                            ✕ Close
                          </button>
                        </div>
                        {renderCollectionForm()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <>
            {/* Preview Modal */}
            {previewPost && (
              <div className={styles.previewModal}>
                <div className={styles.previewContent}>
                  <div className={styles.previewHeader}>
                    <h2>Preview: {previewPost.title}</h2>
                    <button onClick={closePreview} className={styles.closeBtn}>×</button>
                  </div>
                  <div className={styles.previewBody}>
                    <article className={styles.previewPost}>
                      {previewPost.coverImage && (
                        <img 
                          src={previewPost.coverImage} 
                          alt={previewPost.title}
                          style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            float: 'left',
                            margin: '0 1rem 1rem 0',
                            borderRadius: '4px'
                          }}
                        />
                      )}
                      <h2 style={{ margin: '0 0 0.5rem 0' }}>{previewPost.title}</h2>
                      <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic', color: '#666' }}>
                        {previewPost.subtitle}
                      </p>
                      <div 
                        style={{ 
                          textAlign: 'justify', 
                          lineHeight: '1.8',
                          overflow: 'hidden'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: processContentWithAlternatingFloats(previewPost.content, !!previewPost.coverImage)
                        }}
                      />
                    </article>
                  </div>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className={styles.formSection}>
              <h2>{editingId ? 'Edit Post' : 'Create New Post'}</h2>
              
              {!currentPostFolder && !editingId && (
                <div className={styles.folderHint}>
                  <strong>📁 Folder System:</strong> When you enter a title and upload images, a dedicated folder will be created for this post.
                </div>
              )}
              
              {currentPostFolder && (
                <div className={styles.postFolderInfo}>
                  <h3>📁 Post Folder: {currentPostFolder.postId}</h3>
                  <p>Path: {currentPostFolder.folderPath}</p>
                </div>
              )}
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                    placeholder="Post title"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input
                    type="text"
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                    placeholder="Photography, Art, etc."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={currentPost.subtitle}
                    onChange={(e) => setCurrentPost({...currentPost, subtitle: e.target.value})}
                    placeholder="Post subtitle"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtitle Position</label>
                  <select
                    value={currentPost.subtitlePosition}
                    onChange={(e) => setCurrentPost({...currentPost, subtitlePosition: e.target.value as 'before' | 'after'})}
                  >
                    <option value="before">Before Title</option>
                    <option value="after">After Title</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={currentPost.date}
                    onChange={(e) => setCurrentPost({...currentPost, date: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Cover Image</label>
                  <div className={styles.imageInputGroup}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageSelect}
                      className={styles.fileInput}
                      id="cover-image-file"
                    />
                    <label htmlFor="cover-image-file" className={styles.fileInputLabel}>
                      Browse Files
                    </label>
                  </div>
                  {currentPost.coverImage && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={currentPost.coverImage} 
                        alt="Cover preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tags</label>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button onClick={addTag}>Add</button>
                </div>
                <div className={styles.tagList}>
                  {currentPost.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Images</label>
                <div className={styles.imageInput}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesSelect}
                    className={styles.fileInput}
                    id="image-files"
                  />
                  <label htmlFor="image-files" className={styles.fileInputLabel}>
                    Browse Files
                  </label>
                </div>
                <div className={styles.imageList}>
                  {currentPost.images.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <div className={styles.imageItemContent}>
                        <img 
                          src={image} 
                          alt={`Preview ${index}`}
                          className={styles.imageItemPreview}
                        />
                        <span className={styles.imageItemPath}>{image}</span>
                      </div>
                      <div className={styles.imageActions}>
                        <button onClick={() => insertImageInContent(image)}>Insert</button>
                        <button onClick={() => removeImage(image)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Main Content</label>
                <div className={styles.contentEditorTabs}>
                  <button 
                    className={styles.editorTab}
                    onClick={() => setContentEditMode('text')}
                    style={{ fontWeight: contentEditMode === 'text' ? 'bold' : 'normal' }}
                  >
                    Text Editor
                  </button>
                  <button 
                    className={styles.editorTab}
                    onClick={() => setContentEditMode('visual')}
                    style={{ fontWeight: contentEditMode === 'visual' ? 'bold' : 'normal' }}
                  >
                    Visual Editor
                  </button>
                </div>
                
                {contentEditMode === 'text' ? (
                  <textarea
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                    placeholder="Write your post content here..."
                    rows={15}
                  />
                ) : (
                  <div className={styles.visualEditor}>
                    <div className={styles.visualEditorHint}>
                      💡 Drag images to reposition them between paragraphs. Click "+ Insert Image Here" to add images at specific positions.
                    </div>
                    <div className={styles.visualContent}>
                      {renderVisualContent()}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button onClick={handleSave} className={styles.saveBtn}>
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                <button onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>

            {/* Posts List Section */}
            <div className={styles.postsSection}>
              <h2>Posts Management ({filteredPosts.length} posts)</h2>
              
              <div className={styles.filtersSection}>
                <div className={styles.filterRow}>
                  <div className={styles.filterGroup}>
                    <label>Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className={styles.searchInput}
                    />
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label>Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">All Categories</option>
                      {getUniqueCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label>Tag</label>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">All Tags</option>
                      {getUniqueTags().map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.filterRow}>
                  <div className={styles.filterGroup}>
                    <label>Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                      className={styles.filterSelect}
                    >
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label>Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className={styles.filterSelect}
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <button 
                      onClick={() => {
                        setSearchQuery('')
                        setFilterCategory('')
                        setFilterTag('')
                        setSortBy('date')
                        setSortOrder('desc')
                        setCurrentPostsPage(0)
                      }}
                      className={styles.clearFiltersBtn}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.postsList}>
                {paginatedPosts.map(post => (
                  <div key={post.id} className={styles.postItem}>
                    <div className={styles.postHeader}>
                      <h3>{post.title}</h3>
                      <div className={styles.postMeta}>
                        <span className={styles.category}>{post.category}</span>
                        <span className={styles.date}>{post.date}</span>
                      </div>
                    </div>
                    <p className={styles.postSubtitle}>{post.subtitle}</p>
                    <div className={styles.postTags}>
                      {post.tags.map(tag => (
                        <span key={tag} className={styles.tagSmall}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.postActions}>
                      <button onClick={() => previewPostContent(post)} className={styles.previewBtn}>
                        Preview
                      </button>
                      <button onClick={() => handleEdit(post)} className={styles.editBtn}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPostsPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={() => setCurrentPostsPage(Math.max(0, currentPostsPage - 1))}
                    disabled={currentPostsPage === 0}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPostsPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPostsPage(i)}
                        className={`${styles.pageNumber} ${i === currentPostsPage ? styles.activePage : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPostsPage(Math.min(totalPostsPages - 1, currentPostsPage + 1))}
                    disabled={currentPostsPage === totalPostsPages - 1}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div className={styles.postsSection}>
              <div className={styles.sectionHeader}>
                <h2>Projects ({projects.length} projects)</h2>
                <button onClick={resetProjectForm} className={styles.addBtn}>
                  + New Project
                </button>
              </div>

              {/* Project Form */}
              {(editingProjectId || currentProject.title) && (
                <div className={styles.postForm}>
                  <h3>{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
                  
                  <div className={styles.formRow}>
                    <input
                      type="text"
                      value={currentProject.title}
                      onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                      placeholder="Project Title"
                      className={styles.inlineInput}
                    />
                    <input
                      type="text"
                      value={currentProject.category}
                      onChange={(e) => setCurrentProject({...currentProject, category: e.target.value})}
                      placeholder="Category"
                      className={styles.inlineInput}
                    />
                  </div>

                  <input
                    type="text"
                    value={currentProject.subtitle}
                    onChange={(e) => setCurrentProject({...currentProject, subtitle: e.target.value})}
                    placeholder="Subtitle"
                    className={styles.input}
                  />

                  <textarea
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                    placeholder="Description"
                    rows={4}
                    className={styles.textarea}
                  />

                  <div className={styles.formRow}>
                    <select
                      value={currentProject.status}
                      onChange={(e) => setCurrentProject({...currentProject, status: e.target.value})}
                      className={styles.select}
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                    <select
                      value={currentProject.priority}
                      onChange={(e) => setCurrentProject({...currentProject, priority: e.target.value})}
                      className={styles.select}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.dateField}>
                      <label>Start Date:</label>
                      <input
                        type="date"
                        value={currentProject.startDate || ''}
                        onChange={(e) => setCurrentProject({...currentProject, startDate: e.target.value})}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.dateField}>
                      <label>End Date:</label>
                      <input
                        type="date"
                        value={currentProject.endDate || ''}
                        onChange={(e) => setCurrentProject({...currentProject, endDate: e.target.value})}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={currentProject.client}
                    onChange={(e) => setCurrentProject({...currentProject, client: e.target.value})}
                    placeholder="Client Name"
                    className={styles.input}
                  />

                  <input
                    type="text"
                    value={currentProject.coverImage}
                    onChange={(e) => setCurrentProject({...currentProject, coverImage: e.target.value})}
                    placeholder="Cover Image URL"
                    className={styles.input}
                  />

                  <div className={styles.tagSection}>
                    <label>Tags:</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newProjectTag}
                        onChange={(e) => setNewProjectTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectTag())}
                      />
                      <button onClick={addProjectTag} className={styles.smallBtn}>+</button>
                    </div>
                    <div className={styles.tagList}>
                      {currentProject.tags.map((tag: string) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                          <button onClick={() => removeProjectTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.tagSection}>
                    <label>Technologies:</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        placeholder="Add technology"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      />
                      <button onClick={addTechnology} className={styles.smallBtn}>+</button>
                    </div>
                    <div className={styles.tagList}>
                      {currentProject.technologies.map((tech: string) => (
                        <span key={tech} className={styles.tag}>
                          {tech}
                          <button onClick={() => removeTechnology(tech)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button onClick={handleSaveProject} className={styles.saveBtn}>
                      {editingProjectId ? 'Update Project' : 'Create Project'}
                    </button>
                    <button onClick={resetProjectForm} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    {editingProjectId && (
                      <button onClick={() => handleDeleteProject(editingProjectId)} className={styles.deleteBtn}>
                        Delete Project
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className={styles.postsList}>
                {projects.map(project => (
                  <div key={project.id} className={styles.postCard}>
                    {project.coverImage && (
                      <img src={project.coverImage} alt={project.title} className={styles.postCardImage} />
                    )}
                    <div className={styles.postCardContent}>
                      <h3>{project.title}</h3>
                      <p className={styles.postCardSubtitle}>{project.subtitle}</p>
                      <p className={styles.postCardMeta}>
                        {project.category} • {project.status} • {project.priority} priority
                      </p>
                      {project.startDate && (
                        <p className={styles.postCardDate}>
                          {new Date(project.startDate).toLocaleDateString()} 
                          {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                        </p>
                      )}
                      <div className={styles.postCardActions}>
                        <button onClick={() => handleEditProject(project)} className={styles.editBtn}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Collaborations Tab */}
        {activeTab === 'collaborations' && (
          <>
            <div className={styles.postsSection}>
              <div className={styles.sectionHeader}>
                <h2>Collaborations ({collaborations.length} collaborations)</h2>
                <button onClick={resetCollaborationForm} className={styles.addBtn}>
                  + New Collaboration
                </button>
              </div>

              {/* Collaboration Form */}
              {(editingCollaborationId || currentCollaboration.title) && (
                <div className={styles.postForm}>
                  <h3>{editingCollaborationId ? 'Edit Collaboration' : 'New Collaboration'}</h3>
                  
                  <div className={styles.formRow}>
                    <input
                      type="text"
                      value={currentCollaboration.title}
                      onChange={(e) => setCurrentCollaboration({...currentCollaboration, title: e.target.value})}
                      placeholder="Collaboration Title"
                      className={styles.inlineInput}
                    />
                    <select
                      value={currentCollaboration.type}
                      onChange={(e) => setCurrentCollaboration({...currentCollaboration, type: e.target.value})}
                      className={styles.select}
                    >
                      <option value="partnership">Partnership</option>
                      <option value="commission">Commission</option>
                      <option value="joint-project">Joint Project</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={currentCollaboration.subtitle}
                    onChange={(e) => setCurrentCollaboration({...currentCollaboration, subtitle: e.target.value})}
                    placeholder="Subtitle"
                    className={styles.input}
                  />

                  <textarea
                    value={currentCollaboration.description}
                    onChange={(e) => setCurrentCollaboration({...currentCollaboration, description: e.target.value})}
                    placeholder="Description"
                    rows={4}
                    className={styles.textarea}
                  />

                  <div className={styles.formRow}>
                    <select
                      value={currentCollaboration.status}
                      onChange={(e) => setCurrentCollaboration({...currentCollaboration, status: e.target.value})}
                      className={styles.select}
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="negotiating">Negotiating</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={currentCollaboration.priority}
                      onChange={(e) => setCurrentCollaboration({...currentCollaboration, priority: e.target.value})}
                      className={styles.select}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.dateField}>
                      <label>Start Date:</label>
                      <input
                        type="date"
                        value={currentCollaboration.startDate || ''}
                        onChange={(e) => setCurrentCollaboration({...currentCollaboration, startDate: e.target.value})}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.dateField}>
                      <label>End Date:</label>
                      <input
                        type="date"
                        value={currentCollaboration.endDate || ''}
                        onChange={(e) => setCurrentCollaboration({...currentCollaboration, endDate: e.target.value})}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <h4>Partner Information</h4>
                  <input
                    type="text"
                    value={currentCollaboration.partner.name}
                    onChange={(e) => setCurrentCollaboration({
                      ...currentCollaboration, 
                      partner: {...currentCollaboration.partner, name: e.target.value}
                    })}
                    placeholder="Partner Name"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={currentCollaboration.partner.contact}
                    onChange={(e) => setCurrentCollaboration({
                      ...currentCollaboration, 
                      partner: {...currentCollaboration.partner, contact: e.target.value}
                    })}
                    placeholder="Partner Contact"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={currentCollaboration.partner.website}
                    onChange={(e) => setCurrentCollaboration({
                      ...currentCollaboration, 
                      partner: {...currentCollaboration.partner, website: e.target.value}
                    })}
                    placeholder="Partner Website"
                    className={styles.input}
                  />

                  <input
                    type="text"
                    value={currentCollaboration.coverImage}
                    onChange={(e) => setCurrentCollaboration({...currentCollaboration, coverImage: e.target.value})}
                    placeholder="Cover Image URL"
                    className={styles.input}
                  />

                  <div className={styles.tagSection}>
                    <label>Tags:</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newCollaborationTag}
                        onChange={(e) => setNewCollaborationTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCollaborationTag())}
                      />
                      <button onClick={addCollaborationTag} className={styles.smallBtn}>+</button>
                    </div>
                    <div className={styles.tagList}>
                      {currentCollaboration.tags.map((tag: string) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                          <button onClick={() => removeCollaborationTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.tagSection}>
                    <label>Deliverables:</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        placeholder="Add deliverable"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                      />
                      <button onClick={addDeliverable} className={styles.smallBtn}>+</button>
                    </div>
                    <div className={styles.tagList}>
                      {currentCollaboration.deliverables.map((deliverable: string) => (
                        <span key={deliverable} className={styles.tag}>
                          {deliverable}
                          <button onClick={() => removeDeliverable(deliverable)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button onClick={handleSaveCollaboration} className={styles.saveBtn}>
                      {editingCollaborationId ? 'Update Collaboration' : 'Create Collaboration'}
                    </button>
                    <button onClick={resetCollaborationForm} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    {editingCollaborationId && (
                      <button onClick={() => handleDeleteCollaboration(editingCollaborationId)} className={styles.deleteBtn}>
                        Delete Collaboration
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Collaborations List */}
              <div className={styles.postsList}>
                {collaborations.map(collaboration => (
                  <div key={collaboration.id} className={styles.postCard}>
                    {collaboration.coverImage && (
                      <img src={collaboration.coverImage} alt={collaboration.title} className={styles.postCardImage} />
                    )}
                    <div className={styles.postCardContent}>
                      <h3>{collaboration.title}</h3>
                      <p className={styles.postCardSubtitle}>{collaboration.subtitle}</p>
                      <p className={styles.postCardMeta}>
                        {collaboration.type} • {collaboration.status} • {collaboration.priority} priority
                      </p>
                      {collaboration.partner && (
                        <p className={styles.postCardPartner}>Partner: {collaboration.partner.name}</p>
                      )}
                      {collaboration.startDate && (
                        <p className={styles.postCardDate}>
                          {new Date(collaboration.startDate).toLocaleDateString()} 
                          {collaboration.endDate && ` - ${new Date(collaboration.endDate).toLocaleDateString()}`}
                        </p>
                      )}
                      <div className={styles.postCardActions}>
                        <button onClick={() => handleEditCollaboration(collaboration)} className={styles.editBtn}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCollaboration(collaboration.id)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
