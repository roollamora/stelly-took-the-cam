'use client'

import { useEffect, useRef } from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (footerRef.current) {
        const x = e.clientX / window.innerWidth // 0 to 1
        const y = e.clientY / window.innerHeight // 0 to 1
        
        // Left logo: hue based on horizontal position, saturation based on vertical
        const leftHue = Math.floor(x * 360)
        const leftSaturation = 0.5 + (y * 0.5) // 50% to 100%
        const leftBrightness = 1
        
        // Right logo: hue based on vertical position, saturation based on horizontal
        const rightHue = Math.floor(y * 360)
        const rightSaturation = 0.5 + (x * 0.5) // 50% to 100%
        const rightBrightness = 1
        
        footerRef.current.style.setProperty('--left-hue', `${leftHue}deg`)
        footerRef.current.style.setProperty('--left-saturation', `${leftSaturation}`)
        footerRef.current.style.setProperty('--left-brightness', `${leftBrightness}`)
        
        footerRef.current.style.setProperty('--right-hue', `${rightHue}deg`)
        footerRef.current.style.setProperty('--right-saturation', `${rightSaturation}`)
        footerRef.current.style.setProperty('--right-brightness', `${rightBrightness}`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.logoLeft}></div>
      <div className={styles.logoRight}></div>
      
      <div className={styles.newsletter}>
        <input 
          type="email" 
          placeholder="Enter your email for newsletter" 
          className={styles.newsletterInput}
        />
        <button className={styles.newsletterButton}>Subscribe</button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>Work</h4>
          <ul>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/collaboration">Collaboration</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>About</h4>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>More</h4>
          <ul>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.separator}></div>
      
      <div className={styles.legal}>
        <a href="/privacy">Privacy Policy</a>
        <span className={styles.divider}>|</span>
        <a href="/terms">Terms and Conditions</a>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2024 STELLY TOOK THE CAM. All rights reserved.</p>
      </div>
    </footer>
  )
}