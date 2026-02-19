'use client'

import styles from '../projects/page.module.css'

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.subtitle}>Legal Information</p>
        <p className={styles.description}>
          Read our terms of service and usage policies.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
