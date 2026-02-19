'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show/hide header based on Y position
      if (e.clientY < 100) {
        setIsVisible(true)
      } else if (e.clientY > 150) {
        setIsVisible(false)
      }

      // Change colors based on cursor position
      if (headerRef.current) {
        const afterElement = headerRef.current
        const x = e.clientX / window.innerWidth // 0 to 1
        const y = e.clientY / window.innerHeight // 0 to 1
        
        // Calculate hue rotation based on distance from center (0-360 degrees)
        const centerX = 0.5
        const centerY = 0.5
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const hueRotate = Math.floor(distanceFromCenter * 360)
        
        // Calculate brightness (keep constant at 1)
        const brightness = 1
        
        // Calculate saturation based on vertical position (100% at top, 50% at bottom)
        const saturation = 1 - (y * 0.5) // 1 at top (y=0), 0.5 at bottom (y=1)
        
        afterElement.style.setProperty('--hue-rotate', `${hueRotate}deg`)
        afterElement.style.setProperty('--brightness', `${brightness}`)
        afterElement.style.setProperty('--saturation', `${saturation}`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <header ref={headerRef} className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.logo}>
        <img src="/sttc logo.png" alt="STTC Logo" className={styles.logoImage} />
        <Link href="/" style={{display: 'flex', gap: '0.5rem'}}>
          <span style={{color: '#000'}}>STELLY</span>
          <span style={{color: '#fff'}}>TOOK</span>
          <span style={{color: '#fff'}}>THE</span>
          <span style={{color: '#000'}}>CAM</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/gallery">Gallery</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/collaboration">Collaboration</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  )
}