import { useState } from 'react'
import {
  Monitor, Folder, Settings, Terminal, Calculator,
  FileText, Search, Wifi, Battery, Volume2,
  Power, Bell, Calendar, X, Minus, Maximize2,
  Grid3X3, Sparkles, ChevronRight
} from 'lucide-react'

type AppWindow = {
  id: string
  title: string
  icon: React.ElementType
}

const apps = [
  { id: 'files', name: 'Files', icon: Folder, color: '#72a7f7' },
  { id: 'settings', name: 'Settings', icon: Settings, color: '#9298a8' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: '#555d75' },
  { id: 'calculator', name: 'Calculator', icon: Calculator, color: '#8a83ec' },
  { id: 'notes', name: 'Notes', icon: FileText, color: '#e5b75d' },
  { id: 'monitor', name: 'System Monitor', icon: Monitor, color: '#55bca4' },
]

export default function App() {
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [startOpen, setStartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clock] = useState(new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  }))

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

  return (
    <main className="desktop">
      <div className="desktop-glow glow-one" />
      <div className="desktop-glow glow-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <span>Xinetic<span className="brand-light">.OS</span></span>
        </div>

        <div className="topbar-center">
          <span>Desktop</span>
          <ChevronRight size={14} />
          <span className="muted">Workspace 1</span>
        </div>

        <div className="system-tray">
          <Wifi size={16} />
          <Volume2 size={16} />
          <Battery size={17} />
          <span className="clock">{clock}</span>
        </div>
      </header>

      <section className="desktop-icons">
        {apps.slice(0, 4).map(app => {
          const Icon = app.icon
          return (
            <button className="desktop-icon" key={app.id} onClick={() => openApp(app)}>
              <span className="icon-tile" style={{ color: app.color }}>
                <Icon size={25} />
              </span>
              <span>{app.name}</span>
            </button>
          )
        })}
      </section>

      <section className="window-area">
        {windows.map((win, index) => {
          const Icon = win.icon
          return (
            <article className="app-window" key={win.id}
              style={{ top: `${90 + index * 28}px`, left: `${160 + index * 35}px` }}>
              <div className="window-titlebar">
                <div className="window-title">
                  <Icon size={16} />
                  <span>{win.title}</span>
                </div>
                <div className="window-controls">
                  <button aria-label="Minimize"><Minus size={15} /></button>
                  <button aria-label="Maximize"><Maximize2 size={13} /></button>
                  <button className="close-button" aria-label="Close" onClick={() => closeWindow(win.id)}>
                    <X size={15} />
                  </button>
                </div>
              </div>
              <div className="window-content">
                <div className="app-placeholder">
                  <div className="placeholder-icon"><Icon size={32} /></div>
                  <h2>{win.title}</h2>
                  <p>Welcome to Xinetic.OS</p>
                  <span>This application is part of your desktop environment.</span>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {startOpen && (
        <section className="start-menu">
          <div className="start-heading">
            <div>
              <span className="eyebrow">YOUR WORKSPACE</span>
              <h2>Good day.</h2>
            </div>
            <div className="user-avatar">X</div>
          </div>

          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search apps..."
            />
          </div>

          <div className="menu-section-title">PINNED APPLICATIONS</div>
          <div className="app-grid">
            {apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase())).map(app => {
              const Icon = app.icon
              return (
                <button className="menu-app" key={app.id} onClick={() => openApp(app)}>
                  <span className="menu-app-icon" style={{ color: app.color }}>
                    <Icon size={23} />
                  </span>
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
        <button className={`launcher ${startOpen ? 'active' : ''}`}
          onClick={() => setStartOpen(!startOpen)} aria-label="Open app launcher">
          <Grid3X3 size={22} />
        </button>
        <div className="dock-divider" />
        {apps.map(app => {
          const Icon = app.icon
          return (
            <button className={`dock-app ${windows.some(w => w.id === app.id) ? 'running' : ''}`}
              key={app.id} title={app.name} onClick={() => openApp(app)}>
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
