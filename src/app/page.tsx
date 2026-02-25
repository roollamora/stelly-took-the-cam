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
  const [showSecondFlash, setShowSecondFlash] = useState(false)

  useEffect(() => {
    // After 1.25 seconds, trigger the blackout
    const blackoutTimer = setTimeout(() => {
      setShowBlackout(true)
      
      // After 0.1s blackout, trigger the first flash (1.35s)
      setTimeout(() => {
        setShowBlackout(false)
        setShowFlash(true)
        
        // After first flash (0.1s), hide it (1.45s)
        setTimeout(() => {
          setShowFlash(false)
          
          // Wait 0.05s, then second flash (1.5s)
          setTimeout(() => {
            setShowSecondFlash(true)
            
            // After second flash (0.2s), hide loading screen (1.7s)
            setTimeout(() => {
              setIsLoading(false)
            }, 200)
          }, 50)
        }, 100)
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
      
      {isLoading && showSecondFlash && (
        <div className={styles.flashOverlay}>
        </div>
      )}
    </>
  )
}
