'use client'

import styles from '../projects/page.module.css'

export default function Contact() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.subtitle}>Get in Touch</p>
        <p className={styles.description}>
          Reach out to us for inquiries and collaborations.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
