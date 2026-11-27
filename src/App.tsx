import { useEffect, useState } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator, FileText,
  Wifi, Battery, Volume2, Bell, X, Minus, Maximize2,
  Grid3X3, Trash2, Save, Pencil, FolderPlus, FilePlus,
  Moon, Sun, Check, Store, Globe, Calendar, Music,
  Image, Gamepad2, Download, Play, Search
} from 'lucide-react'
type AppId =
  | 'files' | 'settings' | 'terminal' | 'calculator' | 'notes'
  | 'monitor' | 'store' | 'browser' | 'calendar' | 'music'
  | 'photos' | 'games'

type WindowData = {
  id: number
  app: AppId
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  z: number
}

type FileItem = {
  id: number
  name: string
  type: 'File' | 'Folder'
}

const info: Record<AppId, { name: string; icon: any; description: string }> = {
  files: { name: 'Files', icon: Folder, description: 'Manage files and folders' },
  settings: { name: 'Settings', icon: Settings, description: 'Customize your desktop' },
  terminal: { name: 'Terminal', icon: Terminal, description: 'Command interface' },
  calculator: { name: 'Calculator', icon: Calculator, description: 'Perform calculations' },
  notes: { name: 'Notes', icon: FileText, description: 'Write and save notes' },
  monitor: { name: 'System Monitor', icon: Monitor, description: 'System information' },
  store: { name: 'App Store', icon: Store, description: 'Discover new apps' },
  browser: { name: 'Web Browser', icon: Globe, description: 'Open websites' },
  calendar: { name: 'Calendar', icon: Calendar, description: 'View the calendar' },
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
  Light: 'linear-gradient(135deg,#f8fafc,#e2e8f0,#cbd5e1)'
}

