'use client'

import styles from '../projects/page.module.css'

export default function Privacy() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Your Privacy Matters</p>
        <p className={styles.description}>
          Learn how we protect and handle your data.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
