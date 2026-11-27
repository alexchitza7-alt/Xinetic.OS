import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator, FileText,
  Wifi, Battery, Volume2, Bell, X, Minus, Maximize2,
  Grid3X3, Trash2, Save, Pencil, FolderPlus, FilePlus,
  Moon, Sun, Check, Store, Globe, Calendar, Music,
  Image, Gamepad2, Download, Home, ChevronRight,
  Palette, HardDrive
} from 'lucide-react'
type AppId =
  | 'files' | 'settings' | 'terminal' | 'calculator' | 'notes'
  | 'monitor' | 'store' | 'browser' | 'calendar' | 'music'
  | 'photos' | 'games'

type AppInfo = {
  name: string
  icon: ComponentType<{ size?: number }>
  description: string
}

type WindowData = {
  id: number
  app: AppId
  x: number
  y: number
  minimized: boolean
  maximized: boolean
  z: number
}

type FileItem = {
  id: number
  name: string
  type: 'File' | 'Folder'
}

const info: Record<AppId, AppInfo> = {
  files: { name: 'Files', icon: Folder, description: 'Manage your files and folders' },
  settings: { name: 'Settings', icon: Settings, description: 'Customize Xinetic.OS' },
  terminal: { name: 'Terminal', icon: Terminal, description: 'Command interface' },
  calculator: { name: 'Calculator', icon: Calculator, description: 'Perform calculations' },
  notes: { name: 'Notes', icon: FileText, description: 'Write and save notes' },
  monitor: { name: 'System Monitor', icon: Monitor, description: 'System information' },
  store: { name: 'App Store', icon: Store, description: 'Discover and install apps' },
  browser: { name: 'Web Browser', icon: Globe, description: 'Visit websites' },
  calendar: { name: 'Calendar', icon: Calendar, description: 'Your calendar' },
  music: { name: 'Music Player', icon: Music, description: 'Play audio files' },
  photos: { name: 'Photo Gallery', icon: Image, description: 'View your pictures' },
  games: { name: 'Games', icon: Gamepad2, description: 'Play mini-games' }
}

const allApps: AppId[] = [
  'files', 'settings', 'terminal', 'calculator', 'notes', 'monitor',
  'store', 'browser', 'calendar', 'music', 'photos', 'games'
]

const coreApps: AppId[] = [
  'files', 'settings', 'terminal', 'calculator', 'notes', 'monitor', 'store'
]

const wallpapers: Record<string, string> = {
  Blue: 'linear-gradient(135deg,#dbeafe,#a5b4fc,#c4b5fd)',
  Purple: 'linear-gradient(135deg,#e9d5ff,#c4b5fd,#a5b4fc)',
  Green: 'linear-gradient(135deg,#dcfce7,#a7f3d0,#bfdbfe)',
  Pink: 'linear-gradient(135deg,#fce7f3,#fbcfe8,#ddd6fe)',
  Dark: 'linear-gradient(135deg,#111827,#334155,#312e81)'
}

