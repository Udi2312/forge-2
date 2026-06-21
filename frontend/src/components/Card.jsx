import Button from './Button'

function formatDueDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Card({ card, onEdit, onDelete, draggable = false, onDragStart, onDragEnd, isDragging = false }) {
  const dueLabel = formatDueDate(card.due_date)
  const overdue = isOverdue(card.due_date)

  return (
    <article
      className={`card ${overdue ? 'card--overdue' : ''} ${isDragging ? 'card--dragging' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
      aria-grabbed={isDragging || undefined}
    >
      {draggable ? (
        <span className="card__handle" aria-hidden title="Drag to move">
          ⋮⋮
        </span>
      ) : null}

      <header className="card__header">
        <h4 className="card__title">{card.title}</h4>
      </header>
      {card.description ? <p className="card__description">{card.description}</p> : null}
      {dueLabel ? (
        <div className={`card__due ${overdue ? 'card__due--overdue' : ''}`}>
          <span className="card__due-icon" aria-hidden>📅</span>
          <span>{overdue ? `Overdue · ${dueLabel}` : dueLabel}</span>
        </div>
      ) : null}
      <footer className="card__actions">
        <Button size="sm" variant="ghost" onClick={() => onEdit?.(card)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete?.(card)}>
          Delete
        </Button>
      </footer>
    </article>
  )
}

function isOverdue(iso) {
  if (!iso) return false
  return new Date(iso).getTime() < Date.now()
}
