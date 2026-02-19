# Gallery Transition Flow - Where to Look

## File Location
`light-site/src/app/gallery/page.tsx`

---

## 1. STATE VARIABLES (Lines ~14-22)
```typescript
const [currentPage, setCurrentPage] = useState(0)
const [nextPage, setNextPage] = useState<number | null>(null)
const [isTransitioning, setIsTransitioning] = useState(false)
const [direction, setDirection] = useState<'left' | 'right'>('right')
```

**What they control:**
- `currentPage`: Which page of items to show (0, 1, 2...)
- `nextPage`: The page we're transitioning TO (null when not transitioning)
- `isTransitioning`: Whether animation is currently running
- `direction`: Which way both grids move ('left' or 'right')

---

## 2. TRANSITION TRIGGER FUNCTION (Lines ~180-205)
```typescript
const changePage = (dir: 'prev' | 'next') => {
  if (isTransitioning) return
  
  let newPage: number
  let moveDirection: 'left' | 'right'
  
  if (dir === 'prev' && currentPage > 0) {
    newPage = currentPage - 1
    moveDirection = 'right' // Click left arrow -> move right
  } else if (dir === 'next' && currentPage < totalPages - 1) {
    newPage = currentPage + 1
    moveDirection = 'left' // Click right arrow -> move left
  } else {
    return
  }
  
  setDirection(moveDirection)
  setNextPage(newPage)
  
  // Start transition on next frame
  setTimeout(() => {
    setIsTransitioning(true)
  }, 10)
  
  // Complete transition
  setTimeout(() => {
    setCurrentPage(newPage)
    setNextPage(null)
    setIsTransitioning(false)
  }, 510)
}
```

**Timeline:**
- t=0ms: Set direction and nextPage
- t=10ms: Set isTransitioning=true (starts animation)
- t=510ms: Update currentPage, clear nextPage, set isTransitioning=false

---

## 3. CURRENT PAGE GRID (Lines ~290-330)
```typescript
<div 
  className={styles.gallery}
  style={{
    transform: isTransitioning 
      ? direction === 'left' 
        ? 'translateX(-25vw)'  // Click right: current moves left
        : 'translateX(25vw)'   // Click left: current moves right
      : 'translateX(0)',
    opacity: nextPage !== null && isTransitioning ? 0 : 1,
    transition: isTransitioning ? 'transform 0.5s ease, opacity 0.5s ease' : 'none',
    zIndex: 1,
    visibility: nextPage !== null && !isTransitioning ? 'hidden' : 'visible'
  }}
>
```

**What happens:**
- **Normal state**: position 0, opacity 1, visible
- **nextPage set (t=0ms)**: Still at position 0, opacity 1
- **isTransitioning true (t=10ms)**: Moves to ±25vw, opacity → 0 (500ms animation)
- **After transition (t=510ms)**: visibility: hidden (no animation)

---

## 4. NEXT PAGE GRID (Lines ~350-380)
```typescript
{nextPage !== null && (
  <div 
    className={styles.gallery}
    style={{
      transform: isTransitioning 
        ? 'translateX(0)'  // Animate to center
        : direction === 'left'
          ? 'translateX(25vw)'   // Click right: starts RIGHT, moves LEFT
          : 'translateX(-25vw)', // Click left: starts LEFT, moves RIGHT
      opacity: isTransitioning ? 1 : 0,
      transition: isTransitioning ? 'transform 0.5s ease, opacity 0.5s ease' : 'none',
      zIndex: 2
    }}
  >
```

**What happens:**
- **nextPage set (t=0ms)**: Renders at ±25vw, opacity 0, no transition
- **isTransitioning true (t=10ms)**: Moves to 0, opacity → 1 (500ms animation)
- **After transition (t=510ms)**: nextPage becomes null, grid removed from DOM

---

## 5. ARROW BUTTONS (Lines ~400-420)
```typescript
<button 
  className={`${styles.pageArrow} ${styles.pageArrowLeft}`}
  onClick={() => changePage('prev')}
  disabled={currentPage === 0 || isTransitioning}
>
  ◀
</button>
<button 
  className={`${styles.pageArrow} ${styles.pageArrowRight}`}
  onClick={() => changePage('next')}
  disabled={currentPage === totalPages - 1 || isTransitioning}
>
  ▶
</button>
```

**Disabled when:**
- At first/last page
- During transition (prevents double-clicks)

---

## VISUAL TIMELINE (Click RIGHT arrow)

```
t=0ms: Click RIGHT
├─ direction = 'left'
├─ nextPage = 1
├─ Current grid: position 0, opacity 1 ✓
└─ Next grid: renders at +25vw, opacity 0 ✓

t=10ms: isTransitioning = true
├─ Current grid: position 0 → -25vw, opacity 1 → 0 (animating)
└─ Next grid: position +25vw → 0, opacity 0 → 1 (animating)

t=10-510ms: BOTH GRIDS ANIMATING SIMULTANEOUSLY
├─ Current: sliding LEFT and fading OUT
└─ Next: sliding LEFT and fading IN

t=510ms: Cleanup
├─ currentPage = 1
├─ nextPage = null
├─ isTransitioning = false
├─ Current grid: visibility hidden (was showing old page 0)
└─ Next grid: removed from DOM
    └─ Current grid re-renders with page 1 data, becomes visible
```

---

## PROBLEM AREAS TO CHECK

### Issue: Double fade-in
**Location**: Lines 290-330 (Current grid)
**Check**: After t=510ms, does the grid fade in again?
**Cause**: When `currentPage` updates, React re-renders with new data

### Issue: Wrong direction
**Location**: Lines 350-380 (Next grid starting position)
**Check**: 
- Click RIGHT: Next should start at +25vw (right side)
- Click LEFT: Next should start at -25vw (left side)

### Issue: Not simultaneous
**Location**: Lines 180-205 (changePage function)
**Check**: 
- Is `setNextPage` called before `setIsTransitioning`?
- Is there enough delay (10ms) for browser to render starting position?

---

## CSS LOCATION
`light-site/src/app/gallery/page.module.css`

**Lines 151-190**: Gallery section and container
**Lines 191-227**: Gallery grid and items

---

## HOW TO DEBUG

1. **Add console.logs** in changePage function:
```typescript
console.log('t=0ms', { currentPage, nextPage, isTransitioning, direction })
setTimeout(() => {
  console.log('t=10ms', { isTransitioning })
}, 10)
setTimeout(() => {
  console.log('t=510ms', { currentPage, nextPage, isTransitioning })
}, 510)
```

2. **Check in browser DevTools**:
- Open Elements tab
- Find `.gallery` divs
- Watch their `style` attribute change during transition
- Should see TWO `.gallery` divs during transition

3. **Slow down animation** to see what's happening:
Change line ~295 and ~355:
```typescript
transition: isTransitioning ? 'transform 2s ease, opacity 2s ease' : 'none',
```
And line ~200:
```typescript
setTimeout(() => {
  setCurrentPage(newPage)
  setNextPage(null)
  setIsTransitioning(false)
}, 2010)  // Match animation duration + 10ms
```
