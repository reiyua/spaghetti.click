import { useRef } from 'react'
import './App.css'

function App() {
  const audio = new Audio(import.meta.env.BASE_URL + 'spaghetti.mp3')
  const sprayInterval = useRef(null)

  const startSpray = () => {
    audio.currentTime = 0
    audio.play()

    sprayInterval.current = setInterval(() => {
      spawnOneEmoji()
    }, 100) // slower for a relaxed feel
  }

  const stopSpray = () => {
    clearInterval(sprayInterval.current)
    sprayInterval.current = null
  }

  const spawnOneEmoji = () => {
    const emoji = document.createElement('div')
    emoji.className = 'floaty-emoji'
    emoji.textContent = '🍝'

    const startX = window.innerWidth / 2
    const startY = window.innerHeight - 60

    const offsetX = (Math.random() - 0.5) * 50
    const offsetY = -1 * (Math.random() * 50 + 100)

    emoji.style.left = `${startX}px`
    emoji.style.top = `${startY}px`

    emoji.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${offsetX}px, ${offsetY}px)`, opacity: 0 }
    ], {
      duration: 2000,
      easing: 'ease-out',
      fill: 'forwards'
    })

    document.body.appendChild(emoji)
    setTimeout(() => emoji.remove(), 2500)
  }

  return (
    <div className="container">
      <button
        className="spaghetti-button"
        onMouseDown={startSpray}
        onMouseUp={stopSpray}
        onMouseLeave={stopSpray}
      >
        🍝
      </button>
    </div>
  )
}

export default App
