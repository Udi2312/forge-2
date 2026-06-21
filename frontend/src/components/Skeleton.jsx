export function Skeleton({ variant = 'text', width, height, style = {}, className = '' }) {
  const classes = ['skeleton', `skeleton--${variant}`, className].filter(Boolean).join(' ')
  return <span className={classes} style={{ width, height, ...style }} aria-hidden />
}

export function BoardListSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-board-list" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton--title" style={{ width: 160, marginBottom: 16 }} />
      <div className="skeleton-board">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-board__card">
            <div className="skeleton skeleton--title" style={{ width: '60%' }} />
            <div className="skeleton skeleton--text" style={{ width: '90%' }} />
            <div className="skeleton skeleton--text" style={{ width: '75%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BoardViewSkeleton({ columns = 3, cardsPerColumn = 3 }) {
  return (
    <div className="board-view" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton--title" style={{ width: 220, marginBottom: 24 }} />
      <div className="board-view__columns">
        {Array.from({ length: columns }).map((_, ci) => (
          <div key={ci} className="column">
            <div className="skeleton skeleton--title" style={{ width: '50%', marginBottom: 8 }} />
            {Array.from({ length: cardsPerColumn }).map((__, i) => (
              <div key={i} className="card" style={{ pointerEvents: 'none' }}>
                <div className="skeleton skeleton--title" style={{ width: '70%' }} />
                <div className="skeleton skeleton--text" style={{ width: '90%' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
