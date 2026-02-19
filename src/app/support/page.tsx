'use client'

import styles from '../projects/page.module.css'

export default function Support() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Support</h1>
        <p className={styles.subtitle}>We're Here to Help</p>
        <p className={styles.description}>
          Find answers and get support for your inquiries.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
