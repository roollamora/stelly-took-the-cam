'use client'

import styles from './page.module.css'

export default function FontTest() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const punctuation = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\`~'
  const special = '©®™€£¥§¶†‡•…‰′″‹›«»¡¿'
  
  // Private Use Area glyphs (like the one you're using)
  const privateUse = '\uF455\uF456\uF457\uF458\uF459\uF45A\uF45B\uF45C\uF45D\uF45E\uF45F'
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Protest Demo Font Character Test</h1>
      
      <div className={styles.section}>
        <h2>Uppercase Letters</h2>
        <p className={styles.testText}>{uppercase}</p>
      </div>
      
      <div className={styles.section}>
        <h2>Lowercase Letters</h2>
        <p className={styles.testText}>{lowercase}</p>
      </div>
      
      <div className={styles.section}>
        <h2>Numbers</h2>
        <p className={styles.testText}>{numbers}</p>
      </div>
      
      <div className={styles.section}>
        <h2>Punctuation & Symbols</h2>
        <p className={styles.testText}>{punctuation}</p>
      </div>
      
      <div className={styles.section}>
        <h2>Special Characters</h2>
        <p className={styles.testText}>{special}</p>
      </div>
      
      <div className={styles.section}>
        <h2>Private Use Area (Custom Glyphs)</h2>
        <p className={styles.testText}>{privateUse}</p>
        <p className={styles.codes}>
          F455 F456 F457 F458 F459 F45A F45B F45C F45D F45E F45F
        </p>
      </div>
      
      <div className={styles.section}>
        <h2>Sample Text</h2>
        <p className={styles.testText}>
          The Quick Brown Fox Jumps Over The Lazy Dog 1234567890
        </p>
      </div>
    </div>
  )
}
