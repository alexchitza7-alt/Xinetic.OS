
import { useEffect, useState } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator, FileText,
  Search, Wifi, Battery, Volume2, Power, Bell, Calendar,
  X, Minus, Maximize2, Grid3X3, Sparkles, ChevronRight,
  Home, Plus, Trash2, Save, Palette, HardDrive, Pencil,
  FilePlus, FolderPlus, Moon, Sun, RotateCcw, Check,
  Clock, Download, Image, Music, File, Menu, Grip
} from 'lucide-react'

type AppId = 'files' | 'settings' | 'terminal' | 'calculator' | 'notes' | 'monitor'

type WindowData = {
  id: number
  app: AppId
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  restore?: { x: number; y: number; width: number; height: number }
  z: number
}

type Interaction = {
  id: number
  mode: 'move' | 'resize'
  startX: number
  startY: number
  x: number
  y: number
  width: number
  height: number
}

type FileItem = {
  id: number
  name: string
  type: 'folder' | 'file'
  content?: string
}

const appInfo: Record<AppId, { name: string; icon: typeof Folder; color: string }> = {
  files: { name: 'Files', icon: Folder, color: '#4297e8' },
  settings: { name: 'Settings', icon: Settings, color: '#8794a8' },
  terminal: { name: 'Terminal', icon: Terminal, color: '#242b3a' },
  calculator: { name: 'Calculator', icon: Calculator, color: '#8b70e8' },
  notes: { name: 'Notes', icon: FileText, color: '#e5a83e' },
  monitor: { name: 'System Monitor', icon: Monitor, color: '#36b99a' }
}

function CalculatorApp() {
  const [display, setDisplay] = useState('0')

  const press = (value: string) => {
    if (value === 'AC') {
      setDisplay('0')
      return
    }
    if (value === '=') {
      try {
        if (!/^[0-9+\-*/.() ]+$/.test(display)) return
        const result = Function(`"use strict"; return (${display})`)()
        setDisplay(Number.isFinite(result) ? String(Number(result.toFixed(8))) : 'Error')
      } catch {
        setDisplay('Error')
      }
      return
    }
    setDisplay(display === '0' || display === 'Error' ? value : display + value)
  }

  return (
    <div className="calc-app">
      <div className="calc-display">{display}</div>
      <div className="calc-grid">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'AC', '0', '.', '+', '='].map(key => (
          <button key={key} className={key === '=' ? 'calc-equals' : key === 'AC' ? 'calc-clear' : 'calc-key'} onClick={() => press(key)}>
            {key === '*' ? '×' : key === '/' ? '÷' : key}
          </button>
        ))}
      </div>
    </div>
  )
}

function NotesApp() {
  const [note, setNote] = useState(() => localStorage.getItem('xinetic-note') || '')

  useEffect(() => {
    localStorage.setItem('xinetic-note', note)
  }, [note])

  return (
    <div className="notes-app">
      <div className="app-subtitle"><Save size={14} /> Automatically saved on this device</div>
      <textarea
        className="notes-editor"
        placeholder="Start writing your notes..."
        value={note}
        onChange={e => setNote(e.target.value)}
      />
    </div>
  )
}

