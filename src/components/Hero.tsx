'use client'

import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const text = "Stelly Took The Cam"
  const divaRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (divaRef.current) {
        const x = e.clientX / window.innerWidth
        const hue = Math.floor(x * 360)
        divaRef.current.style.setProperty('--hue-rotate', `${hue}deg`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <section className={styles.hero}>
      <div className={styles.logo}>
        <img src="/Artboard 1.png" alt="STTC Logo" />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.comingSoon}>
          {text.split('').map((char, index) => (
            <span 
              key={index} 
              className={styles.letter}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
        <div ref={divaRef} className={styles.diva}>
          D&nbsp;&nbsp;&nbsp;&nbsp;I&nbsp;&nbsp;&nbsp;&nbsp;V&nbsp;&nbsp;&nbsp;&nbsp;A
        </div>
      </div>
    </section>
  )
}