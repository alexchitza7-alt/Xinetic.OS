
import { useEffect, useState } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator, FileText,
  Search, Wifi, Battery, Volume2, Bell, X, Minus, Maximize2,
  Grid3X3, Sparkles, Home, Trash2, Save, Palette, HardDrive,
  Pencil, FolderPlus, FilePlus, Moon, Sun, Check, Clock,
  Store, Globe, Calendar, Music, Image, Gamepad2, Download,
  Play, Plus, ChevronRight, RotateCcw
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

const appInfo: Record<AppId, { name: string; icon: any; description: string }> = {
  files: { name: 'Files', icon: Folder, description: 'Manage your files and folders' },
  settings: { name: 'Settings', icon: Settings, description: 'Customize Xinetic.OS' },
  terminal: { name: 'Terminal', icon: Terminal, description: 'Command interface' },
  calculator: { name: 'Calculator', icon: Calculator, description: 'Perform calculations' },
  notes: { name: 'Notes', icon: FileText, description: 'Write and save notes' },
  monitor: { name: 'System Monitor', icon: Monitor, description: 'System information' },
  store: { name: 'App Store', icon: Store, description: 'Discover and install apps' },
  browser: { name: 'Web Browser', icon: Globe, description: 'Browse the internet' },
  calendar: { name: 'Calendar', icon: Calendar, description: 'View your calendar' },
  music: { name: 'Music Player', icon: Music, description: 'Your music space' },
  photos: { name: 'Photo Gallery', icon: Image, description: 'View your pictures' },
  games: { name: 'Games', icon: Gamepad2, description: 'Play mini-games' }
}

const allApps: AppId[] = [
  'files', 'settings', 'terminal', 'calculator', 'notes', 'monitor',
  'store', 'browser', 'calendar', 'music', 'photos', 'games'
]

const defaultInstalled: AppId[] = [
  'files', 'settings', 'terminal', 'calculator', 'notes', 'monitor', 'store'
]