function TerminalApp() {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([
    'Xinetic.OS Terminal [Version 2.0]',
    'Welcome! Type "help" to see available commands.'
  ])

  const runCommand = () => {
    const cmd = command.trim().toLowerCase()
    if (!cmd) return

    let result = ''
    switch (cmd) {
      case 'help':
        result = 'Available commands: help, about, date, apps, whoami, clear, version'
        break
      case 'about':
        result = 'Xinetic.OS is an experimental desktop environment.'
        break
      case 'date':
        result = new Date().toString()
        break
      case 'apps':
        result = 'Files | Settings | Terminal | Calculator | Notes | System Monitor'
        break
      case 'whoami':
        result = 'xinetic-user'
        break
      case 'version':
        result = 'Xinetic.OS version 2.0'
        break
      case 'clear':
        setHistory([])
        setCommand('')
        return
      default:
        result = `Command not found: ${cmd}. Type "help" for commands.`
    }

    setHistory(prev => [...prev, `> ${command}`, result])
    setCommand('')
  }

  return (
    <div className="terminal-app">
      <div className="terminal-history">
        {history.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <form className="terminal-input-row" onSubmit={e => { e.preventDefault(); runCommand() }}>
        <span>user@xinetic:~$</span>
        <input value={command} onChange={e => setCommand(e.target.value)} autoFocus />
      </form>
    </div>
  )
}

function FilesApp({ notify }: { notify: (message: string) => void }) {
  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const saved = localStorage.getItem('xinetic-files')
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Documents', type: 'folder' },
        { id: 2, name: 'Pictures', type: 'folder' },
        { id: 3, name: 'Downloads', type: 'folder' },
        { id: 4, name: 'Welcome.txt', type: 'file', content: 'Welcome to Xinetic.OS!' }
      ]
    } catch {
      return []
    }
  })
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('xinetic-files', JSON.stringify(files))
  }, [files])

  const createItem = (type: 'folder' | 'file') => {
    const name = window.prompt(`Enter ${type} name:`)
    if (!name?.trim()) return
    const item = { id: Date.now(), name: name.trim(), type, content: '' } as FileItem
    setFiles(prev => [...prev, item])
    notify(`${name} created successfully`)
  }

  const renameItem = () => {
    const item = files.find(file => file.id === selected)
    if (!item) return
    const name = window.prompt('Enter the new name:', item.name)
    if (!name?.trim()) return
    setFiles(prev => prev.map(file => file.id === selected ? { ...file, name: name.trim() } : file))
    notify('Item renamed')
  }

  const deleteItem = () => {
    if (selected === null) return
    const item = files.find(file => file.id === selected)
    if (!item || !window.confirm(`Delete "${item.name}"?`)) return
    setFiles(prev => prev.filter(file => file.id !== selected))
    setSelected(null)
    notify(`${item.name} deleted`)
  }

  return (
    <div className="files-app">
      <div className="files-toolbar">
        <button onClick={() => createItem('folder')}><FolderPlus size={16} /> New folder</button>
        <button onClick={() => createItem('file')}><FilePlus size={16} /> New file</button>
        <button disabled={selected === null} onClick={renameItem}><Pencil size={15} /> Rename</button>
        <button disabled={selected === null} onClick={deleteItem}><Trash2 size={15} /> Delete</button>
      </div>
      <div className="files-location"><Home size={15} /> Home <ChevronRight size={14} /> My Files</div>
      <div className="files-grid">
        {files.map(item => (
          <button
            key={item.id}
            className={`file-item ${selected === item.id ? 'file-selected' : ''}`}
            onClick={() => setSelected(item.id)}
            onDoubleClick={() => item.type === 'file' && window.alert(item.content || 'This file is empty.')}
          >
            {item.type === 'folder' ? <Folder size={35} fill="#6ba7ed" color="#468bd5" /> : <FileText size={35} color="#e0a43c" />}
            <span>{item.name}</span>
          </button>
        ))}
        {files.length === 0 && <p className="empty-files">This folder is empty. Create a new file or folder.</p>}
      </div>
      <div className="files-footer">{files.length} items · Stored in this browser</div>
    </div>
  )
}

