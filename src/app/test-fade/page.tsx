'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

export default function TestFade() {
  const [scrollY, setScrollY] = useState(0)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [titleShrink, setTitleShrink] = useState(false)
  const coloredBarsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        setScrollY(scrollPosition)
        
        // Shrink title when scrolled down more than 100px
        setTitleShrink(scrollPosition > 100)
      })
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
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Generate some dummy content for testing
  const dummyPosts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Test Post ${i + 1}`,
    subtitle: `Subtitle for test post ${i + 1}`,
    content: `This is the content for test post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
  }))

  const gradientPositionX = 50 + Math.cos(scrollY * 0.003) * 30
  const gradientPositionY = 50 + Math.sin(scrollY * 0.004) * 30
  const gradientPositionX2 = 30 + Math.cos(scrollY * 0.002 - Math.PI/2) * 50
  const gradientPositionY2 = 70 + Math.sin(scrollY * 0.0025 - Math.PI/2) * 40

  return (
    <div className={styles.testPage}>
      {/* Main Content */}
      <div className={styles.content}>
        {/* Duplicate background layer on top of posts - only shows gradient part */}
        {titleShrink && (
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
        
        {/* Page title outside container so it's on top */}
        <div className={`${styles.titleWrapper} ${titleShrink ? styles.shrinkWrapper : ''}`}>
          <h1 className={`${styles.pageTitle} ${titleShrink ? styles.shrink : ''}`}>
            TEST FADE EFFECT
          </h1>
        </div>
        
        <div className={styles.testContainer}>
          <div className={styles.postsContainer}>
            {dummyPosts.map((post) => (
              <article key={post.id} className={styles.testPost}>
                <div className={styles.postScrollContainer}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <div className={styles.subtitleLine}></div>
                  <h3 className={styles.postSubtitle}>{post.subtitle}</h3>
                  <div className={styles.postContentText}>
                    <p>{post.content}</p>
                    <p>{post.content}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}