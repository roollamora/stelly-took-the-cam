'use client'

import styles from '../projects/page.module.css'

export default function FAQ() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>FAQ</h1>
        <p className={styles.subtitle}>Frequently Asked Questions</p>
        <p className={styles.description}>
          Find answers to common questions.
        </p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  )
}