function SettingsApp({
  wallpaper,
  setWallpaper,
  darkMode,
  setDarkMode,
  notify
}: {
  wallpaper: string
  setWallpaper: (value: string) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  notify: (message: string) => void
}) {
  const wallpapers = [
    { id: 'blue', name: 'Sky Blue', background: 'linear-gradient(135deg,#dcecff,#a7c9f3,#d9d9fa)' },
    { id: 'purple', name: 'Purple Dream', background: 'linear-gradient(135deg,#e7dcff,#b9a5f2,#d7d4ff)' },
    { id: 'green', name: 'Fresh Green', background: 'linear-gradient(135deg,#d5f5e7,#a4dfc6,#d6f0e9)' },
    { id: 'pink', name: 'Soft Pink', background: 'linear-gradient(135deg,#ffe0eb,#f3b9d2,#e5d5ff)' },
    { id: 'light', name: 'Classic Light', background: 'linear-gradient(135deg,#e9eef5,#cbd5e1,#e5e7eb)' }
  ]

  return (
    <div className="settings-app">
      <h3><Palette size={18} /> Personalization</h3>
      <p className="settings-description">Choose the look of your Xinetic.OS desktop.</p>
      <h4>Desktop wallpaper</h4>
      <div className="wallpaper-grid">
        {wallpapers.map(w => (
          <button key={w.id} className={`wallpaper-choice ${wallpaper === w.id ? 'wallpaper-active' : ''}`} onClick={() => { setWallpaper(w.id); notify(`${w.name} wallpaper applied`) }}>
            <span style={{ background: w.background }} />
            <small>{w.name}</small>
            {wallpaper === w.id && <Check size={15} />}
          </button>
        ))}
      </div>
      <div className="settings-divider" />
      <h4>Appearance</h4>
      <button className="theme-toggle" onClick={() => { setDarkMode(!darkMode); notify(`Switched to ${darkMode ? 'light' : 'dark'} mode`) }}>
        {darkMode ? <Moon size={19} /> : <Sun size={19} />}
        <span>{darkMode ? 'Dark mode' : 'Light mode'}</span>
        <span className="theme-switch">{darkMode ? 'ON' : 'OFF'}</span>
      </button>
      <p className="settings-description">Your preferences are saved automatically.</p>
    </div>
  )
}

function MonitorApp() {
  return (
    <div className="monitor-app">
      <div className="monitor-card"><Monitor /><div><small>Operating environment</small><strong>Xinetic.OS 2.0</strong></div></div>
      <div className="monitor-card"><HardDrive /><div><small>Storage</small><strong>Browser-based storage</strong></div></div>
      <div className="monitor-card"><Clock /><div><small>Current time</small><strong>{new Date().toLocaleTimeString()}</strong></div></div>
      <div className="monitor-card"><Wifi /><div><small>Connection</small><strong>{navigator.onLine ? 'Online' : 'Offline'}</strong></div></div>
      <div className="monitor-note">Xinetic.OS is currently running as a web desktop. Hardware statistics and access to your computer's real files are not available in this browser version.</div>
    </div>
  )
}

function AppContent({
  app,
  notify,
  wallpaper,
  setWallpaper,
  darkMode,
  setDarkMode
}: {
  app: AppId
  notify: (message: string) => void
  wallpaper: string
  setWallpaper: (value: string) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}) {
  switch (app) {
    case 'calculator': return <CalculatorApp />
    case 'notes': return <NotesApp />
    case 'terminal': return <TerminalApp />
    case 'files': return <FilesApp notify={notify} />
    case 'settings': return <SettingsApp wallpaper={wallpaper} setWallpaper={setWallpaper} darkMode={darkMode} setDarkMode={setDarkMode} notify={notify} />
    case 'monitor': return <MonitorApp />
  }
}

