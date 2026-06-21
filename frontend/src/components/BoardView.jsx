import { useState } from 'react'
import BoardFormModal from './BoardFormModal'
import Button from './Button'
import Column from './Column'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import Modal from './Modal'
import { BoardViewSkeleton } from './Skeleton'
import TextField from './TextField'
import { useDragDrop } from '../hooks/useDragDrop'
import { useKanban } from '../store/KanbanContext'

export default function BoardView({ board }) {
  const { actions, state } = useKanban()
  const [editing, setEditing] = useState(false)
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dragHandlers = useDragDrop({ onDrop: () => {} }) // actual drop logic lives in Column

  const columns = board.columns || []

  async function handleAddColumn(e) {
    e.preventDefault()
    if (!newColName.trim()) return
    try {
      await actions.createColumn(board.id, { name: newColName.trim() })
      setNewColName('')
      setAddingColumn(false)
    } catch {
      /* error already flashed */
    }
  }

  return (
    <div className="board-view">
      <header className="board-view__header">
        <Button variant="ghost" size="sm" onClick={() => actions.selectBoard(null)}>
          ← Back to boards
        </Button>
        <div className="board-view__title-row">
          <h1 className="board-view__title">{board.name}</h1>
          <div className="board-view__actions">
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Edit board
            </Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete board
            </Button>
          </div>
        </div>
        {board.description ? <p className="board-view__desc">{board.description}</p> : null}
      </header>

      {state.loading.board ? (
        <BoardViewSkeleton />
      ) : (
        <div className="board-view__columns">
          {columns.length === 0 ? (
            <EmptyState
              title="No columns yet"
              message="Add your first column to start tracking work."
              action={<Button onClick={() => setAddingColumn(true)}>+ Add column</Button>}
            />
          ) : (
            columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                dragHandlers={dragHandlers}
                isDragOver={dragHandlers.dragOverColumnId === col.id}
                isAnyDragActive={dragHandlers.draggingCardId != null}
              />
            ))
          )}

          <section className="column column--add">
            {addingColumn ? (
              <form onSubmit={handleAddColumn} className="form">
                <TextField
                  label="New column name"
                  name="name"
                  value={newColName}
                  onChange={setNewColName}
                  required
                  autoFocus
                />
                <div className="form__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setAddingColumn(false)
                      setNewColName('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" loading={state.loading.action}>
                    Create
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="ghost" onClick={() => setAddingColumn(true)}>
                + Add column
              </Button>
            )}
          </section>
        </div>
      )}

      <BoardFormModal
        open={editing}
        mode="edit"
        initial={board}
        onClose={() => setEditing(false)}
        onSubmit={async (payload) => {
          await actions.updateBoard(board.id, payload)
        }}
      />

      <Modal title="New column" open={addingColumn} onClose={() => setAddingColumn(false)}>
        <form onSubmit={handleAddColumn} className="form">
          <TextField
            label="Name"
            name="name"
            value={newColName}
            onChange={setNewColName}
            required
            autoFocus
          />
          <div className="form__actions">
            <Button variant="ghost" type="button" onClick={() => setAddingColumn(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={state.loading.action}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        title="Delete board?"
        message={`This will permanently delete "${board.name}" and all of its columns and cards.`}
        confirmLabel="Delete"
        danger
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setConfirmDelete(false)
          await actions.deleteBoard(board.id)
        }}
      />
    </div>
  )
}
