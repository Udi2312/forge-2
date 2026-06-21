import { useState } from 'react'
import BoardFormModal from './BoardFormModal'
import Button from './Button'
import EmptyState from './EmptyState'
import { BoardListSkeleton } from './Skeleton'
import { useKanban } from '../store/KanbanContext'

export default function BoardList() {
  const { state, actions } = useKanban()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null) // board being edited
  const [confirmDelete, setConfirmDelete] = useState(null) // board pending delete

  if (state.loading.boards) return <BoardListSkeleton />

  return (
    <div className="board-list">
      <header className="board-list__header">
        <h1 className="board-list__title">Boards</h1>
        <Button onClick={() => setCreating(true)}>+ New board</Button>
      </header>

      {state.boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          message="Create your first Kanban board to get started."
          action={<Button onClick={() => setCreating(true)}>+ New board</Button>}
        />
      ) : (
        <ul className="board-list__items">
          {state.boards.map((board) => (
            <li key={board.id} className="board-list__item">
              <button
                type="button"
                className="board-list__item-main"
                onClick={() => actions.selectBoard(board.id)}
              >
                <h3 className="board-list__item-name">{board.name}</h3>
                {board.description ? (
                  <p className="board-list__item-desc">{board.description}</p>
                ) : (
                  <p className="board-list__item-desc board-list__item-desc--muted">
                    No description.
                  </p>
                )}
              </button>
              <div className="board-list__item-actions">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(board)}
                  aria-label={`Edit board ${board.name}`}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setConfirmDelete(board)}
                  aria-label={`Delete board ${board.name}`}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <BoardFormModal
        open={creating}
        mode="create"
        onClose={() => setCreating(false)}
        onSubmit={async (payload) => {
          await actions.createBoard(payload)
        }}
      />

      <BoardFormModal
        open={!!editing}
        mode="edit"
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={async (payload) => {
          await actions.updateBoard(editing.id, payload)
        }}
      />

      {confirmDelete ? (
        <div className="modal__backdrop" onClick={() => setConfirmDelete(null)}>
          <div
            className="modal"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal__header">
              <h2 className="modal__title">Delete board?</h2>
            </header>
            <div className="modal__body">
              <p>
                This will permanently delete <strong>{confirmDelete.name}</strong> and all of its
                columns and cards.
              </p>
            </div>
            <footer className="modal__footer">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  const b = confirmDelete
                  setConfirmDelete(null)
                  await actions.deleteBoard(b.id)
                }}
              >
                Delete
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}