export default function App() {
  const [windows, setWindows] = useState<WindowData[]>([])
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [interaction, setInteraction] = useState<Interaction | null>(null)
  const [startOpen, setStartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>(['Welcome to Xinetic.OS 2.0!'])
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('xinetic-wallpaper') || 'blue')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('xinetic-dark') === 'true')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('xinetic-wallpaper', wallpaper)
  }, [wallpaper])

  useEffect(() => {
    localStorage.setItem('xinetic-dark', String(darkMode))
  }, [darkMode])

  const notify = (message: string) => {
    setNotifications(prev => [message, ...prev].slice(0, 20))
    setNotificationOpen(true)
  }

  const openApp = (app: AppId) => {
    const existing = windows.find(w => w.app === app)
    if (existing) {
      setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, minimized: false, z: Date.now() } : w))
      setActiveId(existing.id)
    } else {
      const id = nextId
      setNextId(prev => prev + 1)
      const width = app === 'files' ? 680 : app === 'settings' ? 620 : 540
      const height = app === 'files' ? 470 : 430
      setWindows(prev => [...prev, {
        id, app, x: 120 + (prev.length % 5) * 35,
        y: 90 + (prev.length % 5) * 30,
        width, height, minimized: false, maximized: false, z: Date.now()
      }])
      setActiveId(id)
    }
    setStartOpen(false)
    setNotificationOpen(false)
  }

  const closeWindow = (id: number) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    if (activeId === id) setActiveId(0)
  }

  const minimizeWindow = (id: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w))
  }

  const toggleMaximize = (id: number) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w
      if (w.maximized && w.restore) {
        return { ...w, ...w.restore, maximized: false, restore: undefined }
      }
      return {
        ...w,
        restore: { x: w.x, y: w.y, width: w.width, height: w.height },
        x: 10, y: 48,
        width: Math.max(350, window.innerWidth - 20),
        height: Math.max(250, window.innerHeight - 135),
        maximized: true
      }
    }))
    setActiveId(id)
  }

  const startInteraction = (e: React.PointerEvent, w: WindowData, mode: 'move' | 'resize') => {
    if (w.maximized) return
    e.preventDefault()
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setActiveId(w.id)
    setInteraction({
      id: w.id, mode,
      startX: e.clientX, startY: e.clientY,
      x: w.x, y: w.y, width: w.width, height: w.height
    })
  }

  const moveInteraction = (e: React.PointerEvent) => {
    if (!interaction) return
    const dx = e.clientX - interaction.startX
    const dy = e.clientY - interaction.startY
    setWindows(prev => prev.map(w => {
      if (w.id !== interaction.id) return w
      if (interaction.mode === 'move') {
        return { ...w, x: Math.max(0, interaction.x + dx), y: Math.max(42, interaction.y + dy) }
      }
      return { ...w, width: Math.max(340, interaction.width + dx), height: Math.max(250, interaction.height + dy) }
    }))
  }

  const endInteraction = () => setInteraction(null)

  const currentWallpaper: Record<string, string> = {
    blue: 'linear-gradient(135deg,#dcecff 0%,#b6d1f2 45%,#dcd9fa 100%)',
    purple: 'linear-gradient(135deg,#e7dcff 0%,#b9a5f2 50%,#d7d4ff 100%)',
    green: 'linear-gradient(135deg,#d5f5e7 0%,#a4dfc6 50%,#d6f0e9 100%)',
    pink: 'linear-gradient(135deg,#ffe0eb 0%,#f3b9d2 50%,#e5d5ff 100%)',
    light: 'linear-gradient(135deg,#e9eef5 0%,#cbd5e1 50%,#e5e7eb 100%)'
  }

  const visibleApps = (Object.keys(appInfo) as AppId[]).filter(app =>
    appInfo[app].name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={`xinetic-desktop ${darkMode ? 'dark-mode' : ''}`}
      style={{ background: currentWallpaper[wallpaper] || currentWallpaper.blue }}
      onPointerMove={moveInteraction}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      onClick={() => { if (startOpen) setStartOpen(false) }}
    >
      <style>{`
        *{box-sizing:border-box}
        .xinetic-desktop{position:fixed;inset:0;overflow:hidden;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#263247;user-select:none}
        .xinetic-topbar{height:40px;position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:rgba(255,255,255,.68);backdrop-filter:blur(22px);border-bottom:1px solid rgba(255,255,255,.6);z-index:500}
        .topbar-left,.topbar-right{display:flex;align-items:center;gap:16px;font-size:12px;font-weight:600}
        .topbar-brand{display:flex;align-items:center;gap:7px;font-weight:800;letter-spacing:-.3px}
        .brand-mark{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#5798ec,#9278e8);display:grid;place-items:center;color:white}
        .topbar-button{border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:6px;cursor:pointer;font:inherit}
        .desktop-icons{position:absolute;top:62px;left:18px;display:grid;grid-template-columns:82px;gap:15px;z-index:1}
        .desktop-icon{width:76px;min-height:75px;border:1px solid transparent;background:transparent;border-radius:12px;color:#28354b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-size:11px;text-shadow:0 1px 4px rgba(255,255,255,.8)}
        .desktop-icon:hover{background:rgba(255,255,255,.35);border-color:rgba(255,255,255,.45)}
        .desktop-icon svg{filter:drop-shadow(0 2px 3px rgba(40,60,90,.15))}
        .desktop-windows{position:absolute;inset:40px 0 78px;pointer-events:none}
        .xinetic-window{position:absolute;min-width:340px;min-height:250px;max-width:calc(100vw - 12px);max-height:calc(100vh - 125px);background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.85);border-radius:14px;box-shadow:0 18px 55px rgba(45,65,100,.2),0 3px 9px rgba(45,65,100,.08);overflow:hidden;display:flex;flex-direction:column;pointer-events:auto}
        .window-titlebar{height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 12px 0 16px;background:rgba(247,249,253,.96);border-bottom:1px solid #edf0f5;cursor:grab;touch-action:none}
        .window-titlebar:active{cursor:grabbing}
        .window-title{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700}
        .window-controls{display:flex;gap:7px}
        .window-control{width:27px;height:27px;border:0;border-radius:7px;background:transparent;color:#657187;display:grid;place-items:center;cursor:pointer}
        .window-control:hover{background:#e9edf4}
        .window-close:hover{background:#ffe2e2;color:#dc4242}
        .window-body{flex:1;min-height:0;overflow:auto;background:#fff}
        .resize-handle{position:absolute;right:0;bottom:0;width:19px;height:19px;cursor:nwse-resize;touch-action:none;color:#aab5c5;display:grid;place-items:center}
        .xinetic-dock{position:absolute;bottom:13px;left:50%;transform:translateX(-50%);height:58px;padding:7px 11px;border:1px solid rgba(255,255,255,.8);border-radius:19px;background:rgba(255,255,255,.72);backdrop-filter:blur(25px);box-shadow:0 8px 28px rgba(55,75,110,.15);display:flex;align-items:center;gap:7px;z-index:600}
        .dock-button{width:43px;height:43px;border:0;border-radius:12px;background:transparent;color:#52627a;display:grid;place-items:center;cursor:pointer;position:relative}
        .dock-button:hover{background:rgba(220,230,245,.8);transform:translateY(-3px)}
        .dock-button.active:after{content:"";position:absolute;bottom:-3px;width:5px;height:5px;border-radius:50%;background:#628fe0}
        .dock-separator{height:30px;width:1px;background:#dce2eb;margin:0 3px}
        .start-menu,.notification-panel{position:absolute;bottom:83px;z-index:700;background:rgba(255,255,255,.96);backdrop-filter:blur(25px);border:1px solid white;border-radius:18px;box-shadow:0 15px 55px rgba(50,65,95,.2)}
        .start-menu{left:50%;transform:translateX(-50%);width:min(390px,calc(100vw - 24px));padding:18px}
        .start-heading{font-size:17px;font-weight:800;margin-bottom:13px}
        .start-search{height:38px;border:1px solid #e1e7f0;border-radius:10px;display:flex;align-items:center;gap:8px;padding:0 10px;margin-bottom:15px;background:#f7f9fc}
        .start-search input{border:0;outline:0;background:transparent;width:100%;font:inherit;font-size:13px}
        .start-app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .start-app{border:0;background:transparent;border-radius:11px;padding:12px 5px;display:flex;flex-direction:column;align-items:center;gap:7px;font-size:11px;cursor:pointer;color:#354258}
        .start-app:hover{background:#edf3fc}
        .app-icon{width:37px;height:37px;border-radius:11px;color:white;display:grid;place-items:center}
        .notification-panel{right:15px;width:min(320px,calc(100vw - 30px));padding:17px}
        .notification-heading{display:flex;justify-content:space-between;align-items:center;font-weight:800;margin-bottom:13px}
        .notification-item{padding:12px;border-radius:11px;background:#f2f6fc;margin-bottom:8px;font-size:12px;line-height:1.5}
        .notification-empty{font-size:12px;color:#8490a2;padding:15px 0}
        .notification-clear{border:0;background:transparent;color:#5888d0;font-size:11px;cursor:pointer}
        .calc-app{padding:17px;height:100%;display:flex;flex-direction:column;gap:12px}
        .calc-display{background:#f2f5fa;border-radius:12px;min-height:68px;padding:15px;text-align:right;font-size:28px;font-weight:700;overflow:auto}
        .calc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1}
        .calc-grid button{border:0;border-radius:10px;background:#edf1f7;color:#35445b;font-size:17px;cursor:pointer}
        .calc-grid button:hover{background:#dce7f6}
        .calc-grid .calc-equals{background:#668fe0;color:white}
        .calc-grid .calc-clear{background:#f9e6e7;color:#bd555c}
        .notes-app{height:100%;padding:13px;display:flex;flex-direction:column;gap:10px}
        .app-subtitle{font-size:11px;color:#8390a2;display:flex;align-items:center;gap:6px}
        .notes-editor{flex:1;width:100%;resize:none;border:0;outline:0;padding:12px;font:14px/1.7 inherit;color:#334155;background:#fff}
        .terminal-app{height:100%;background:#171e2b;color:#d7e5f7;padding:15px;font:12px/1.8 ui-monospace,SFMono-Regular,monospace;display:flex;flex-direction:column;overflow:auto}
        .terminal-history{flex:1;white-space:pre-wrap}
        .terminal-input-row{display:flex;gap:8px;color:#79d9a5}
        .terminal-input-row input{background:transparent;border:0;outline:0;color:#fff;flex:1;font:inherit}
        .files-app{height:100%;display:flex;flex-direction:column}
        .files-toolbar{display:flex;gap:6px;padding:10px;border-bottom:1px solid #edf0f5;flex-wrap:wrap}
        .files-toolbar button{border:0;background:#f3f6fa;border-radius:8px;padding:7px 9px;display:flex;align-items:center;gap:6px;font-size:11px;color:#52627a;cursor:pointer}
        .files-toolbar button:disabled{opacity:.4;cursor:not-allowed}
        .files-location{height:38px;display:flex;align-items:center;gap:7px;padding:0 14px;color:#8190a5;font-size:11px;border-bottom:1px solid #f0f2f6}
        .files-grid{padding:17px;display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:12px;align-content:start;flex:1}
        .file-item{border:1px solid transparent;background:transparent;border-radius:10px;min-height:85px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;font-size:11px;color:#48566c;cursor:pointer;overflow-wrap:anywhere}
        .file-item:hover,.file-selected{background:#edf4ff;border-color:#c8dcfa}
        .files-footer{height:28px;border-top:1px solid #edf0f5;padding:7px 13px;color:#8b96a6;font-size:10px}
        .empty-files{font-size:12px;color:#8490a2}
        .settings-app{padding:22px;overflow:auto}
        .settings-app h3{display:flex;align-items:center;gap:9px;font-size:16px;margin:0 0 5px}
        .settings-app h4{font-size:12px;margin:20px 0 10px}
        .settings-description{font-size:11px;color:#8a96a7}
        .wallpaper-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .wallpaper-choice{position:relative;border:1px solid #e5eaf1;border-radius:10px;padding:5px;background:white;text-align:left;cursor:pointer}
        .wallpaper-choice>span{display:block;height:58px;border-radius:6px}
        .wallpaper-choice small{display:block;padding:6px 2px 2px;font-size:10px;color:#52627a}
        .wallpaper-choice svg{position:absolute;right:9px;top:9px;color:#376ec4;background:white;border-radius:50%}
        .wallpaper-active{border:2px solid #6794df;padding:4px}
        .settings-divider{height:1px;background:#edf0f5;margin:19px 0}
        .theme-toggle{width:100%;border:1px solid #e7ebf2;border-radius:10px;background:#f8fafd;padding:12px;display:flex;align-items:center;gap:10px;text-align:left;color:#45546b;cursor:pointer}
        .theme-switch{margin-left:auto;font-size:10px;font-weight:800;color:#648cce}
        .monitor-app{padding:17px;display:grid;grid-template-columns:1fr 1fr;gap:11px;align-content:start}
        .monitor-card{background:#f5f8fc;border:1px solid #edf1f6;border-radius:12px;padding:14px;display:flex;align-items:center;gap:11px;color:#648bd0}
        .monitor-card div{display:flex;flex-direction:column;gap:5px;min-width:0}
        .monitor-card small{font-size:10px;color:#8793a5}
        .monitor-card strong{font-size:11px;color:#3e4c62;overflow-wrap:anywhere}
        .monitor-note{grid-column:1/-1;font-size:10px;line-height:1.6;color:#8591a2;background:#f8f9fb;padding:12px;border-radius:9px}
        .dark-mode .xinetic-topbar,.dark-mode .xinetic-dock,.dark-mode .start-menu,.dark-mode .notification-panel{background:rgba(30,39,55,.94);color:#e5ecf7;border-color:#46536a}
        .dark-mode .xinetic-window{background:#202b3d;border-color:#45536b;color:#e6edf7}
        .dark-mode .window-titlebar{background:#263348;border-color:#3b4960}
        .dark-mode .window-body{background:#202b3d;color:#e6edf7}
        .dark-mode .notes-editor{background:#202b3d;color:#e6edf7}
        .dark-mode .calc-display,.dark-mode .calc-grid button{background:#344258;color:#e6edf7}
        .dark-mode .monitor-card,.dark-mode .monitor-note,.dark-mode .notification-item{background:#303e54;color:#e6edf7;border-color:#46536a}
        .dark-mode .monitor-card strong,.dark-mode .file-item,.dark-mode .settings-app h3{color:#e6edf7}
        .dark-mode .files-toolbar button,.dark-mode .theme-toggle{background:#344258;color:#e6edf7}
        .dark-mode .start-app{color:#e6edf7}
        @media(max-width:600px){.desktop-icons{grid-template-columns:70px;left:7px;gap:8px}.desktop-icon{width:65px;font-size:10px}.xinetic-dock{gap:2px;padding:6px 7px}.dock-button{width:38px;height:40px}.topbar-left,.topbar-right{gap:8px;font-size:10px}.topbar-brand span:last-child{display:none}.xinetic-window{min-width:300px;max-width:calc(100vw - 10px)}.monitor-app{grid-template-columns:1fr}.wallpaper-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div className="xinetic-topbar">
        <div className="topbar-left">
          <div className="topbar-brand">
            <div className="brand-mark"><Sparkles size={14} /></div>
            <span>Xinetic.OS</span>
          </div>
          <button className="topbar-button" onClick={e => { e.stopPropagation(); setStartOpen(!startOpen); setNotificationOpen(false) }}>
            <Grid3X3 size={14} /> Menu
          </button>
        </div>
        <div className="topbar-right">
          <Wifi size={14} />
          <Volume2 size={14} />
          <Battery size={15} />
          <button className="topbar-button" onClick={e => { e.stopPropagation(); setNotificationOpen(!notificationOpen); setStartOpen(false) }}>
            <Bell size={14} />
            <span>{notifications.length}</span>
          </button>
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      <div className="desktop-icons">
        {(Object.keys(appInfo) as AppId[]).map(app => {
          const Icon = appInfo[app].icon
          return (
            <button key={app} className="desktop-icon" onDoubleClick={() => openApp(app)} onClick={() => setActiveId(0)}>
              <Icon size={31} color={appInfo[app].color} />
              <span>{appInfo[app].name}</span>
            </button>
          )
        })}
      </div>

      <div className="desktop-windows">
        {windows.filter(w => !w.minimized).sort((a, b) => a.z - b.z).map(w => {
          const Icon = appInfo[w.app].icon
          return (
            <section
              key={w.id}
              className="xinetic-window"
              style={{
                left: w.x, top: w.y, width: w.width, height: w.height,
                zIndex: w.z === 0 ? 1 : w.z,
                outline: activeId === w.id ? '1px solid rgba(100,145,220,.35)' : 'none'
              }}
              onPointerDown={() => setActiveId(w.id)}
            >
              <div
                className="window-titlebar"
                onPointerDown={e => startInteraction(e, w, 'move')}
                onDoubleClick={() => toggleMaximize(w.id)}
              >
                <div className="window-title">
                  <Icon size={17} color={appInfo[w.app].color} />
                  {appInfo[w.app].name}
                </div>
                <div className="window-controls">
                  <button className="window-control" title="Minimize" onPointerDown={e => e.stopPropagation()} onClick={() => minimizeWindow(w.id)}><Minus size={15} /></button>
                  <button className="window-control" title="Maximize / Restore" onPointerDown={e => e.stopPropagation()} onClick={() => toggleMaximize(w.id)}><Maximize2 size={13} /></button>
                  <button className="window-control window-close" title="Close" onPointerDown={e => e.stopPropagation()} onClick={() => closeWindow(w.id)}><X size={15} /></button>
                </div>
              </div>
              <div className="window-body">
                <AppContent
                  app={w.app}
                  notify={notify}
                  wallpaper={wallpaper}
                  setWallpaper={setWallpaper}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              </div>
              {!w.maximized && (
                <div className="resize-handle" onPointerDown={e => startInteraction(e, w, 'resize')}>
                  <Grip size={13} />
                </div>
              )}
            </section>
          )
        })}
      </div>

      {startOpen && (
        <div className="start-menu" onClick={e => e.stopPropagation()}>
          <div className="start-heading">Welcome to Xinetic.OS</div>
          <div className="start-search">
            <Search size={15} />
            <input placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="start-app-grid">
            {visibleApps.map(app => {
              const Icon = appInfo[app].icon
              return (
                <button key={app} className="start-app" onClick={() => openApp(app)}>
                  <span className="app-icon" style={{ background: appInfo[app].color }}><Icon size={20} /></span>
                  {appInfo[app].name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {notificationOpen && (
        <div className="notification-panel" onClick={e => e.stopPropagation()}>
          <div className="notification-heading">
            Notifications
            <button className="notification-clear" onClick={() => setNotifications([])}>Clear all</button>
          </div>
          {notifications.length === 0
            ? <div className="notification-empty">You're all caught up!</div>
            : notifications.map((n, i) => <div className="notification-item" key={i}><Bell size={13} /> {n}</div>)
          }
        </div>
      )}

      <div className="xinetic-dock" onClick={e => e.stopPropagation()}>
        <button className="dock-button" title="Start menu" onClick={() => { setStartOpen(!startOpen); setNotificationOpen(false) }}>
          <Grid3X3 size={22} />
        </button>
        <div className="dock-separator" />
        {(Object.keys(appInfo) as AppId[]).map(app => {
          const Icon = appInfo[app].icon
          const isOpen = windows.some(w => w.app === app)
          return (
            <button key={app} className={`dock-button ${isOpen ? 'active' : ''}`} title={appInfo[app].name} onClick={() => openApp(app)}>
              <Icon size={22} color={appInfo[app].color} />
            </button>
          )
        })}
        <div className="dock-separator" />
        <button className="dock-button" title="Notifications" onClick={() => { setNotificationOpen(!notificationOpen); setStartOpen(false) }}>
          <Bell size={20} />
        </button>
      </div>
    </div>
  )
}
