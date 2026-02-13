import styles from './ProgressLine.module.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

function ProgressLine({ items = [], activeIndex = 0, onPrev, onNext, onPointClick }) {
  if (items.length === 0) return null

  // При нечётном количестве предметов — показываем 3 точки (как было); при чётном — 2
  const visiblePoints = items.length % 2 === 1 ? 3 : 2
  const startIndex = Math.max(0, Math.min(activeIndex, items.length - visiblePoints))
  const visibleItems = items.slice(startIndex, startIndex + visiblePoints)
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < items.length - 1

  const handlePointClick = (globalIndex) => {
    if (onPointClick) onPointClick(globalIndex)
  }

  return (
    <div className={styles.progressLine}>
      <button
        type="button"
        className={styles.progressLineArrow}
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Предыдущий предмет"
      >
        <ArrowBackIosNewIcon />
      </button>

      <div className={styles.progressLineLine}>
        {visibleItems.map((point, i) => {
          const globalIndex = startIndex + i
          const isActive = globalIndex === activeIndex
          return (
            <div
              key={point.id ?? globalIndex}
              role="button"
              tabIndex={0}
              className={`${styles.progressLinePoint} ${isActive ? styles.progressLinePointActive : ''}`}
              onClick={() => handlePointClick(globalIndex)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePointClick(globalIndex)
                }
              }}
            >
              <div className={styles.progressLinePointContent}>
                <div className={styles.progressLineName}>
                  <span dangerouslySetInnerHTML={{ __html: point.name || '' }} />
                </div>
                <div
                  className={styles.progressLineLabel}
                  dangerouslySetInnerHTML={{ __html: point.label || point.title || '' }}
                />
              </div>
              <div className={styles.progressLineDot} />
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className={styles.progressLineArrow}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Следующий предмет"
      >
        <ArrowForwardIosIcon />
      </button>
    </div>
  )
}

export default ProgressLine
