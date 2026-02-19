'use client'

import styles from '../projects/page.module.css'

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.subtitle}>Our Story</p>
        <p className={styles.description}>
          Discover the story behind Stelly Took The Cam.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
