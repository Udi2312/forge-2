import BoardList from './components/BoardList'
import BoardView from './components/BoardView'
import ErrorBanner from './components/ErrorBanner'
import { useKanban } from './store/KanbanContext'
import './App.css'

export default function App() {
  const { state, clearError } = useKanban()
  const { selectedBoard, error, loading } = state

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__brand">Kanban</h1>
        <span className="app__subtitle">Laravel + React</span>
        {(loading.action || loading.boards || loading.board) && (
          <span className="app__status" aria-live="polite">
            <span className="app__status-dot" />
            Working…
          </span>
        )}
      </header>

      <ErrorBanner message={error} onDismiss={clearError} />

      <main className="app__main">
        {selectedBoard ? <BoardView board={selectedBoard} /> : <BoardList />}
      </main>
    </div>
  )
}