export default function App() {
  const [windows, setWindows] = useState<WindowData[]>([])
  const [nextId, setNextId] = useState(1)
  const [installed, setInstalled] = useState<AppId[]>(() => {
    try {
      const saved = localStorage.getItem('xinetic-installed')
      return saved ? JSON.parse(saved) as AppId[] : coreApps
    } catch {
      return coreApps
    }
  })
  const [dark, setDark] = useState(false)
  const [wallpaper, setWallpaper] = useState('Blue')
  const [startOpen, setStartOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>(['Welcome to Xinetic.OS!'])
  const [storeSearch, setStoreSearch] = useState('')
  const [startSearch, setStartSearch] = useState('')
  const [note, setNote] = useState(() => localStorage.getItem('xinetic-note') || '')
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: 'Documents', type: 'Folder' },
    { id: 2, name: 'Pictures', type: 'Folder' },
    { id: 3, name: 'Welcome.txt', type: 'File' }
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    'Xinetic.OS Terminal',
    'Type help to see commands.'
  ])
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com')
  const [calc, setCalc] = useState('')
  const [renaming, setRenaming] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [gameNumber, setGameNumber] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    localStorage.setItem('xinetic-installed', JSON.stringify(installed))
  }, [installed])

  useEffect(() => {
    localStorage.setItem('xinetic-note', note)
  }, [note])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const notify = (message: string) => {
    setNotifications(previous => [message, ...previous].slice(0, 20))
  }

  const openApp = (app: AppId) => {
    if (!installed.includes(app)) {
      notify(`${info[app].name} is not installed. Visit the App Store.`)
      return
    }

    const existing = windows.find(w => w.app === app)
    if (existing) {
      setWindows(previous => previous.map(w =>
        w.id === existing.id
          ? { ...w, minimized: false, z: Date.now() }
          : w
      ))
    } else {
      const id = nextId
      setNextId(value => value + 1)
      setWindows(previous => [...previous, {
        id,
        app,
        x: 90 + (previous.length % 5) * 35,
        y: 55 + (previous.length % 5) * 25,
        width: app === 'store' ? 700 : 600,
        height: 430,
        minimized: false,
        maximized: false,
        z: Date.now()
      }])
    }
    setStartOpen(false)
    setStartSearch('')
  }

  const updateWindow = (id: number, changes: Partial<WindowData>) => {
    setWindows(previous => previous.map(w =>
      w.id === id ? { ...w, ...changes } : w
    ))
  }

  const installApp = (app: AppId) => {
    if (installed.includes(app)) return
    setInstalled(previous => [...previous, app])
    notify(`${info[app].name} installed successfully!`)
  }

  const uninstallApp = (app: AppId) => {
    if (coreApps.includes(app)) {
      notify('This is a core system app and cannot be uninstalled.')
      return
    }
    setInstalled(previous => previous.filter(a => a !== app))
    setWindows(previous => previous.filter(w => w.app !== app))
    notify(`${info[app].name} uninstalled.`)
  }

  const addFile = (type: 'File' | 'Folder') => {
    const name = window.prompt(`Enter ${type.toLowerCase()} name:`)
    if (!name?.trim()) return
    setFiles(previous => [...previous, {
      id: Date.now(),
      name: name.trim(),
      type
    }])
  }

  const runCommand = () => {
    const command = terminalInput.trim().toLowerCase()
    if (command === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    }

    let result = ''
    if (command === 'help') result = 'Commands: help, about, date, apps, whoami, clear'
    else if (command === 'about') result = 'Xinetic.OS — an experimental desktop environment.'
    else if (command === 'date') result = new Date().toString()
    else if (command === 'apps') result = installed.map(a => info[a].name).join(', ')
    else if (command === 'whoami') result = 'Xinetic user'
    else if (command) result = `Command not found: ${command}`

    setTerminalOutput(previous => [...previous, `> ${terminalInput}`, result])
    setTerminalInput('')
  }

  const bg = dark ? '#151923' : '#f8fafc'
  const panel = dark ? '#222938' : '#ffffff'
  const text = dark ? '#f1f5f9' : '#172033'
  const muted = dark ? '#aab5c5' : '#64748b'
  const border = dark ? '#394355' : '#e2e8f0'

  const buttonStyle = {
    border: `1px solid ${border}`,
    borderRadius: 10,
    padding: '9px 12px',
    background: panel,
    color: text,
    cursor: 'pointer' as const
  }

  const renderContent = (app: AppId) => {
    if (app === 'store') {
      const available = allApps.filter(a =>
        !coreApps.includes(a) &&
        info[a].name.toLowerCase().includes(storeSearch.toLowerCase())
      )

      return <div>
        <h2 style={{ marginTop: 0 }}>Discover apps</h2>
        <p style={{ color: muted }}>Find new apps for your Xinetic desktop.</p>
        <div style={{ position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: 12, top: 12, color: muted }} />
          <input
            value={storeSearch}
            onChange={e => setStoreSearch(e.target.value)}
            placeholder="Search apps..."
            style={{ width: '100%', boxSizing: 'border-box', padding: 12, paddingLeft: 38, borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14, marginTop: 18 }}>
          {available.map(a => {
            const Icon = info[a].icon
            const isInstalled = installed.includes(a)
            return <div key={a} style={{ border: `1px solid ${border}`, borderRadius: 16, padding: 16 }}>
              <Icon size={30} />
              <h3>{info[a].name}</h3>
              <p style={{ color: muted, fontSize: 13 }}>{info[a].description}</p>
              {isInstalled
                ? <button style={buttonStyle} onClick={() => uninstallApp(a)}>Uninstall</button>
                : <button style={{ ...buttonStyle, background: '#6366f1', color: 'white' }} onClick={() => installApp(a)}><Download size={14} /> Install</button>}
            </div>
          })}
        </div>
        {available.length === 0 && <p>No apps found.</p>}
      </div>
    }

    if (app === 'files') return <div>
      <h2>My Files</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        <button style={buttonStyle} onClick={() => addFile('Folder')}><FolderPlus size={16} /> New folder</button>
        <button style={buttonStyle} onClick={() => addFile('File')}><FilePlus size={16} /> New file</button>
      </div>
      {files.map(file => <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: `1px solid ${border}` }}>
        {file.type === 'Folder' ? <Folder /> : <FileText />}
        {renaming === file.id
          ? <input value={renameValue} onChange={e => setRenameValue(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
          : <span style={{ flex: 1 }}>{file.name}</span>}
        {renaming === file.id
          ? <button style={buttonStyle} onClick={() => {
            if (renameValue.trim()) setFiles(previous => previous.map(f => f.id === file.id ? { ...f, name: renameValue.trim() } : f))
            setRenaming(null)
          }}>Save</button>
          : <button title="Rename" style={buttonStyle} onClick={() => {
            setRenaming(file.id)
            setRenameValue(file.name)
          }}><Pencil size={15} /></button>}
        <button title="Delete" style={buttonStyle} onClick={() => setFiles(previous => previous.filter(f => f.id !== file.id))}><Trash2 size={15} /></button>
      </div>)}
      <p style={{ color: muted, fontSize: 12 }}>Demo file manager. These entries are simulated inside Xinetic.OS.</p>
    </div>

    if (app === 'notes') return <div>
      <h2>Notes</h2>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Write something..."
        style={{ width: '100%', height: 280, padding: 14, borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, resize: 'vertical', boxSizing: 'border-box' }}
      />
      <p style={{ color: muted }}><Save size={14} /> Your notes save automatically.</p>
    </div>

    if (app === 'calculator') return <div style={{ maxWidth: 340, margin: 'auto' }}>
      <h2>Calculator</h2>
      <input
        value={calc}
        onChange={e => setCalc(e.target.value)}
        placeholder="0"
        style={{ width: '100%', boxSizing: 'border-box', padding: 16, fontSize: 25, textAlign: 'right', borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
        {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','C','+'].map(key =>
          <button key={key} style={{ ...buttonStyle, padding: 18, fontSize: 18 }} onClick={() =>
            setCalc(value => key === 'C' ? '' : value + (key === '×' ? '*' : key === '÷' ? '/' : key))
          }>{key}</button>
        )}
        <button style={{ ...buttonStyle, gridColumn: 'span 4', background: '#6366f1', color: 'white', padding: 15 }} onClick={() => {
          try {
            if (!/^[0-9+\-*/().\s]+$/.test(calc)) throw new Error()
            const result = Function(`"use strict"; return (${calc})`)()
            if (!Number.isFinite(result)) throw new Error()
            setCalc(String(result))
          } catch {
            setCalc('Error')
          }
        }}>=</button>
      </div>
    </div>

    if (app === 'terminal') return <div style={{ background: '#101827', color: '#a7f3d0', padding: 16, borderRadius: 12, minHeight: 280, fontFamily: 'monospace' }}>
      {terminalOutput.map((line, index) => <div key={index}>{line}</div>)}
      <form onSubmit={e => { e.preventDefault(); runCommand() }} style={{ display: 'flex', marginTop: 12 }}>
        <span>&gt;&nbsp;</span>
        <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)} autoFocus style={{ flex: 1, background: 'transparent', border: 0, outline: 0, color: '#a7f3d0' }} />
      </form>
    </div>

    if (app === 'settings') return <div>
      <h2>Personalization</h2>
      <h3>Wallpaper</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {Object.entries(wallpapers).map(([name, value]) =>
          <button key={name} onClick={() => setWallpaper(name)} style={{ ...buttonStyle, width: 100, height: 65, background: value, color: '#172033' }}>
            {name === wallpaper && <Check />}
            {name}
          </button>
        )}
      </div>
      <h3>Appearance</h3>
      <button style={buttonStyle} onClick={() => setDark(value => !value)}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        Switch to {dark ? 'Light' : 'Dark'} mode
      </button>
    </div>

    if (app === 'monitor') return <div>
      <h2>System Monitor</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12 }}>
        {[
          ['Operating system', 'Xinetic.OS'],
          ['Environment', 'Browser'],
          ['Display', `${window.screen.width} × ${window.screen.height}`],
          ['Language', navigator.language],
          ['Online status', navigator.onLine ? 'Online' : 'Offline'],
          ['Installed apps', String(installed.length)]
        ].map(([label, value]) =>
          <div key={label} style={{ background: bg, borderRadius: 12, padding: 16 }}>
            <small style={{ color: muted }}>{label}</small>
            <h3>{value}</h3>
          </div>
        )}
      </div>
    </div>

    if (app === 'browser') return <div>
      <h2>Web Browser</h2>
      <form onSubmit={e => {
        e.preventDefault()
        const url = browserUrl.startsWith('http') ? browserUrl : `https://${browserUrl}`
        window.open(url, '_blank', 'noopener,noreferrer')
      }} style={{ display: 'flex', gap: 8 }}>
        <input value={browserUrl} onChange={e => setBrowserUrl(e.target.value)} style={{ flex: 1, minWidth: 0, padding: 12, borderRadius: 10, border: `1px solid ${border}`, background: bg, color: text }} />
        <button style={buttonStyle}><Globe size={16} /> Go</button>
      </form>
      <p style={{ color: muted }}>Websites open in a new browser tab.</p>
    </div>

    if (app === 'calendar') return <div>
      <h2>Calendar</h2>
      <h3>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: 12, borderRadius: 10, border: `1px solid ${border}`, background: bg, color: text }} />
      <p style={{ color: muted }}>Selected date: {selectedDate}</p>
    </div>

    if (app === 'music') return <div>
      <h2>Music Player</h2>
      <div style={{ textAlign: 'center', padding: 25 }}>
        <Music size={65} />
        <h3>Your music space</h3>
        <p style={{ color: muted }}>Choose an audio file from your computer.</p>
        <input type="file" accept="audio/*" onChange={e => {
          const file = e.target.files?.[0]
          const audio = document.getElementById('xinetic-audio') as HTMLAudioElement | null
          if (file && audio) {
            audio.src = URL.createObjectURL(file)
            audio.load()
          }
        }} />
        <audio id="xinetic-audio" controls style={{ display: 'block', width: '100%', marginTop: 22 }} />
      </div>
    </div>

    if (app === 'photos') return <div>
      <h2>Photo Gallery</h2>
      <p style={{ color: muted }}>Choose pictures from your computer to preview them.</p>
      <input type="file" accept="image/*" multiple onChange={e => {
        const gallery = document.getElementById('xinetic-gallery')
        if (!gallery) return
        gallery.replaceChildren()
        Array.from(e.target.files || []).forEach(file => {
          const image = document.createElement('img')
          image.src = URL.createObjectURL(file)
          image.alt = file.name
          image.style.width = '130px'
          image.style.height = '110px'
          image.style.objectFit = 'cover'
          image.style.borderRadius = '12px'
          gallery.appendChild(image)
        })
      }} />
      <div id="xinetic-gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }} />
    </div>

    if (app === 'games') return <div style={{ textAlign: 'center' }}>
      <h2>Mini Games</h2>
      <div style={{ background: bg, padding: 25, borderRadius: 18 }}>
        <Gamepad2 size={42} />
        <h3>Number Challenge</h3>
        <p>Generate a random number between 1 and 100.</p>
        <div style={{ fontSize: 65, fontWeight: 800, color: '#6366f1' }}>{gameNumber ?? '?'}</div>
        <button style={{ ...buttonStyle, background: '#6366f1', color: 'white' }} onClick={() => setGameNumber(Math.floor(Math.random() * 100) + 1)}>
          <Play size={16} /> Play
        </button>
      </div>
    </div>

    return null
  }

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: text,
      background: wallpapers[wallpaper],
      userSelect: 'none'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 20%,#ffffff55,transparent 45%)' }} />

      <div style={{ position: 'absolute', top: 18, left: 20, display: 'grid', gridTemplateColumns: 'repeat(2,90px)', gap: 16 }}>
        {installed.filter(a => a !== 'store').map(app => {
          const Icon = info[app].icon
          return <button
            key={app}
            onClick={() => openApp(app)}
            title={`Open ${info[app].name}`}
            style={{ background: 'transparent', border: 0, color: '#253047', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: 9 }}
          >
            <span style={{ width: 48, height: 48, borderRadius: 15, background: '#ffffffdd', display: 'grid', placeItems: 'center', boxShadow: '0 5px 15px #0002' }}>
              <Icon size={25} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, textShadow: '0 1px 5px #fff' }}>{info[app].name}</span>
          </button>
        })}
      </div>

      {windows.filter(w => !w.minimized).map(w => {
        const Icon = info[w.app].icon
        return <div
          key={w.id}
          onMouseDown={() => updateWindow(w.id, { z: Date.now() })}
          style={{
            position: 'absolute',
            left: w.maximized ? 8 : w.x,
            top: w.maximized ? 8 : w.y,
            width: w.maximized ? 'calc(100% - 16px)' : w.width,
            height: w.maximized ? 'calc(100% - 85px)' : w.height,
            minWidth: 300,
            minHeight: 220,
            background: panel,
            color: text,
            border: `1px solid ${border}`,
            borderRadius: 16,
            boxShadow: '0 20px 60px #0003',
            display: 'flex',
            flexDirection: 'column',
            zIndex: w.z,
            overflow: 'hidden'
          }}
        >
          <div onMouseDown={e => {
            if (w.maximized) return
            e.preventDefault()
            const startX = e.clientX
            const startY = e.clientY
            const startLeft = w.x
            const startTop = w.y
            const move = (event: MouseEvent) => updateWindow(w.id, {
              x: Math.max(0, startLeft + event.clientX - startX),
              y: Math.max(0, startTop + event.clientY - startY)
            })
            const stop = () => {
              window.removeEventListener('mousemove', move)
              window.removeEventListener('mouseup', stop)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', stop)
          }} style={{ height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderBottom: `1px solid ${border}`, cursor: 'grab' }}>
            <Icon size={18} />
            <b style={{ flex: 1, fontSize: 13 }}>{info[w.app].name}</b>
            <button title="Minimize" onClick={() => updateWindow(w.id, { minimized: true })} style={{ ...buttonStyle, padding: 6 }}><Minus size={15} /></button>
            <button title="Maximize or restore" onClick={() => updateWindow(w.id, { maximized: !w.maximized })} style={{ ...buttonStyle, padding: 6 }}><Maximize2 size={15} /></button>
            <button title="Close" onClick={() => setWindows(previous => previous.filter(item => item.id !== w.id))} style={{ ...buttonStyle, padding: 6 }}><X size={15} /></button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
            {renderContent(w.app)}
          </div>
          {!w.maximized && <div
            title="Resize window"
            onMouseDown={e => {
              e.preventDefault()
              e.stopPropagation()
              const startX = e.clientX
              const startY = e.clientY
              const startWidth = w.width
              const startHeight = w.height
              const move = (event: MouseEvent) => updateWindow(w.id, {
                width: Math.max(300, startWidth + event.clientX - startX),
                height: Math.max(220, startHeight + event.clientY - startY)
              })
              const stop = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', stop)
              }
              window.addEventListener('mousemove', move)
              window.addEventListener('mouseup', stop)
            }}
            style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'nwse-resize' }}
          />}
        </div>
      })}

      {startOpen && <div style={{ position: 'absolute', bottom: 78, left: '50%', transform: 'translateX(-50%)', width: 340, maxHeight: 480, overflow: 'auto', background: panel, color: text, border: `1px solid ${border}`, borderRadius: 20, padding: 18, boxShadow: '0 15px 50px #0003', zIndex: 9999 }}>
        <h2 style={{ marginTop: 0 }}>Xinetic.OS</h2>
        <input
          placeholder="Search installed apps..."
          value={startSearch}
          onChange={e => setStartSearch(e.target.value)}
          style={{ width: '100%', padding: 11, boxSizing: 'border-box', borderRadius: 10, border: `1px solid ${border}`, background: bg, color: text }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 18 }}>
          {installed.filter(a => info[a].name.toLowerCase().includes(startSearch.toLowerCase())).map(app => {
            const Icon = info[app].icon
            return <button key={app} onClick={() => openApp(app)} style={{ border: 0, background: 'transparent', color: text, cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Icon size={27} />
              <small>{info[app].name}</small>
            </button>
          })}
        </div>
        <button onClick={() => openApp('store')} style={{ ...buttonStyle, width: '100%', marginTop: 14 }}><Store size={16} /> Open App Store</button>
      </div>}

      {notificationsOpen && <div style={{ position: 'absolute', top: 55, right: 12, width: 300, maxHeight: 400, overflow: 'auto', background: panel, color: text, border: `1px solid ${border}`, borderRadius: 16, padding: 16, zIndex: 9999, boxShadow: '0 12px 35px #0003' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ flex: 1 }}>Notifications</h3>
          <button style={buttonStyle} onClick={() => setNotifications([])}><Trash2 size={15} /></button>
        </div>
        {notifications.length === 0
          ? <p style={{ color: muted }}>You're all caught up.</p>
          : notifications.map((message, index) => <p key={index} style={{ borderBottom: `1px solid ${border}`, paddingBottom: 10 }}>{message}</p>)}
      </div>}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: dark ? '#151923dd' : '#ffffffcc',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        zIndex: 10000
      }}>
        <button title="Start menu" onClick={() => setStartOpen(value => !value)} style={{ ...buttonStyle, background: '#6366f1', color: 'white', border: 0 }}><Grid3X3 size={21} /></button>
        {installed.filter(a => ['files', 'browser', 'store', 'notes', 'calculator', 'games'].includes(a)).map(app => {
          const Icon = info[app].icon
          return <button key={app} title={info[app].name} onClick={() => openApp(app)} style={{ ...buttonStyle, padding: 10 }}><Icon size={20} /></button>
        })}
        <div style={{ flex: 1 }} />
        <button title="Notifications" onClick={() => setNotificationsOpen(value => !value)} style={{ ...buttonStyle, padding: 9 }}><Bell size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingRight: 18, color: text, fontSize: 12 }}>
          <Wifi size={15} />
          <Battery size={15} />
          <Volume2 size={15} />
          <span>{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
