'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [blobPosition, setBlobPosition] = useState({ x: 50, y: 50 })
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Thank you for subscribing!')
      setEmail('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const targetDate = new Date('2026-03-03T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const animateBlob = () => {
      const time = Date.now() * 0.0005
      setBlobPosition({
        x: 50 + Math.cos(time) * 15,
        y: 50 + Math.sin(time) * 15
      })
    }

    animateBlob()
    const interval = setInterval(animateBlob, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.countdownPage}>
      <div 
        className={styles.radialBars}
        style={{
          '--blob-x': `${blobPosition.x}%`,
          '--blob-y': `${blobPosition.y}%`,
          '--mouse-x': mousePosition.x,
          '--mouse-y': mousePosition.y
        } as React.CSSProperties}
      ></div>

      <div 
        className={styles.countdownBlob}
        style={{
          left: `${blobPosition.x}%`,
          top: `${blobPosition.y}%`
        }}
      >
        <div className={styles.countdownContent}>
          <div className={styles.dateTitle}>3.3.2026</div>
          <div className={styles.subtitle}>Grand Opening</div>
          <div className={styles.countdownGrid}>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{timeLeft.days}</div>
              <div className={styles.timeLabel}>days</div>
            </div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{timeLeft.hours}</div>
              <div className={styles.timeLabel}>hours</div>
            </div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{timeLeft.minutes}</div>
              <div className={styles.timeLabel}>minutes</div>
            </div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{timeLeft.seconds}</div>
              <div className={styles.timeLabel}>seconds</div>
            </div>
          </div>
          
          <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter Email for Newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.emailInput}
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className={styles.joinButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join!'}
            </button>
          </form>
          
          {message && <div className={styles.message}>{message}</div>}
        </div>
      </div>
    </div>
  )
}