const buttonStyle = {
  border: 'none',
  borderRadius: 10,
  padding: '9px 13px',
  cursor: 'pointer',
  background: '#e8eaff',
  color: '#34345a',
  fontWeight: 600
} as const
function XineticArcade() {
  const [game, setGame] = useState('home')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [target, setTarget] = useState(0)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [cards, setCards] = useState<number[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])

  const startMemory = () => {
    const deck = [1, 2, 3, 4, 1, 2, 3, 4]
      .sort(() => Math.random() - 0.5)
    setCards(deck)
    setFlipped([])
    setMatched([])
    setScore(0)
    setGame('memory')
  }

  const flipCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      if (cards[next[0]] === cards[next[1]]) {
        const newMatched = [...matched, ...next]
        setMatched(newMatched)
        setScore(newMatched.length / 2)
        if (newMatched.length === cards.length) {
          setMessage('You won!')
        }
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 700)
      }
    }
  }

  const startGuess = () => {
    setTarget(Math.floor(Math.random() * 10) + 1)
    setGuess('')
    setMessage('Guess a number from 1 to 10!')
    setGame('guess')
  }

  const checkGuess = () => {
    if (Number(guess) === target) {
      setMessage('Correct! You won!')
      setScore(score + 1)
      setBest(Math.max(best, score + 1))
    } else {
      setMessage(Number(guess) > target ? 'Too high! Try again.' : 'Too low! Try again.')
    }
  }

  const games = [
    { id: 'memory', name: 'Memory Match', icon: '🧠', description: 'Find matching pairs' },
    { id: 'guess', name: 'Number Challenge', icon: '🔢', description: 'Guess the hidden number' },
    { id: 'breaker', name: 'Brick Breaker', icon: '🧱', description: 'Arcade challenge' },
    { id: 'space', name: 'Space Shooter', icon: '🚀', description: 'Space arcade challenge' },
  ]

  const panelStyle = {
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(120,130,160,0.2)',
    borderRadius: 18,
    padding: 20,
    color: '#1e293b',
  }

  return (
    <div style={{ padding: 22, color: 'inherit', minHeight: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🎮 Xinetic Arcade</h1>
          <p style={{ opacity: 0.7 }}>Your games. Your scores. Your arcade.</p>
        </div>
        <div style={{ ...panelStyle, padding: 12 }}>
          🏆 Best: {best}
        </div>
      </div>

      {game === 'home' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
          {games.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setScore(0)
                setMessage('')
                if (item.id === 'memory') startMemory()
                else if (item.id === 'guess') startGuess()
                else setGame(item.id)
              }}
              style={{ ...panelStyle, cursor: 'pointer', textAlign: 'left', minHeight: 145 }}
            >
              <div style={{ fontSize: 34 }}>{item.icon}</div>
              <h3 style={{ marginBottom: 6 }}>{item.name}</h3>
              <p style={{ opacity: 0.65, margin: 0 }}>{item.description}</p>
              <p style={{ color: '#6366f1', fontWeight: 700 }}>PLAY →</p>
            </button>
          ))}
        </div>
      )}

      {game !== 'home' && (
        <div style={{ ...panelStyle, maxWidth: 520, margin: 'auto', textAlign: 'center' }}>
          <button onClick={() => setGame('home')} style={{ float: 'left', cursor: 'pointer' }}>
            ← Arcade
          </button>
          <div style={{ clear: 'both', paddingTop: 15 }} />

          {game === 'memory' && (
            <>
              <h2>🧠 Memory Match</h2>
              <p>Find all four matching pairs!</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {cards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => flipCard(index)}
                    style={{
                      height: 65,
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 25,
                      background: matched.includes(index) ? '#bbf7d0' : '#e0e7ff',
                    }}
                  >
                    {flipped.includes(index) || matched.includes(index) ? ['⭐', '🚀', '🎮', '💎'][card - 1] : '?'}
                  </button>
                ))}
              </div>
              <h3>Pairs: {score}/4</h3>
              {matched.length === cards.length && <h3>🏆 You won!</h3>}
            </>
          )}

          {game === 'guess' && (
            <>
              <h2>🔢 Number Challenge</h2>
              <p>{message}</p>
              <input
                type="number"
                min="1"
                max="10"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                style={{ padding: 12, borderRadius: 10, width: 100 }}
              />
              <button onClick={checkGuess} style={{ padding: 12, marginLeft: 8, borderRadius: 10 }}>
                Guess
              </button>
              <p>Score: {score}</p>
              <button onClick={startGuess}>New round</button>
            </>
          )}

          {game === 'breaker' && (
            <>
              <h2>🧱 Brick Breaker</h2>
              <p>Tap the paddle to break bricks and earn points!</p>
              <div style={{ fontSize: 45 }}>🧱 🧱 🧱</div>
              <div style={{ fontSize: 35 }}>⚽</div>
              <button onClick={() => {
                setScore(score + 1)
                setBest(Math.max(best, score + 1))
              }} style={{ padding: 14, borderRadius: 12 }}>
                Bounce the ball!
              </button>
              <h3>Score: {score}</h3>
            </>
          )}

          {game === 'space' && (
            <>
              <h2>🚀 Space Shooter</h2>
              <p>Tap the alien targets to score points!</p>
              <div style={{ fontSize: 65, padding: 20 }}>👾</div>
              <button onClick={() => {
                setScore(score + 1)
                setBest(Math.max(best, score + 1))
              }} style={{ padding: 14, borderRadius: 12 }}>
                🚀 Fire!
              </button>
              <h3>Score: {score}</h3>
            </>
          )}
        </div>
      )}
    </div>
  )
}
export default function App() {
  const [installed, setInstalled] = useState<AppId[]>(() => {
    try {
      const saved = localStorage.getItem('xinetic-installed')
      return saved ? [...new Set([...coreApps, ...JSON.parse(saved) as AppId[]])] : allApps
    } catch {
      return allApps
    }
  })

  const [windows, setWindows] = useState<WindowData[]>([])
  const [nextId, setNextId] = useState(1)
  const [topZ, setTopZ] = useState(10)
  const [wallpaper, setWallpaper] = useState('Blue')
  const [dark, setDark] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([
    'Welcome to Xinetic.OS!',
    'Your desktop is ready.'
  ])
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState(() => localStorage.getItem('xinetic-notes') || '')
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: 'Documents', type: 'Folder' },
    { id: 2, name: 'Pictures', type: 'Folder' },
    { id: 3, name: 'Welcome.txt', type: 'File' }
  ])
  const [terminalText, setTerminalText] = useState('Welcome to Xinetic Terminal!\nType help to see commands.')
  const [terminalCommand, setTerminalCommand] = useState('')
  const [calcValue, setCalcValue] = useState('')
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com')
  const [audioUrl, setAudioUrl] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const [dragging, setDragging] = useState<{
    id: number
    offsetX: number
    offsetY: number
  } | null>(null)

  useEffect(() => {
    localStorage.setItem('xinetic-installed', JSON.stringify(installed))
  }, [installed])

  useEffect(() => {
    localStorage.setItem('xinetic-notes', notes)
  }, [notes])

  useEffect(() => {
    if (!dragging) return

    const move = (event: PointerEvent) => {
      setWindows(current => current.map(w =>
        w.id === dragging.id && !w.maximized
          ? {
              ...w,
              x: Math.max(0, event.clientX - dragging.offsetX),
              y: Math.max(35, event.clientY - dragging.offsetY)
            }
          : w
      ))
    }

    const stop = () => setDragging(null)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
  }, [dragging])

  const notify = (message: string) => {
    setNotifications(old => [message, ...old].slice(0, 10))
  }

  const openApp = (app: AppId) => {
    if (!installed.includes(app)) {
      notify(`${info[app].name} is not installed.`)
      return
    }

    const existing = windows.find(w => w.app === app)
    if (existing) {
      setWindows(old => old.map(w =>
        w.id === existing.id
          ? { ...w, minimized: false, z: topZ + 1 }
          : w
      ))
      setTopZ(z => z + 1)
    } else {
      setWindows(old => [
        ...old,
        {
          id: nextId,
          app,
          x: 100 + (windows.length % 5) * 35,
          y: 75 + (windows.length % 5) * 30,
          minimized: false,
          maximized: false,
          z: topZ + 1
        }
      ])
      setNextId(id => id + 1)
      setTopZ(z => z + 1)
    }

    setStartOpen(false)
  }

  const closeWindow = (id: number) => {
    setWindows(old => old.filter(w => w.id !== id))
  }

  const minimizeWindow = (id: number) => {
    setWindows(old => old.map(w =>
      w.id === id ? { ...w, minimized: true } : w
    ))
  }

  const maximizeWindow = (id: number) => {
    setWindows(old => old.map(w =>
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ))
  }

  const installApp = (app: AppId) => {
    if (installed.includes(app)) {
      notify(`${info[app].name} is already installed.`)
      return
    }
    setInstalled(old => [...old, app])
    notify(`${info[app].name} installed! Added to desktop and dock.`)
  }

  const uninstallApp = (app: AppId) => {
    if (coreApps.includes(app)) {
      notify('Core system apps cannot be uninstalled.')
      return
    }
    setInstalled(old => old.filter(a => a !== app))
    setWindows(old => old.filter(w => w.app !== app))
    notify(`${info[app].name} uninstalled.`)
  }

  const runTerminal = () => {
    const command = terminalCommand.trim().toLowerCase()
    let output = ''

    if (command === 'help') output = 'Commands: help, about, date, apps, whoami, clear'
    else if (command === 'about') output = 'Xinetic.OS — Experimental desktop environment.'
    else if (command === 'date') output = new Date().toString()
    else if (command === 'apps') output = installed.map(a => info[a].name).join(', ')
    else if (command === 'whoami') output = 'Xinetic user'
    else if (command === 'clear') {
      setTerminalText('')
      setTerminalCommand('')
      return
    } else output = `Command not found: ${command}`

    setTerminalText(old => `${old}\n\n> ${terminalCommand}\n${output}`)
    setTerminalCommand('')
  }

  const calculate = (value: string) => {
    if (!/^[0-9+\-*/().% ]+$/.test(value)) {
      setCalcValue('Error')
      return
    }
    try {
      const result = Function(`"use strict"; return (${value})`)()
      setCalcValue(String(result))
    } catch {
      setCalcValue('Error')
    }
  }

  const addFile = (type: 'File' | 'Folder') => {
    const name = window.prompt(`Enter ${type.toLowerCase()} name:`)
    if (!name?.trim()) return
    setFiles(old => [...old, { id: Date.now(), name: name.trim(), type }])
    notify(`${type} created.`)
  }

  const renameFile = (id: number) => {
    const file = files.find(f => f.id === id)
    if (!file) return
    const name = window.prompt('Enter new name:', file.name)
    if (!name?.trim()) return
    setFiles(old => old.map(f => f.id === id ? { ...f, name: name.trim() } : f))
  }

  const deleteFile = (id: number) => {
    setFiles(old => old.filter(f => f.id !== id))
    notify('Item deleted.')
  }

  const visibleApps = installed.map(app => ({
    id: app,
    ...info[app]
  }))

  const renderContent = (app: AppId) => {
    switch (app) {
      case 'store':
        return (
          <div>
            <h2>Discover apps</h2>
            <p>Install apps and they'll appear on your desktop AND dock.</p>
            <div style={gridStyle}>
              {allApps.map(id => {
                const item = info[id]
                const Icon = item.icon
                const isInstalled = installed.includes(id)
                return (
                  <div key={id} style={appCardStyle}>
                    <Icon size={28} />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <button
                      style={buttonStyle}
                      onClick={() => isInstalled ? uninstallApp(id) : installApp(id)}
                    >
                      {isInstalled ? (coreApps.includes(id) ? 'Installed' : 'Uninstall') : <><Download size={14} /> Install</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'files':
        return (
          <div>
            <h2>My Files</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
              <button style={buttonStyle} onClick={() => addFile('Folder')}><FolderPlus size={15} /> New folder</button>
              <button style={buttonStyle} onClick={() => addFile('File')}><FilePlus size={15} /> New file</button>
            </div>
            {files.map(file => (
              <div key={file.id} style={fileRowStyle}>
                {file.type === 'Folder' ? <Folder /> : <FileText />}
                <span style={{ flex: 1 }}>{file.name}</span>
                <button style={smallButton} onClick={() => renameFile(file.id)}><Pencil size={15} /></button>
                <button style={smallButton} onClick={() => deleteFile(file.id)}><Trash2 size={15} /></button>
              </div>
            ))}
            <p style={muted}>Demo file manager: items are stored in this session.</p>
          </div>
        )

      case 'notes':
        return (
          <div>
            <h2>Notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              style={textareaStyle}
            />
            <p style={muted}><Save size={14} /> Notes save automatically in this browser.</p>
          </div>
        )

      case 'calculator':
        return (
          <div style={{ maxWidth: 340, margin: 'auto' }}>
            <h2>Calculator</h2>
            <input value={calcValue} onChange={e => setCalcValue(e.target.value)} style={calcInputStyle} placeholder="0" />
            <div style={calcGrid}>
              {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','%','+','(',')','C','='].map(key => (
                <button
                  key={key}
                  style={calcButtonStyle}
                  onClick={() => {
                    if (key === 'C') setCalcValue('')
                    else if (key === '=') calculate(calcValue)
                    else setCalcValue(old => old + key)
                  }}
                >{key}</button>
              ))}
            </div>
          </div>
        )

      case 'terminal':
        return (
          <div>
            <h2>Xinetic Terminal</h2>
            <pre style={terminalStyle}>{terminalText}</pre>
            <form onSubmit={e => { e.preventDefault(); runTerminal() }} style={{ display: 'flex', gap: 8 }}>
              <input value={terminalCommand} onChange={e => setTerminalCommand(e.target.value)} placeholder="Enter command..." style={textInputStyle} />
              <button style={buttonStyle}>Run</button>
            </form>
            <p style={muted}>This is a simulated terminal, not your computer's actual command line.</p>
          </div>
        )

      case 'settings':
        return (
          <div>
            <h2>Personalization</h2>
            <h3><Palette size={17} /> Wallpaper</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(wallpapers).map(([name, value]) => (
                <button key={name} onClick={() => setWallpaper(name)} style={{
                  ...buttonStyle,
                  background: value,
                  border: wallpaper === name ? '3px solid #6366f1' : '2px solid white',
                  width: 85,
                  height: 65
                }}>{wallpaper === name ? <Check /> : name}</button>
              ))}
            </div>
            <h3 style={{ marginTop: 25 }}>Appearance</h3>
            <button style={buttonStyle} onClick={() => setDark(v => !v)}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? ' Switch to light mode' : ' Switch to dark mode'}
            </button>
            <h3 style={{ marginTop: 25 }}>System</h3>
            <p>Xinetic.OS experimental desktop environment</p>
            <p>Version 1.0</p>
          </div>
        )

      case 'monitor':
        return (
          <div>
            <h2>System Monitor</h2>
            <div style={gridStyle}>
              <div style={appCardStyle}><Monitor /><h3>Platform</h3>{navigator.platform}</div>
              <div style={appCardStyle}><Globe /><h3>Browser</h3>{navigator.userAgent.split(' ').slice(-2).join(' ')}</div>
              <div style={appCardStyle}><Wifi /><h3>Connection</h3>{navigator.onLine ? 'Online' : 'Offline'}</div>
              <div style={appCardStyle}><HardDrive /><h3>Installed apps</h3>{installed.length}</div>
            </div>
            <p style={muted}>Browser-based information, not real hardware measurements.</p>
          </div>
        )

      case 'browser':
        return (
          <div>
            <h2>Web Browser</h2>
            <form onSubmit={e => {
              e.preventDefault()
              let url = browserUrl.trim()
              if (!/^https?:\/\//i.test(url)) url = 'https://' + url
              window.open(url, '_blank', 'noopener,noreferrer')
            }} style={{ display: 'flex', gap: 8 }}>
              <input value={browserUrl} onChange={e => setBrowserUrl(e.target.value)} style={textInputStyle} />
              <button style={buttonStyle}>Go</button>
            </form>
            <p style={muted}>Websites open in a new browser tab.</p>
          </div>
        )

      case 'calendar':
        return (
          <div>
            <h2>Calendar</h2>
            <h1>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h1>
            <h2>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <p>Welcome to your Xinetic calendar.</p>
            <input type="date" style={textInputStyle} />
          </div>
        )

      case 'music':
        return (
          <div>
            <h2>Music Player</h2>
            <p>Choose an audio file from your device.</p>
            <input type="file" accept="audio/*" onChange={e => {
              const file = e.target.files?.[0]
              if (file) setAudioUrl(URL.createObjectURL(file))
            }} />
            {audioUrl && <audio controls src={audioUrl} style={{ width: '100%', marginTop: 20 }} />}
          </div>
        )

      case 'photos':
        return (
          <div>
            <h2>Photo Gallery</h2>
            <p>Choose an image from your device.</p>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0]
              if (file) setPhotoUrl(URL.createObjectURL(file))
            }} />
            {photoUrl && <img src={photoUrl} alt="Selected photo" style={{ maxWidth: '100%', maxHeight: 350, marginTop: 20, borderRadius: 12 }} />}
          </div>
        )

       case 'games':
  return <XineticArcade />
  }
}
  const panel = dark ? '#202338' : 'rgba(255,255,255,0.94)'
  const textColor = dark ? '#f4f4ff' : '#252541'
  const muted = { color: dark ? '#b9bbd1' : '#77778c', fontSize: 12 }

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      background: wallpapers[wallpaper],
      color: textColor,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        button:hover { filter: brightness(.96); }
        input, textarea { font-family: inherit; }
      `}</style>

      <header style={{
        height: 42,
        background: dark ? '#171827' : 'rgba(255,255,255,.8)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
          <Grid3X3 size={19} color="#6366f1" /> Xinetic.OS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <Wifi size={16} /><Battery size={16} /><Volume2 size={16} />
          <span style={{ fontSize: 12 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button onClick={() => setNotificationsOpen(v => !v)} style={iconButton}>
            <Bell size={17} />
            {notifications.length > 0 && <span style={notificationDot} />}
          </button>
        </div>
      </header>

      <main style={{
        position: 'absolute',
        top: 55,
        bottom: 85,
        left: 15,
        right: 15,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 90px)',
        gridAutoRows: 100,
        gap: 12,
        alignContent: 'start',
        overflow: 'auto'
      }}>
        {visibleApps.map(item => {
          const Icon = item.icon
          return (
            <button key={item.id} onDoubleClick={() => openApp(item.id)} onClick={() => openApp(item.id)} style={desktopIcon}>
              <span style={desktopIconGraphic}><Icon size={27} /></span>
              <span>{item.name}</span>
            </button>
          )
        })}
      </main>

      {windows.map(w => {
        if (w.minimized) return null
        const Icon = info[w.app].icon
        return (
          <section key={w.id} onPointerDown={() => {
            setTopZ(z => z + 1)
            setWindows(old => old.map(item => item.id === w.id ? { ...item, z: topZ + 1 } : item))
          }} style={{
            position: 'absolute',
            left: w.maximized ? 5 : w.x,
            top: w.maximized ? 47 : w.y,
            width: w.maximized ? 'calc(100% - 10px)' : 'min(680px, calc(100% - 30px))',
            height: w.maximized ? 'calc(100% - 140px)' : 'min(510px, calc(100% - 150px))',
            minHeight: 250,
            background: panel,
            color: textColor,
            borderRadius: 15,
            boxShadow: '0 20px 60px rgba(25,25,65,.25)',
            border: '1px solid rgba(140,140,180,.25)',
            overflow: 'hidden',
            zIndex: w.z,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div
              onPointerDown={e => {
                if (w.maximized) return
                e.stopPropagation()
                setDragging({
                  id: w.id,
                  offsetX: e.clientX - w.x,
                  offsetY: e.clientY - w.y
                })
              }}
              style={{
                height: 44,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                background: dark ? '#292c43' : '#f2f2fb',
                cursor: 'grab',
                touchAction: 'none'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <Icon size={17} /> {info[w.app].name}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <button style={windowButton} onClick={() => minimizeWindow(w.id)}><Minus size={15} /></button>
                <button style={windowButton} onClick={() => maximizeWindow(w.id)}><Maximize2 size={14} /></button>
                <button style={{ ...windowButton, background: '#fee2e2', color: '#b91c1c' }} onClick={() => closeWindow(w.id)}><X size={15} /></button>
              </div>
            </div>
            <div style={{ padding: 20, overflow: 'auto', flex: 1 }}>
              {renderContent(w.app)}
            </div>
          </section>
        )
      })}

      {startOpen && (
        <div style={{
          position: 'absolute',
          bottom: 83,
          left: 15,
          width: 320,
          maxHeight: '70vh',
          overflow: 'auto',
          padding: 18,
          borderRadius: 18,
          background: panel,
          color: textColor,
          boxShadow: '0 15px 50px rgba(0,0,0,.2)',
          zIndex: 2000
        }}>
          <h2 style={{ marginTop: 0 }}>Xinetic Apps</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..." style={textInputStyle} />
          {visibleApps.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map(item => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => openApp(item.id)} style={startAppButton}>
                <Icon size={19} /> {item.name} <ChevronRight size={15} />
              </button>
            )
          })}
          <button onClick={() => openApp('store')} style={{ ...buttonStyle, width: '100%', marginTop: 10 }}>
            <Store size={16} /> Open App Store
          </button>
        </div>
      )}

      {notificationsOpen && (
        <div style={{
          position: 'absolute',
          right: 15,
          top: 50,
          width: 300,
          maxHeight: 400,
          overflow: 'auto',
          padding: 16,
          borderRadius: 16,
          background: panel,
          color: textColor,
          boxShadow: '0 15px 50px rgba(0,0,0,.2)',
          zIndex: 2001
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Notifications</h3>
            <button style={iconButton} onClick={() => setNotificationsOpen(false)}><X size={17} /></button>
          </div>
          {notifications.length === 0
            ? <p style={muted}>You're all caught up!</p>
            : notifications.map((n, i) => <p key={i} style={notificationCard}>{n}</p>)}
          <button style={buttonStyle} onClick={() => setNotifications([])}><Trash2 size={14} /> Clear all</button>
        </div>
      )}

      <footer style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        height: 62,
        maxWidth: 'calc(100% - 20px)',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 12px',
        borderRadius: 18,
        background: dark ? 'rgba(25,26,42,.9)' : 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 8px 30px rgba(25,25,65,.2)',
        zIndex: 1500,
        overflowX: 'auto'
      }}>
        <button onClick={() => setStartOpen(v => !v)} style={dockButton} title="Start menu">
          <Home size={22} color="#6366f1" />
        </button>
        {visibleApps.map(item => {
          const Icon = item.icon
          const isOpen = windows.some(w => w.app === item.id)
          return (
            <button key={item.id} onClick={() => openApp(item.id)} style={{
              ...dockButton,
              background: isOpen ? (dark ? '#41435d' : '#e4e6ff') : 'transparent'
            }} title={item.name}>
              <Icon size={22} />
              {isOpen && <span style={dockDot} />}
            </button>
          )
        })}
      </footer>
    </div>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
  gap: 12
} as const

const appCardStyle = {
  background: 'rgba(130,130,180,.09)',
  border: '1px solid rgba(130,130,180,.15)',
  borderRadius: 13,
  padding: 14,
  minWidth: 0
} as const

const fileRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: 10,
  borderBottom: '1px solid rgba(130,130,180,.2)'
} as const

const smallButton = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 6
} as const

const textareaStyle = {
  width: '100%',
  minHeight: 280,
  borderRadius: 12,
  padding: 14,
  border: '1px solid #d5d5e5',
  background: '#fff',
  color: '#252541',
  resize: 'vertical' as const
}

const textInputStyle = {
  flex: 1,
  minWidth: 0,
  padding: 11,
  borderRadius: 10,
  border: '1px solid #d5d5e5',
  background: '#fff',
  color: '#252541'
} as const

const calcInputStyle = {
  width: '100%',
  padding: 15,
  fontSize: 25,
  textAlign: 'right' as const,
  borderRadius: 10,
  border: '1px solid #d5d5e5',
  marginBottom: 10,
  color: '#252541',
  background: '#fff'
}

const calcGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gap: 7
} as const

const calcButtonStyle = {
  padding: 15,
  border: 'none',
  borderRadius: 9,
  background: '#e8eaff',
  color: '#34345a',
  cursor: 'pointer',
  fontSize: 17,
  fontWeight: 700
} as const

const terminalStyle = {
  background: '#171827',
  color: '#a7f3d0',
  padding: 14,
  borderRadius: 10,
  minHeight: 180,
  whiteSpace: 'pre-wrap' as const,
  overflow: 'auto'
}

const desktopIcon = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  background: 'transparent',
  border: 'none',
  color: '#252541',
  textShadow: '0 1px 3px rgba(255,255,255,.7)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  padding: 5
} as const

const desktopIconGraphic = {
  width: 55,
  height: 55,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 16,
  background: 'rgba(255,255,255,.8)',
  color: '#5659c9',
  boxShadow: '0 4px 12px rgba(40,40,80,.12)'
} as const

const dockButton = {
  width: 45,
  height: 45,
  flexShrink: 0,
  border: 'none',
  borderRadius: 12,
  background: 'transparent',
  color: '#5555a0',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  position: 'relative' as const
}

const dockDot = {
  position: 'absolute' as const,
  bottom: 2,
  width: 5,
  height: 5,
  borderRadius: '50%',
  background: '#6366f1'
}

const iconButton = {
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  padding: 5,
  position: 'relative' as const
}

const notificationDot = {
  position: 'absolute' as const,
  top: 2,
  right: 2,
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: '#ef4444'
}

const windowButton = {
  width: 27,
  height: 27,
  border: 'none',
  borderRadius: 8,
  background: '#e2e3f0',
  color: '#45455d',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer'
}

const startAppButton = {
  width: '100%',
  padding: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  border: 'none',
  borderRadius: 9,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'left' as const
}

const notificationCard = {
  padding: 11,
  borderRadius: 10,
  background: 'rgba(130,130,180,.12)',
  fontSize: 13
}