export default function App() {
  const [windows, setWindows] = useState<WindowData[]>([])
  const [nextId, setNextId] = useState(1)
  const [installed, setInstalled] = useState<AppId[]>(() => {
    try {
      const saved = localStorage.getItem('xinetic-installed')
      return saved ? JSON.parse(saved) : defaultInstalled
    } catch {
      return defaultInstalled
    }
  })
  const [dark, setDark] = useState(false)
  const [wallpaper, setWallpaper] = useState('blue')
  const [startOpen, setStartOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(['Welcome to Xinetic.OS!'])
  const [storeSearch, setStoreSearch] = useState('')
  const [note, setNote] = useState(() => localStorage.getItem('xinetic-note') || '')
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: 'Documents', type: 'Folder' },
    { id: 2, name: 'Pictures', type: 'Folder' },
    { id: 3, name: 'Welcome.txt', type: 'File' }
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState(['Xinetic.OS Terminal', 'Type help to see commands.'])
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com')
  const [calc, setCalc] = useState('')
  const [renaming, setRenaming] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [gameNumber, setGameNumber] = useState(0)

  useEffect(() => {
    localStorage.setItem('xinetic-installed', JSON.stringify(installed))
  }, [installed])

  useEffect(() => {
    localStorage.setItem('xinetic-note', note)
  }, [note])

  const openApp = (app: AppId) => {
    if (!installed.includes(app)) {
      setNotifications(n => [...n, `${appInfo[app].name} is not installed.`])
      return
    }

    const existing = windows.find(w => w.app === app)
    if (existing) {
      setWindows(ws => ws.map(w => w.id === existing.id
        ? { ...w, minimized: false, z: Date.now() }
        : w))
    } else {
      const id = nextId
      setNextId(v => v + 1)
      setWindows(ws => [...ws, {
        id, app, x: 120 + (ws.length % 5) * 35,
        y: 75 + (ws.length % 5) * 30,
        width: app === 'store' ? 720 : 620,
        height: 440, minimized: false,
        maximized: false, z: Date.now()
      }])
    }
    setStartOpen(false)
  }

  const closeWindow = (id: number) =>
    setWindows(ws => ws.filter(w => w.id !== id))

  const updateWindow = (id: number, changes: Partial<WindowData>) =>
    setWindows(ws => ws.map(w => w.id === id ? { ...w, ...changes } : w))

  const installApp = (app: AppId) => {
    if (installed.includes(app)) return
    setInstalled(v => [...v, app])
    setNotifications(n => [...n, `${appInfo[app].name} installed successfully!`])
  }

  const uninstallApp = (app: AppId) => {
    if (defaultInstalled.includes(app)) {
      setNotifications(n => [...n, 'This is a core system app and cannot be uninstalled.'])
      return
    }
    setInstalled(v => v.filter(a => a !== app))
    setWindows(ws => ws.filter(w => w.app !== app))
    setNotifications(n => [...n, `${appInfo[app].name} uninstalled.`])
  }

  const addFile = (type: 'File' | 'Folder') => {
    const name = window.prompt(`Enter ${type.toLowerCase()} name:`)
    if (!name?.trim()) return
    setFiles(v => [...v, { id: Date.now(), name: name.trim(), type }])
  }

  const runCommand = () => {
    const command = terminalInput.trim().toLowerCase()
    let result = ''
    if (command === 'help') result = 'Commands: help, about, date, apps, whoami, clear'
    else if (command === 'about') result = 'Xinetic.OS — an experimental desktop environment.'
    else if (command === 'date') result = new Date().toString()
    else if (command === 'apps') result = installed.map(a => appInfo[a].name).join(', ')
    else if (command === 'whoami') result = 'Xinetic user'
    else if (command === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    } else if (command) result = `Command not found: ${command}`

    setTerminalOutput(v => [...v, `> ${terminalInput}`, result])
    setTerminalInput('')
  }

  const wallpapers: Record<string, string> = {
    blue: 'linear-gradient(135deg,#dbeafe,#a5b4fc,#c4b5fd)',
    purple: 'linear-gradient(135deg,#e9d5ff,#c4b5fd,#a5b4fc)',
    green: 'linear-gradient(135deg,#dcfce7,#a7f3d0,#bfdbfe)',
    pink: 'linear-gradient(135deg,#fce7f3,#fbcfe8,#ddd6fe)',
    light: 'linear-gradient(135deg,#f8fafc,#e2e8f0,#cbd5e1)'
  }

  const bg = dark ? '#151923' : '#f8fafc'
  const panel = dark ? '#222938' : '#ffffff'
  const text = dark ? '#f1f5f9' : '#172033'
  const muted = dark ? '#aab5c5' : '#64748b'
  const border = dark ? '#394355' : '#e2e8f0'
  const buttonStyle = {
    border: `1px solid ${border}`, borderRadius: 10,
    padding: '9px 12px', background: panel, color: text,
    cursor: 'pointer' as const
  }

  const renderContent = (app: AppId) => {
    if (app === 'store') {
      const available = allApps.filter(a =>
        !defaultInstalled.includes(a) &&
        appInfo[a].name.toLowerCase().includes(storeSearch.toLowerCase())
      )
      return <div>
        <h2 style={{ marginTop: 0 }}>Discover apps</h2>
        <p style={{ color: muted }}>Find new apps for your Xinetic desktop.</p>
        <input value={storeSearch} onChange={e => setStoreSearch(e.target.value)}
          placeholder="Search apps..." style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, boxSizing: 'border-box' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginTop: 18 }}>
          {available.map(a => {
            const Icon = appInfo[a].icon
            const isInstalled = installed.includes(a)
            return <div key={a} style={{ border: `1px solid ${border}`, borderRadius: 16, padding: 16 }}>
              <Icon size={30} />
              <h3>{appInfo[a].name}</h3>
              <p style={{ color: muted, fontSize: 13 }}>{appInfo[a].description}</p>
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button style={buttonStyle} onClick={() => addFile('Folder')}><FolderPlus size={16} /> New folder</button>
        <button style={buttonStyle} onClick={() => addFile('File')}><FilePlus size={16} /> New file</button>
      </div>
      {files.map(f => <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: `1px solid ${border}` }}>
        {f.type === 'Folder' ? <Folder /> : <FileText />}
        {renaming === f.id
          ? <input value={renameValue} onChange={e => setRenameValue(e.target.value)} />
          : <span style={{ flex: 1 }}>{f.name}</span>}
        {renaming === f.id
          ? <button style={buttonStyle} onClick={() => { setFiles(v => v.map(x => x.id === f.id ? { ...x, name: renameValue } : x)); setRenaming(null) }}>Save</button>
          : <button style={buttonStyle} onClick={() => { setRenaming(f.id); setRenameValue(f.name) }}><Pencil size={15} /></button>}
        <button style={buttonStyle} onClick={() => setFiles(v => v.filter(x => x.id !== f.id))}><Trash2 size={15} /></button>
      </div>)}
      <p style={{ color: muted, fontSize: 12 }}>Demo file manager: files are stored in this browser session.</p>
    </div>

    if (app === 'notes') return <div>
      <h2>Notes</h2>
      <textarea value={note} onChange={e => setNote(e.target.value)}
        placeholder="Write something..." style={{ width: '100%', height: 280, padding: 14, borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, resize: 'vertical', boxSizing: 'border-box' }} />
      <p style={{ color: muted }}><Save size={14} /> Your notes save automatically.</p>
    </div>

    if (app === 'calculator') return <div style={{ maxWidth: 340, margin: 'auto' }}>
      <h2>Calculator</h2>
      <input value={calc} onChange={e => setCalc(e.target.value)} placeholder="0"
        style={{ width: '100%', boxSizing: 'border-box', padding: 16, fontSize: 25, textAlign: 'right', borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
        {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','C','+'].map(k =>
          <button key={k} style={{ ...buttonStyle, padding: 18, fontSize: 18 }} onClick={() => setCalc(v => k === 'C' ? '' : v + (k === '×' ? '*' : k === '÷' ? '/' : k))}>{k}</button>
        )}
        <button style={{ ...buttonStyle, gridColumn: 'span 4', background: '#6366f1', color: 'white', padding: 15 }} onClick={() => {
          try {
            if (!/^[0-9+\-*/().\s]+$/.test(calc)) throw new Error()
            const result = Function(`"use strict"; return (${calc})`)()
            setCalc(String(result))
          } catch { setCalc('Error') }
        }}>=</button>
      </div>
    </div>

    if (app === 'terminal') return <div style={{ background: '#101827', color: '#a7f3d0', padding: 16, borderRadius: 12, minHeight: 280, fontFamily: 'monospace' }}>
      {terminalOutput.map((line, i) => <div key={i}>{line}</div>)}
      <form onSubmit={e => { e.preventDefault(); runCommand() }} style={{ display: 'flex', marginTop: 12 }}>
        <span>{'>'}&nbsp;</span>
        <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)} autoFocus
          style={{ flex: 1, background: 'transparent', border: 0, outline: 0, color: '#a7f3d0' }} />
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
      <button style={buttonStyle} onClick={() => setDark(v => !v)}>{dark ? <Sun size={16} /> : <Moon size={16} />} Switch to {dark ? 'Light' : 'Dark'} mode</button>
    </div>

    if (app === 'monitor') return <div>
      <h2>System Monitor</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {[['Operating system','Xinetic.OS'],['Environment','Browser'],['Display',`${window.screen.width} × ${window.screen.height}`],['Language',navigator.language],['Online status',navigator.onLine ? 'Online' : 'Offline'],['Installed apps',String(installed.length)]].map(([a,b]) =>
          <div key={a} style={{ background: bg, borderRadius: 12, padding: 16 }}><small style={{ color: muted }}>{a}</small><h3>{b}</h3></div>
        )}
      </div>
    </div>

    if (app === 'browser') return <div>
      <h2>Web Browser</h2>
      <form onSubmit={e => { e.preventDefault(); const url = browserUrl.startsWith('http') ? browserUrl : `https://${browserUrl}`; window.open(url, '_blank', 'noopener,noreferrer') }} style={{ display: 'flex', gap: 8 }}>
        <input value={browserUrl} onChange={e => setBrowserUrl(e.target.value)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${border}`, background: bg, color: text }} />
        <button style={buttonStyle}><Globe size={16} /> Go</button>
      </form>
      <p style={{ color: muted }}>Websites open in a new browser tab.</p>
    </div>

    if (app === 'calendar') return <div>
      <h2>Calendar</h2>
      <h1>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <b key={d} style={{ textAlign: 'center' }}>{d}</b>)}
        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }, (_,i) => <div key={`blank${i}`} />)}
        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate() }, (_,i) =>
          <div key={i} style={{ padding: 12, borderRadius: 9, background: i + 1 === new Date().getDate() ? '#6366f1' : bg, color: i + 1 === new Date().getDate() ? 'white' : text, textAlign: 'center' }}>{i+1}</div>
        )}
      </div>
    </div>

    if (app === 'music') return <div>
      <h2>Music Player</h2>
      <div style={{ textAlign: 'center', padding: 35 }}>
        <Music size={65} />
        <h3>Your music space</h3>
        <p style={{ color: muted }}>A place for your music collection.</p>
        <label style={{ ...buttonStyle, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Choose audio file
          <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]
            if (file) {
              const audio = document.getElementById('xinetic-audio') as HTMLAudioElement
              audio.src = URL.createObjectURL(file)
              audio.load()
            }
          }} />
        </label>
        <audio id="xinetic-audio" controls style={{ display: 'block', width: '100%', marginTop: 22 }} />
      </div>
    </div>

    if (app === 'photos') return <div>
      <h2>Photo Gallery</h2>
      <p style={{ color: muted }}>Choose pictures from your computer to preview them.</p>
      <input type="file" accept="image/*" multiple onChange={e => {
        const files = Array.from(e.target.files || [])
        const gallery = document.getElementById('xinetic-gallery')
        if (gallery) {
          gallery.innerHTML = ''
          files.forEach(file => {
            const img = document.createElement('img')
            img.src = URL.createObjectURL(file)
            img.style.width = '130px'
            img.style.height = '110px'
            img.style.objectFit = 'cover'
            img.style.borderRadius = '12px'
            gallery.appendChild(img)
          })
        }
      }} />
      <div id="xinetic-gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }} />
    </div>

    if (app === 'games') return <div style={{ textAlign: 'center' }}>
      <h2>Mini Games</h2>
      <div style={{ background: bg, padding: 25, borderRadius: 18 }}>
        <h3>Number Challenge</h3>
        <p>Click the button to generate a random number!</p>
        <div style={{ fontSize: 65, fontWeight: 800, color: '#6366f1' }}>{gameNumber || '?'}</div>
        <button style={{ ...buttonStyle, background: '#6366f1', color: 'white' }} onClick={() => setGameNumber(Math.floor(Math.random()*100)+1)}><Play size={16} /> Play</button>
      </div>
    </div>

    return null
  }

  return (
    <div style={{
      height: '100vh', width: '100%', overflow: 'hidden', position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif', color: text,
      background: wallpapers[wallpaper], userSelect: 'none'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 20%,#ffffff55,transparent 45%)' }} />

      <div style={{ position: 'absolute', top: 18, left: 20, display: 'grid', gridTemplateColumns: 'repeat(2,90px)', gap: 16 }}>
        {installed.filter(a => a !== 'store').slice(0, 10).map(a => {
          const Icon = appInfo[a].icon
          return <button key={a} onClick={() => openApp(a)} style={{ background: 'transparent', border: 0, color: '#253047', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: 9 }}>
            <span style={{ width: 48, height: 48, borderRadius: 15, background: '#ffffffcc', display: 'grid', placeItems: 'center', boxShadow: '0 5px 15px #0002' }}><Icon size={25} /></span>
            <span style={{ fontSize: 12, fontWeight: 600, textShadow: '0 1px 5px #fff' }}>{appInfo[a].name}</span>
          </button>
        })}
      </div>

      {windows.filter(w => !w.minimized).map(w => {
        const info = appInfo[w.app]
        const Icon = info.icon
        return <div key={w.id} onMouseDown={() => updateWindow(w.id, { z: Date.now() })}
          style={{
            position: 'absolute',
            left: w.maximized ? 8 : w.x,
            top: w.maximized ? 8 : w.y,
            width: w.maximized ? 'calc(100% - 16px)' : w.width,
            height: w.maximized ? 'calc(100% - 85px)' : w.height,
            minWidth: 300, minHeight: 220,
            background: panel, color: text, border: `1px solid ${border}`,
            borderRadius: 16, boxShadow: '0 20px 60px #0003',
            display: 'flex', flexDirection: 'column', zIndex: w.z,
            overflow: 'hidden'
          }}>
          <div onMouseDown={e => {
            if (w.maximized) return
            e.preventDefault()
            const startX = e.clientX, startY = e.clientY
            const startLeft = w.x, startTop = w.y
            const move = (ev: MouseEvent) => updateWindow(w.id, { x: startLeft + ev.clientX - startX, y: startTop + ev.clientY - startY })
            const stop = () => {
              window.removeEventListener('mousemove', move)
              window.removeEventListener('mouseup', stop)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', stop)
          }} style={{ height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderBottom: `1px solid ${border}`, cursor: 'grab' }}>
            <Icon size={18} />
            <b style={{ flex: 1, fontSize: 13 }}>{info.name}</b>
            <button title="Minimize" onClick={() => updateWindow(w.id, { minimized: true })} style={{ ...buttonStyle, padding: 6 }}><Minus size={15} /></button>
            <button title="Maximize / Restore" onClick={() => updateWindow(w.id, { maximized: !w.maximized })} style={{ ...buttonStyle, padding: 6 }}><Maximize2 size={15} /></button>
            <button title="Close" onClick={() => closeWindow(w.id)} style={{ ...buttonStyle, padding: 6 }}><X size={15} /></button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
            {renderContent(w.app)}
          </div>
          {!w.maximized && <div onMouseDown={e => {
            e.preventDefault()
            const sx = e.clientX, sy = e.clientY
            const sw = w.width, sh = w.height
            const move = (ev: MouseEvent) => updateWindow(w.id, { width: Math.max(300, sw + ev.clientX - sx), height: Math.max(220, sh + ev.clientY - sy) })
            const stop = () => {
              window.removeEventListener('mousemove', move)
              window.removeEventListener('mouseup', stop)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', stop)
          }} style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'nwse-resize' }} />}
        </div>
      })}

      {startOpen && <div style={{ position: 'absolute', bottom: 78, left: '50%', transform: 'translateX(-50%)', width: 340, maxHeight: 480, overflow: 'auto', background: panel, color: text, border: `1px solid ${border}`, borderRadius: 20, padding: 18, boxShadow: '0 15px 50px #0003', zIndex: 9999 }}>
        <h2 style={{ marginTop: 0 }}>Xinetic.OS</h2>
        <input placeholder="Search apps..." onChange={e => setStoreSearch(e.target.value)} style={{ width: '100%', padding: 11, boxSizing: 'border-box', borderRadius: 10, border: `1px solid ${border}`, background: bg, color: text }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 18 }}>
          {installed.filter(a => appInfo[a].name.toLowerCase().includes(storeSearch.toLowerCase())).map(a => {
            const Icon = appInfo[a].icon
            return <button key={a} onClick={() => openApp(a)} style={{ border: 0, background: 'transparent', color: text, cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Icon size={27} /><small>{appInfo[a].name}</small>
            </button>
          })}
        </div>
        <button onClick={() => openApp('store')} style={{ ...buttonStyle, width: '100%', marginTop: 14 }}><Store size={16} /> Open App Store</button>
      </div>}

      {notificationsOpen && <div style={{ position: 'absolute', top: 55, right: 12, width: 300, background: panel, color: text, border: `1px solid ${border}`, borderRadius: 16, padding: 16, zIndex: 9999, boxShadow: '0 12px 35px #0003' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><h3 style={{ flex: 1 }}>Notifications</h3><button style={buttonStyle} onClick={() => setNotifications([])}><Trash2 size={15} /></button></div>
        {notifications.length === 0 ? <p style={{ color: muted }}>You're all caught up.</p> : notifications.map((n,i) => <p key={i} style={{ borderBottom: `1px solid ${border}`, paddingBottom: 10 }}>{n}</p>)}
      </div>}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: dark ? '#151923dd' : '#ffffffcc', backdropFilter: 'blur(20px)', borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, zIndex: 10000 }}>
        <button onClick={() => setStartOpen(v => !v)} style={{ ...buttonStyle, background: '#6366f1', color: 'white', border: 0 }}><Grid3X3 size={21} /></button>
        {installed.filter(a => ['files','browser','store','notes','calculator','games'].includes(a)).map(a => {
          const Icon = appInfo[a].icon
          return <button key={a} title={appInfo[a].name} onClick={() => openApp(a)} style={{ ...buttonStyle, padding: 10 }}><Icon size={20} /></button>
        })}
        <div style={{ flex: 1 }} />
        <button onClick={() => setNotificationsOpen(v => !v)} style={{ ...buttonStyle, padding: 9 }}><Bell size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingRight: 18, color: dark ? text : '#334155', fontSize: 12 }}>
          <Wifi size={15} /><Battery size={15} /><Volume2 size={15} />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
