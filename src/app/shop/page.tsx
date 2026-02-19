'use client'

import styles from '../projects/page.module.css'

export default function Shop() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Shop</h1>
        <p className={styles.subtitle}>Coming Soon</p>
        <p className={styles.description}>
          Browse our collection of prints and merchandise.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
