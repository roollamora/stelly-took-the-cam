'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../page.module.css'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [scrollY, setScrollY] = useState(0)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const coloredBarsRef = useRef<HTMLDivElement>(null)

  // Load specific blog post from API
  useEffect(() => {
    const loadPost = async () => {
      try {
        // Fetch specific post by slug
        const response = await fetch(`/api/blog/${slug}`)
        
        if (response.ok) {
          const dbPost = await response.json()
          
          // Convert to blog page format
          const convertedPost = {
            id: dbPost.id,
            title: dbPost.title,
            subtitle: dbPost.subtitle,
            content: dbPost.content,
            image: dbPost.coverImage || null,
            date: dbPost.publishedAt || dbPost.createdAt,
            category: dbPost.category,
            tags: dbPost.tags,
            slug: dbPost.slug
          }
          
          setBlogPosts([convertedPost])
          setExpandedPost(convertedPost.id) // Auto-expand the post
          console.log(`Loaded post: ${convertedPost.title}`)
        } else {
          setError('Post not found')
        }
      } catch (error) {
        console.error('Error loading post:', error)
        setError('Error loading post')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (slug) {
      loadPost()
    }
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        setScrollY(scrollPosition)
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

  const collapsePost = () => {
    // Navigate back to blog instead of collapsing
    window.location.href = '/blog'
  }

  const gradientPositionX = 50 + Math.cos(scrollY * 0.003) * 30
  const gradientPositionY = 50 + Math.sin(scrollY * 0.004) * 30
  const gradientPositionX2 = 30 + Math.cos(scrollY * 0.002 - Math.PI/2) * 50
  const gradientPositionY2 = 70 + Math.sin(scrollY * 0.0025 - Math.PI/2) * 40

  if (isLoading) {
    return (
      <div className={styles.blogPage}>
        <div className={styles.content}>
          <div className={styles.blogContainer}>
            <div className={styles.loading}>Loading post...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || blogPosts.length === 0) {
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
              <a href="/">Home</a>
              <a href="/gallery">Gallery</a>
              <a href="/blog">Blog</a>
              <a href="/admin" target="_blank">Admin</a>
              <a href="/projects">Projects</a>
              <a href="/collaboration">Collaboration</a>
              <a href="#contact">Contact</a>
              <a href="#about">About</a>
            </nav>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.blogContainer}>
            <div className={styles.errorContainer}>
              <h1 className={styles.errorTitle}>Post Not Found</h1>
              <p className={styles.errorMessage}>{error || 'The post you are looking for does not exist.'}</p>
              <Link href="/blog" className={styles.backToBlog}>← Back to Blog</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

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

      {/* Bottom title that appears when post is expanded */}
      {expandedPost !== null && (
        <h1 
          className={styles.bottomTitle}
          onClick={() => window.location.href = '/blog'}
        >
          PO&#xF455;ATOR LUMINIS
        </h1>
      )}

      {/* Main Content */}
      <div className={styles.content} style={{ padding: 0 }}>
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
          
          <div className={styles.postsContainer} style={{ paddingTop: 0 }}>
            {blogPosts.map((post, postIndex) => (
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
                    <h2 className={styles.postTitle}>{post.title}</h2>
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
                        {post.tags.map((tag: string, idx: number) => (
                          <Link key={idx} href={`/blog/tag/${encodeURIComponent(tag)}`} className={styles.postTag}>#{tag}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={styles.collapseBtn} onClick={collapsePost}>
                    Back to Blog
                  </span>
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
                    <h2 className={styles.postTitle}>{post.title}</h2>
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
                        {post.tags.map((tag: string, idx: number) => (
                          <Link key={idx} href={`/blog/tag/${encodeURIComponent(tag)}`} className={styles.postTag}>#{tag}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={styles.collapseBtn} onClick={collapsePost}>
                    Back to Blog
                  </span>
                </div>
              )}
            </article>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}