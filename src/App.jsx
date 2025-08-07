// src/App.jsx
import { useRef, useEffect, useState } from 'react'
import './App.css'
import { incrementGlobalClicks, getGlobalClicks } from './pocketbase'

function App() {
  const sprayInterval = useRef(null)
  const [clickCount, setClickCount] = useState(() => {
    const saved = localStorage.getItem('spaghettiClickCount')
    return saved ? parseInt(saved, 10) : 0
  })
  const [globalClicks, setGlobalClicks] = useState(0)

  useEffect(() => {
    localStorage.setItem('spaghettiClickCount', clickCount.toString())
  }, [clickCount])

  useEffect(() => {
    getGlobalClicks().then(setGlobalClicks)
  }, [])

  const startSpray = () => {
    incrementClick()
    incrementGlobalClicks().then(setGlobalClicks)
    playSound()

    sprayInterval.current = setInterval(() => {
      spawnOneEmoji()
      playSound()
      incrementClick()
      incrementGlobalClicks().then(setGlobalClicks)
    }, 100)
  }

  const stopSpray = () => {
    clearInterval(sprayInterval.current)
    sprayInterval.current = null
  }

  const incrementClick = () => {
    setClickCount(prev => prev + 1)
  }

  const playSound = () => {
    const audio = new Audio(import.meta.env.BASE_URL + 'spaghetti.mp3')
    audio.play()
  }

  const spawnOneEmoji = () => {
    const emoji = document.createElement('div')
    emoji.className = 'floaty-emoji'
    emoji.textContent = '🍝'

    const x = Math.random() * (window.innerWidth - 40) + 20
    const y = window.innerHeight - 60

    emoji.style.left = `${x}px`
    emoji.style.top = `${y}px`

    emoji.animate([
      { transform: 'translateY(0px)', opacity: 1 },
      { transform: 'translateY(-80px)', opacity: 0 }
    ], {
      duration: 2000,
      easing: 'ease-out',
      fill: 'forwards'
    })

    document.body.appendChild(emoji)
    setTimeout(() => emoji.remove(), 2200)
  }

  return (
    <div className="container">
      <div className="click-counter">
        <span>My: {clickCount}</span> &nbsp;&nbsp;
        <span>Global: {globalClicks}</span>
      </div>
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
