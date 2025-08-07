import { useRef, useEffect, useState } from 'react'
import './App.css'
import { databases, DATABASE_ID, COLLECTION_ID, DOCUMENT_ID } from './appwrite'

function App() {
  const sprayInterval = useRef(null)
  const syncInterval = useRef(null)

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

    syncInterval.current = setInterval(() => {
      getGlobalClicks().then(setGlobalClicks)
    }, 1000)

    return () => clearInterval(syncInterval.current)
  }, [])

  const getGlobalClicks = async () => {
    try {
      const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, DOCUMENT_ID)
      return res.count || 0
    } catch (err) {
      console.error('Error fetching global clicks:', err)
      return 0
    }
  }

  const incrementGlobalClicks = async () => {
    try {
      const current = await getGlobalClicks()
      const res = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        DOCUMENT_ID,
        { count: current + 1 }
      )
      return res.count
    } catch (err) {
      console.error('Error updating global clicks:', err)
      return globalClicks
    }
  }

  const startSpray = () => {
    incrementClick()
    playSound()
    incrementGlobalClicks().then(setGlobalClicks)

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
        <span>My count: {clickCount}</span> &nbsp;&nbsp;
        <span>Global count: {globalClicks}</span>
      </div>

      <button
        className="spaghetti-button"
        onMouseDown={startSpray}
        onMouseUp={stopSpray}
        onMouseLeave={stopSpray}
      >
        🍝
      </button>

      {/* Bottom Left: Source Code */}
      <div className="source-link">
        <a
          href="https://github.com/reiyua/spaghetti.click"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </div>

      {/* Bottom Right: Copyright */}
      <div className="copyright">
        © <a
          href="https://reiyua.lol"
          target="_blank"
          rel="noopener noreferrer"
        >
          reiyua
        </a> 2025
      </div>
    </div>
  )
}

export default App
