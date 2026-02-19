'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SecondSection from '@/components/SecondSection'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showBlackout, setShowBlackout] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  useEffect(() => {
    // After 1.25 seconds (half of 2.5), trigger the blackout
    const blackoutTimer = setTimeout(() => {
      setShowBlackout(true)
      
      // After 0.1s blackout (half of 0.2s), trigger the flash
      setTimeout(() => {
        setShowBlackout(false)
        setShowFlash(true)
        
        // After flash animation (0.15s, half of 0.3s), hide loading screen
        setTimeout(() => {
          setIsLoading(false)
        }, 150)
      }, 100)
    }, 1250)

    return () => clearTimeout(blackoutTimer)
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <SecondSection />
      </main>
      <Footer />
      
      {isLoading && (
        <div className={`${styles.loadingOverlay} ${showBlackout ? styles.blackout : ''}`}>
        </div>
      )}
      
      {isLoading && showFlash && (
        <div className={styles.flashOverlay}>
        </div>
      )}
    </>
  )
}