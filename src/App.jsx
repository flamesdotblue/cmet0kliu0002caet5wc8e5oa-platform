import { useState } from 'react'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] }
    }
  }
  return null
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [ended, setEnded] = useState(false)
  const [winningLine, setWinningLine] = useState([])
  const [score, setScore] = useState({ X: 0, O: 0 })

  const currentWinner = calculateWinner(board)
  const isDraw = !currentWinner && board.every(Boolean)

  function handleCellClick(index) {
    if (board[index] || ended) return

    const next = board.slice()
    next[index] = xIsNext ? 'X' : 'O'

    const win = calculateWinner(next)
    const draw = !win && next.every(Boolean)

    if (win) {
      setScore((s) => ({ ...s, [win.player]: s[win.player] + 1 }))
      setEnded(true)
      setWinningLine(win.line)
    } else if (draw) {
      setEnded(true)
      setWinningLine([])
    }

    setBoard(next)
    setXIsNext((v) => !v)
  }

  function newRound() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setEnded(false)
    setWinningLine([])
  }

  function resetAll() {
    newRound()
    setScore({ X: 0, O: 0 })
  }

  const status = currentWinner
    ? `Winner: ${currentWinner.player}`
    : isDraw
    ? 'Draw'
    : `Next: ${xIsNext ? 'X' : 'O'}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Tic Tac Toe</h1>
        <p className="text-center text-slate-600 mb-6">A minimal React + Tailwind implementation</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="text-sm text-slate-500">Score</div>
            <div className="flex gap-3 mt-1">
              <Badge active={!currentWinner && !isDraw && xIsNext} label="X" value={score.X} color="blue" />
              <Badge active={!currentWinner && !isDraw && !xIsNext} label="O" value={score.O} color="violet" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Status</div>
            <div className="mt-1 text-lg font-semibold">{status}</div>
          </div>
        </div>

        <Board
          squares={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
        />

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={newRound}
            className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
          >
            New round
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-[0.99]"
          >
            Reset all
          </button>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-500">
          Tip: Click any empty square to play. X always starts.
        </footer>
      </div>
    </div>
  )
}

function Board({ squares, onCellClick, winningLine }) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-lg shadow-inner">
      {squares.map((value, i) => {
        const isWinning = winningLine?.includes(i)
        return (
          <button
            key={i}
            onClick={() => onCellClick(i)}
            aria-label={`Cell ${i + 1}${value ? `, ${value}` : ''}`}
            className={[
              'h-24 w-24 md:h-28 md:w-28 flex items-center justify-center rounded-md font-extrabold text-4xl md:text-5xl',
              'select-none transition-colors border border-slate-300',
              value ? 'bg-white' : 'bg-slate-50 hover:bg-white',
              isWinning ? 'ring-2 ring-emerald-400 bg-emerald-50' : '',
            ].join(' ')}
          >
            <span className={value === 'X' ? 'text-blue-600' : 'text-violet-600'}>
              {value}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Badge({ label, value, color = 'blue', active = false }) {
  const colorMap = {
    blue: {
      dot: 'bg-blue-500',
      text: 'text-blue-700',
      pill: 'bg-blue-50',
      ring: 'ring-blue-300',
    },
    violet: {
      dot: 'bg-violet-500',
      text: 'text-violet-700',
      pill: 'bg-violet-50',
      ring: 'ring-violet-300',
    },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${c.pill} ${active ? `ring-2 ${c.ring}` : ''}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
      <span className={`text-sm font-semibold ${c.text}`}>{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
      {active && <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-500">turn</span>}
    </div>
  )
}
