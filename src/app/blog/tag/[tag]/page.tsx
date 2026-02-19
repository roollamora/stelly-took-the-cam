'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../../page.module.css'

export default function BlogTagPage() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)
  const [scrollY, setScrollY] = useState(0)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [titleShrink, setTitleShrink] = useState(false)
  const coloredBarsRef = useRef<HTMLDivElement>(null)

  // Load blog posts with specific tag from API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Fetch from API with tag filter
        const response = await fetch(`/api/blog?tag=${encodeURIComponent(tag)}&status=published&sortBy=publishedAt&sortOrder=desc&limit=100`)
        
        if (response.ok) {
          const dbPosts = await response.json()
          
          // Convert to blog page format
          const convertedPosts = dbPosts.map((dbPost: any) => ({
            id: dbPost.id,
            title: dbPost.title,
            subtitle: dbPost.subtitle,
            content: dbPost.content,
            image: dbPost.coverImage || null,
            date: dbPost.publishedAt || dbPost.createdAt,
            category: dbPost.category,
            tags: dbPost.tags
          }))
          
          setBlogPosts(convertedPosts)
          console.log(`Loaded ${convertedPosts.length} posts with tag "${tag}" from database`)
        } else {
          console.error('Failed to fetch posts from API')
        }
      } catch (error) {
        console.error('Error loading posts:', error)
      }
    }
    
    if (tag) {
      loadPosts()
    }
  }, [tag])

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        setScrollY(scrollPosition)
        
        // Shrink title when scrolled down more than 100px
        setTitleShrink(scrollPosition > 100)
      })
    }

    const handleWheel = (e: WheelEvent) => {
      if (expandedPost !== null) {
        const target = e.target as Element
        const scrollContainer = target.closest('.postScrollContainer')
        
        if (scrollContainer) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainer as HTMLElement
          const isScrollingDown = e.deltaY > 0
          const isScrollingUp = e.deltaY < 0
          
          if ((isScrollingDown && scrollTop + clientHeight >= scrollHeight) ||
              (isScrollingUp && scrollTop <= 0)) {
            e.preventDefault()
          }
        } else {
          e.preventDefault()
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (coloredBarsRef.current) {
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight
        
        const centerX = 0.5
        const centerY = 0.5
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const hueRotate = Math.floor(distanceFromCenter * 360)
        const brightness = 1
        const saturation = 1 - (y * 0.5)
        
        coloredBarsRef.current.style.setProperty('--hue-rotate', `${hueRotate}deg`)
        coloredBarsRef.current.style.setProperty('--brightness', `${brightness}`)
        coloredBarsRef.current.style.setProperty('--saturation', `${saturation}`)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [expandedPost])

  // Function to process content with alternating image floats
  const processContentWithAlternatingFloats = (content: string, hasCoverImage: boolean, postIndex: number) => {
    // Start counting from cover image position if it exists
    let imageCount = hasCoverImage ? (postIndex % 2 === 0 ? 1 : 0) : 0
    
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
    return processedContent.replace(/<img([^>]*)>/g, (_, attributes) => {
      const floatDirection = imageCount % 2 === 0 ? 'left' : 'right'
      imageCount++
      return `<img${attributes} style="max-width: 300px; height: auto; float: ${floatDirection}; margin: 1rem ${floatDirection === 'left' ? '1rem 1rem 0' : '0 1rem 1rem'}; border-radius: 4px;" />`
    })
  }

  const postsPerPage = 10
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  const currentPosts = blogPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  )

  const expandPost = (postId: number) => {
    setExpandedPost(postId)
    document.body.style.overflow = 'hidden'
    
    // Smooth scroll to post after a brief delay to allow transition to start
    setTimeout(() => {
      const postElement = document.querySelector(`[data-post-id="${postId}"]`)
      if (postElement) {
        postElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        })
      }
    }, 100)
  }

  const collapsePost = () => {
    // Scroll the post content back to top before collapsing
    if (expandedPost !== null) {
      const postElement = document.querySelector(`[data-post-id="${expandedPost}"] .postScrollContainer`)
      if (postElement) {
        postElement.scrollTop = 0
      }
    }
    
    setExpandedPost(null)
    document.body.style.overflow = 'auto'
  }

  const changePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const gradientPositionX = 50 + Math.cos(scrollY * 0.003) * 30
  const gradientPositionY = 50 + Math.sin(scrollY * 0.004) * 30
  const gradientPositionX2 = 30 + Math.cos(scrollY * 0.002 - Math.PI/2) * 50
  const gradientPositionY2 = 70 + Math.sin(scrollY * 0.0025 - Math.PI/2) * 40

  return (
    <div className={styles.blogPage}>
      {/* New Left Menu - Rewritten from scratch */}
      <div 
        className={`${styles.newLeftMenu} ${isMenuVisible ? styles.newMenuVisible : ''}`}
        onMouseEnter={() => setIsMenuVisible(true)}
        onMouseLeave={() => setIsMenuVisible(false)}
      >
        <div className={styles.newColoredBars} ref={coloredBarsRef}></div>
        <div className={styles.newMenuContent}>
          <div className={styles.newLogo}>STTC</div>
          <nav className={styles.newNav}>
            <Link href="/">Home</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/admin" target="_blank">Admin</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/collaboration">Collaboration</Link>
            <Link href="#contact">Contact</Link>
            <Link href="#about">About</Link>
          </nav>
        </div>
      </div>

      {/* Page title outside content so it's on top */}
      <div className={`${styles.titleWrapper} ${titleShrink ? styles.shrinkWrapper : ''} ${expandedPost !== null ? styles.hiddenWrapper : ''}`}>
        <h1 className={`${styles.pageTitle} ${titleShrink ? styles.shrink : ''}`}>
          PO&#xF455;ATOR LUMINIS
        </h1>
      </div>

      {/* Bottom title that appears when post is expanded */}
      {expandedPost !== null && (
        <h1 
          className={styles.bottomTitle}
          onClick={() => setExpandedPost(null)}
        >
          PO&#xF455;ATOR LUMINIS
        </h1>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        {/* Duplicate background layer on top of posts - only shows gradient part */}
        {titleShrink && expandedPost === null && (
          <div 
            className={styles.fadeOverlay}
            style={{
              background: `
                radial-gradient(ellipse ${112 + Math.sin(scrollY * 0.0015) * 42}% ${84 + Math.cos(scrollY * 0.002) * 35}% at ${gradientPositionX2}% ${gradientPositionY2}%, 
                  rgba(0, 0, 0, 0) 0%, 
                  rgba(0, 0, 0, 0.1) 30%, 
                  rgba(0, 0, 0, 0.3) 60%, 
                  rgba(0, 0, 0, 0.6) 100%),
                radial-gradient(ellipse ${78 + Math.sin(scrollY * 0.002) * 26}% ${52 + Math.cos(scrollY * 0.003) * 19.5}% at ${gradientPositionX}% ${gradientPositionY}%, 
                  #d8d8d8 0%, 
                  #b8b8b8 30%, 
                  #808080 60%, 
                  #505050 100%)`
            }}
          ></div>
        )}
        
        <div 
          className={styles.backgroundLayer}
          style={{
            background: `
              radial-gradient(ellipse ${112 + Math.sin(scrollY * 0.0015) * 42}% ${84 + Math.cos(scrollY * 0.002) * 35}% at ${gradientPositionX2}% ${gradientPositionY2}%, 
                rgba(0, 0, 0, 0) 0%, 
                rgba(0, 0, 0, 0.1) 30%, 
                rgba(0, 0, 0, 0.3) 60%, 
                rgba(0, 0, 0, 0.6) 100%),
              radial-gradient(ellipse ${78 + Math.sin(scrollY * 0.002) * 26}% ${52 + Math.cos(scrollY * 0.003) * 19.5}% at ${gradientPositionX}% ${gradientPositionY}%, 
                #d8d8d8 0%, 
                #b8b8b8 30%, 
                #808080 60%, 
                #505050 100%)`
          }}
        ></div>
        
        <div className={styles.blogContainer}>
          
          {/* Tag Header */}
          <div className={styles.tagHeader}>
            <div className={styles.tagTitleLarge}>#{tag}</div>
            <p className={styles.tagCount}>{blogPosts.length} post{blogPosts.length !== 1 ? 's' : ''} found</p>
          </div>
          
          <div className={styles.postsContainer}>
            {blogPosts.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No posts found with the tag "{tag}"</p>
                <Link href="/blog" className={styles.backToBlog}>← Back to Blog</Link>
              </div>
            ) : (
              currentPosts.map((post, postIndex) => (
                <article 
                  key={post.id} 
                  className={`${styles.blogPost} ${expandedPost === post.id ? styles.expandedPost : ''}`}
                  data-post-id={post.id}
                >
                  {post.image ? (
                    <div className={styles.postWithImage}>
                      <div className={`${styles.postScrollContainer} postScrollContainer`}>
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className={styles.coverImage}
                          style={{
                            float: postIndex % 2 === 0 ? 'left' : 'right',
                            margin: postIndex % 2 === 0 ? '0 1rem 1rem 0' : '0 0 1rem 1rem'
                          }}
                        />
                        {post.date && post.category && (
                          <div className={styles.postMeta}>
                            <span className={styles.postDate}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className={styles.postMetaSeparator}>•</span>
                            <span className={styles.postCategory}>{post.category}</span>
                          </div>
                        )}
                        <Link href={`/blog/${post.slug || post.id}`} className={styles.postTitleLink}><h2 className={styles.postTitle}>{post.title}</h2></Link>
                        <div className={styles.subtitleLine}></div>
                        <h3 className={styles.postSubtitle}>{post.subtitle}</h3>
                        <div 
                          className={styles.postContentText}
                          dangerouslySetInnerHTML={{ 
                            __html: processContentWithAlternatingFloats(post.content, !!post.image, postIndex)
                          }}
                        />
                        {post.tags && post.tags.length > 0 && (
                          <div className={styles.postTags}>
                            {post.tags.map((postTag: string, idx: number) => (
                              <Link key={idx} href={`/blog/tag/${encodeURIComponent(postTag)}`} className={`${styles.postTag} ${postTag === tag ? styles.activeTag : ''}`}>#{postTag}</Link>
                            ))}
                          </div>
                        )}
                      </div>
                      {expandedPost !== post.id ? (
                        <div className={styles.readMoreContainer}>
                          <span className={styles.readMoreText} onClick={() => expandPost(post.id)}>
                            Read More
                          </span>
                        </div>
                      ) : (
                        <span className={styles.collapseBtn} onClick={collapsePost}>
                          Back to Blog
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={styles.postWithoutImage}>
                      <div className={`${styles.postScrollContainer} postScrollContainer`}>
                        {post.date && post.category && (
                          <div className={styles.postMeta}>
                            <span className={styles.postDate}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className={styles.postMetaSeparator}>•</span>
                            <span className={styles.postCategory}>{post.category}</span>
                          </div>
                        )}
                        <Link href={`/blog/${post.slug || post.id}`} className={styles.postTitleLink}><h2 className={styles.postTitle}>{post.title}</h2></Link>
                        <div className={styles.subtitleLine}></div>
                        <h3 className={styles.postSubtitle}>{post.subtitle}</h3>
                        <div 
                          className={styles.postContentText}
                          dangerouslySetInnerHTML={{ 
                            __html: processContentWithAlternatingFloats(post.content, !!post.image, postIndex)
                          }}
                        />
                        {post.tags && post.tags.length > 0 && (
                          <div className={styles.postTags}>
                            {post.tags.map((postTag: string, idx: number) => (
                              <Link key={idx} href={`/blog/tag/${encodeURIComponent(postTag)}`} className={`${styles.postTag} ${postTag === tag ? styles.activeTag : ''}`}>#{postTag}</Link>
                            ))}
                          </div>
                        )}
                      </div>
                      {expandedPost !== post.id ? (
                        <div className={styles.readMoreContainer}>
                          <span className={styles.readMoreText} onClick={() => expandPost(post.id)}>
                            Read More
                          </span>
                        </div>
                      ) : (
                        <span className={styles.collapseBtn} onClick={collapsePost}>
                          Back to Blog
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {blogPosts.length > 0 && (
            <div className={styles.pagination}>
              <button 
                className={styles.pageBtn}
                onClick={() => changePage('prev')}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageNumber} ${i === currentPage ? styles.activePage : ''}`}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className={styles.pageBtn}
                onClick={() => changePage('next')}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}