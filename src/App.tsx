
import { useEffect, useState } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator,
  FileText, Search, Wifi, Battery, Volume2,
  Power, Bell, Calendar, X, Minus, Maximize2,
  Grid3X3, Sparkles, ChevronRight, Home, Plus,
  Trash2, Save, Palette, HardDrive
} from 'lucide-react'

const apps = [
  { id: 'files', name: 'Files', icon: Folder, color: '#72a7f7' },
  { id: 'settings', name: 'Settings', icon: Settings, color: '#9298a8' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: '#555d75' },
  { id: 'calculator', name: 'Calculator', icon: Calculator, color: '#8a83ec' },
  { id: 'notes', name: 'Notes', icon: FileText, color: '#e5b75d' },
  { id: 'monitor', name: 'System Monitor', icon: Monitor, color: '#55bca4' },
]

type AppWindow = {
  id: string
  title: string
  icon: typeof Folder
}

export default function App() {
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [startOpen, setStartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clock, setClock] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const [note, setNote] = useState(() => localStorage.getItem('xinetic-note') || '')
  const [wallpaper, setWallpaper] = useState('blue')
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState(['Welcome to Xinetic.OS Terminal.', 'Type "help" to see available commands.'])
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcFirst, setCalcFirst] = useState<number | null>(null)
  const [calcOperator, setCalcOperator] = useState<string | null>(null)
  const [calcNewNumber, setCalcNewNumber] = useState(false)
  const [fileNames, setFileNames] = useState(['Documents', 'Downloads', 'Pictures', 'Music', 'Welcome.txt'])

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('xinetic-note', note)
  }, [note])

  function openApp(app: typeof apps[number]) {
    setWindows(current =>
      current.some(w => w.id === app.id)
        ? current
        : [...current, { id: app.id, title: app.name, icon: app.icon }]
    )
    setStartOpen(false)
  }

  function closeWindow(id: string) {
    setWindows(current => current.filter(w => w.id !== id))
  }

  function runCommand() {
    const command = terminalInput.trim()
    if (!command) return

    let response = ''
    if (command === 'help') response = 'Available commands: help, about, date, clear, apps, whoami'
    else if (command === 'about') response = 'Xinetic.OS Experimental Edition — version 1.0'
    else if (command === 'date') response = new Date().toString()
    else if (command === 'apps') response = 'Files, Settings, Terminal, Calculator, Notes, System Monitor'
    else if (command === 'whoami') response = 'xinetic-user'
    else if (command === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    } else response = `Command not found: ${command}`

    setTerminalOutput(current => [...current, `> ${command}`, response])
    setTerminalInput('')
  }

  function calculatorPress(value: string) {
    if (value === 'C') {
      setCalcDisplay('0')
      setCalcFirst(null)
      setCalcOperator(null)
      setCalcNewNumber(false)
      return
    }

    if (['+', '-', '×', '÷'].includes(value)) {
      setCalcFirst(Number(calcDisplay))
      setCalcOperator(value)
      setCalcNewNumber(true)
      return
    }

    if (value === '=') {
      if (calcFirst === null || !calcOperator) return
      const second = Number(calcDisplay)
      let result = 0
      if (calcOperator === '+') result = calcFirst + second
      if (calcOperator === '-') result = calcFirst - second
      if (calcOperator === '×') result = calcFirst * second
      if (calcOperator === '÷') result = second === 0 ? NaN : calcFirst / second
      setCalcDisplay(Number.isFinite(result) ? String(Number(result.toFixed(8))) : 'Error')
      setCalcFirst(null)
      setCalcOperator(null)
      setCalcNewNumber(true)
      return
    }

    if (value === '.' && calcDisplay.includes('.') && !calcNewNumber) return
    setCalcDisplay(current =>
      calcNewNumber || current === '0' || current === 'Error'
        ? value === '.' ? '0.' : value
        : current + value
    )
    setCalcNewNumber(false)
  }

  function renderApp(id: string) {
    if (id === 'calculator') return (
      <div style={{ maxWidth: 300, margin: 'auto' }}>
        <div style={{ background: '#eef0f7', padding: 20, borderRadius: 14, textAlign: 'right', fontSize: 30, marginBottom: 12, overflow: 'hidden' }}>{calcDisplay}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {['7','8','9','÷','4','5','6','×','1','2','3','-','C','0','.','+','='].map(key => (
            <button key={key} onClick={() => calculatorPress(key)} style={{ padding: 15, border: 0, borderRadius: 10, background: key === '=' ? '#8278e9' : '#edf0f7', color: key === '=' ? 'white' : '#30354a', fontSize: 18, cursor: 'pointer' }}>{key}</button>
          ))}
        </div>
      </div>
    )

    if (id === 'notes') return (
      <div>
        <h2>Your Notes</h2>
        <p style={{ color: '#777' }}>Your notes are saved automatically in this browser.</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Start writing something..." style={{ width: '100%', minHeight: 220, padding: 14, borderRadius: 12, border: '1px solid #ddd', font: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
        <p style={{ color: '#777', fontSize: 12 }}><Save size={13} style={{ verticalAlign: 'middle' }} /> Saved automatically</p>
      </div>
    )

    if (id === 'terminal') return (
      <div style={{ background: '#202638', color: '#d8e5ff', borderRadius: 12, padding: 16, fontFamily: 'monospace', minHeight: 230 }}>
        {terminalOutput.map((line, i) => <div key={i} style={{ marginBottom: 7, overflowWrap: 'anywhere' }}>{line}</div>)}
        <form onSubmit={e => { e.preventDefault(); runCommand() }} style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: '#91d6b5' }}>user@xinetic:~$</span>
          <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)} autoFocus style={{ flex: 1, background: 'transparent', color: 'white', border: 0, outline: 'none', fontFamily: 'monospace', minWidth: 0 }} />
        </form>
      </div>
    )

    if (id === 'settings') return (
      <div>
        <h2><Palette size={20} style={{ verticalAlign: 'middle' }} /> Personalization</h2>
        <p>Choose your desktop wallpaper.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            ['blue', 'Blue'],
            ['purple', 'Purple'],
            ['green', 'Green'],
            ['light', 'Light']
          ].map(([value, label]) => (
            <button key={value} onClick={() => setWallpaper(value)} style={{ padding: 14, borderRadius: 12, border: wallpaper === value ? '2px solid #8278e9' : '1px solid #ddd', cursor: 'pointer', background: value === 'blue' ? '#dbeafe' : value === 'purple' ? '#eadfff' : value === 'green' ? '#d9f5e5' : '#f1f2f5' }}>{label}</button>
          ))}
        </div>
        <p style={{ color: '#777', marginTop: 20 }}>Xinetic.OS Experimental · Version 1.0</p>
      </div>
    )

    if (id === 'files') return (
      <div>
        <h2><Home size={20} style={{ verticalAlign: 'middle' }} /> Home</h2>
        <p style={{ color: '#777' }}>Your workspace</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          {fileNames.map((file, i) => (
            <div key={file} style={{ background: '#f1f4fa', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <Folder size={28} color={i < 4 ? '#72a7f7' : '#d9ae55'} />
              <p style={{ marginBottom: 0, overflowWrap: 'anywhere' }}>{file}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setFileNames(current => [...current, `New folder ${current.length - 3}`])} style={{ marginTop: 16, padding: 10, border: 0, borderRadius: 9, background: '#e9e7ff', cursor: 'pointer' }}><Plus size={15} style={{ verticalAlign: 'middle' }} /> New folder</button>
        <button onClick={() => setFileNames(['Documents', 'Downloads', 'Pictures', 'Music', 'Welcome.txt'])} style={{ marginLeft: 8, padding: 10, border: 0, borderRadius: 9, cursor: 'pointer' }}><Trash2 size={15} style={{ verticalAlign: 'middle' }} /> Reset</button>
      </div>
    )

    if (id === 'monitor') return (
      <div>
        <h2><HardDrive size={20} style={{ verticalAlign: 'middle' }} /> System Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          {[
            ['Operating System', 'Xinetic.OS'],
            ['Version', '1.0 Experimental'],
            ['Platform', navigator.platform || 'Browser'],
            ['Screen', `${window.screen.width} × ${window.screen.height}`],
            ['Memory', 'Browser-managed'],
            ['Status', 'Running']
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#f1f4fa', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#777', fontSize: 12 }}>{label}</div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <p style={{ color: '#777', fontSize: 12 }}>These are browser environment details, not measurements of your entire computer.</p>
      </div>
    )

    return <p>Welcome to Xinetic.OS</p>
  }

  const wallpaperStyle = wallpaper === 'purple'
    ? 'linear-gradient(135deg, #eee5ff, #d9d9ff)'
    : wallpaper === 'green'
      ? 'linear-gradient(135deg, #e1f5e9, #c9e8dc)'
      : wallpaper === 'light'
        ? 'linear-gradient(135deg, #f5f6fa, #e5e8f0)'
        : 'linear-gradient(135deg, #e5efff, #d9e2fa)'

  return (
    <main className="desktop" style={{ background: wallpaperStyle }}>
      <div className="desktop-glow glow-one" />
      <div className="desktop-glow glow-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <span>Xinetic<span className="brand-light">.OS</span></span>
        </div>
        <div className="topbar-center">
          <span>Desktop</span><ChevronRight size={14} /><span className="muted">Workspace 1</span>
        </div>
        <div className="system-tray">
          <Wifi size={16} /><Volume2 size={16} /><Battery size={17} />
          <span className="clock">{clock}</span>
        </div>
      </header>

      <section className="desktop-icons">
        {apps.slice(0, 4).map(app => {
          const Icon = app.icon
          return (
            <button className="desktop-icon" key={app.id} onClick={() => openApp(app)}>
              <span className="icon-tile" style={{ color: app.color }}><Icon size={25} /></span>
              <span>{app.name}</span>
            </button>
          )
        })}
      </section>

      <section className="window-area">
        {windows.map((win, index) => {
          const Icon = win.icon
          return (
            <article className="app-window" key={win.id} style={{ top: `${70 + index * 25}px`, left: `${100 + index * 30}px`, width: 'min(620px, calc(100vw - 35px))', zIndex: index + 1 }}>
              <div className="window-titlebar">
                <div className="window-title"><Icon size={16} /><span>{win.title}</span></div>
                <div className="window-controls">
                  <button aria-label="Minimize"><Minus size={15} /></button>
                  <button aria-label="Maximize"><Maximize2 size={13} /></button>
                  <button className="close-button" aria-label="Close" onClick={() => closeWindow(win.id)}><X size={15} /></button>
                </div>
              </div>
              <div className="window-content" style={{ padding: 20, maxHeight: '65vh', overflow: 'auto' }}>
                {renderApp(win.id)}
              </div>
            </article>
          )
        })}
      </section>

      {startOpen && (
        <section className="start-menu">
          <div className="start-heading">
            <div><span className="eyebrow">YOUR WORKSPACE</span><h2>Good day.</h2></div>
            <div className="user-avatar">X</div>
          </div>
          <div className="search-box">
            <Search size={17} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..." />
          </div>
          <div className="menu-section-title">PINNED APPLICATIONS</div>
          <div className="app-grid">
            {apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase())).map(app => {
              const Icon = app.icon
              return (
                <button className="menu-app" key={app.id} onClick={() => openApp(app)}>
                  <span className="menu-app-icon" style={{ color: app.color }}><Icon size={23} /></span>
                  <span>{app.name}</span>
                </button>
              )
            })}
          </div>
          <div className="start-footer">
            <span><Sparkles size={15} /> Xinetic.OS Experimental</span>
            <button aria-label="Power"><Power size={17} /></button>
          </div>
        </section>
      )}

      <footer className="dock">
        <button className={`launcher ${startOpen ? 'active' : ''}`} onClick={() => setStartOpen(!startOpen)} aria-label="Open app launcher"><Grid3X3 size={22} /></button>
        <div className="dock-divider" />
        {apps.map(app => {
          const Icon = app.icon
          return (
            <button className={`dock-app ${windows.some(w => w.id === app.id) ? 'running' : ''}`} key={app.id} title={app.name} onClick={() => openApp(app)}>
              <Icon size={22} style={{ color: app.color }} />
            </button>
          )
        })}
        <div className="dock-spacer" />
        <button className="dock-notification" title="Notifications"><Bell size={19} /></button>
        <button className="dock-calendar" title="Calendar"><Calendar size={19} /></button>
      </footer>
    </main>
  )
}
