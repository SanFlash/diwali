import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
import { ArrowLeft, ArrowRight, Crosshair, Heart, RotateCcw, Shield, Swords, Wifi, WifiOff } from 'lucide-react'
import PageIntro from '../components/PageIntro'

type Fighter = { id: string; name: string; x: number; y: number; facing: 'left' | 'right'; hp: number; ready: boolean }
type MatchEvent = { type: 'move' | 'shot' | 'rematch' | 'leave'; playerId: string; x?: number; y?: number; facing?: 'left' | 'right'; shotId?: string }
type LocalRecord = { id: string; opponent: string; result: string; date: string }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const DB_NAME = 'arrow-arena-local'
const DB_STORE = 'records'\nconst PLAYER_STORE = 'players'

function openLocalDb(): Promise<IDBDatabase | null> {
  return new Promise(resolve => {
    if (!('indexedDB' in window)) return resolve(null)
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE, { keyPath: 'id' })\n      if (!request.result.objectStoreNames.contains(PLAYER_STORE)) request.result.createObjectStore(PLAYER_STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
  })
}
async function savePlayer(player: { id: string; name: string; lastSeen: string }) {\n  const db = await openLocalDb()\n  if (!db) return\n  const tx = db.transaction(PLAYER_STORE, 'readwrite')\n  tx.objectStore(PLAYER_STORE).put(player)\n  tx.oncomplete = () => db.close()\n}\nasync function saveRecord(record: LocalRecord) {
  const db = await openLocalDb()
  if (!db) return
  const tx = db.transaction(DB_STORE, 'readwrite')
  tx.objectStore(DB_STORE).put(record)
  tx.oncomplete = () => db.close()
}
async function readRecords(): Promise<LocalRecord[]> {
  const db = await openLocalDb()
  if (!db) return []
  return new Promise(resolve => {
    const request = db.transaction(DB_STORE, 'readonly').objectStore(DB_STORE).getAll()
    request.onsuccess = () => { resolve((request.result as LocalRecord[]).sort((a,b) => b.date.localeCompare(a.date)).slice(0,5)); db.close() }
    request.onerror = () => { resolve([]); db.close() }
  })
}
function getPlayerId() {
  const key = 'arrow-arena-player-id'
  let id = localStorage.getItem(key)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id) }
  return id
}
function makeFighter(id: string, name: string, index: number): Fighter {
  return { id, name, x: index === 0 ? 18 : 82, y: 0, facing: index === 0 ? 'right' : 'left', hp: 100, ready: true }
}

function HumanFighter({ fighter, side, hit, jumping }: { fighter: Fighter; side: 'left' | 'right'; hit: boolean; jumping: boolean }) {
  return <div className={`fighter fighter-${side} ${hit ? 'fighter-hit' : ''} ${jumping ? 'fighter-jump' : ''}`} style={{ left: `${fighter.x}%`, bottom: `${fighter.y}px` }}>
    <div className="fighter-name">{fighter.name}</div>
    <svg viewBox="0 0 100 160" role="img" aria-label={`${fighter.name} animated player`} className="fighter-art">
      <ellipse cx="50" cy="153" rx="24" ry="5" fill="rgba(0,0,0,.35)"/>
      <path d="M36 91 L29 139 L22 151 L43 151 L50 111 L58 151 L79 151 L68 137 L64 91Z" fill={side === 'left' ? '#e7b45f' : '#64c9c2'} stroke="#211b30" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M35 56 Q50 45 65 56 L70 101 Q50 112 30 101Z" fill={side === 'left' ? '#b94f37' : '#315f9b'} stroke="#211b30" strokeWidth="4"/>
      <path d="M34 64 L17 87 L22 95 L42 79 M66 64 L83 82 L77 91 L60 79" fill="none" stroke="#e6b98a" strokeWidth="9" strokeLinecap="round"/>
      <circle cx="50" cy="33" r="21" fill="#b87955" stroke="#211b30" strokeWidth="4"/>
      <path d="M29 31 Q27 6 51 9 Q76 7 72 35 Q61 19 43 22 Q37 28 29 31" fill="#292236"/>
      <circle cx="43" cy="34" r="2.4" fill="#211b30"/><circle cx="58" cy="34" r="2.4" fill="#211b30"/>
      <path d="M45 44 Q51 48 57 43" fill="none" stroke="#6d302c" strokeWidth="2" strokeLinecap="round"/>
      <path d={side === 'left' ? 'M76 78 L94 61' : 'M24 78 L6 61'} stroke="#f4d58d" strokeWidth="4" strokeLinecap="round"/>
      <path d={side === 'left' ? 'M89 61 L98 54' : 'M11 61 L2 54'} stroke="#fff0c4" strokeWidth="3" strokeLinecap="round"/>
    </svg>
    <div className="fighter-shadow"/>
  </div>
}

export default function ArrowArena() {
  const playerId = useRef(getPlayerId()).current
  const channelRef = useRef<RealtimeChannel | null>(null)
  const roomRef = useRef<RealtimeChannel | null>(null)
  const [name, setName] = useState(() => localStorage.getItem('arrow-arena-player-name') || 'Festival Archer')
  const [online, setOnline] = useState<Fighter[]>([])
  const [self, setSelf] = useState<Fighter>(() => makeFighter(playerId, name, 0))
  const [opponent, setOpponent] = useState<Fighter | null>(null)
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState(supabase ? 'Connecting to the arena lobby…' : 'Offline practice — multiplayer needs Supabase setup.')
  const [hp, setHp] = useState(100)
  const [enemyHp, setEnemyHp] = useState(100)
  const [battleOver, setBattleOver] = useState(false)
  const [message, setMessage] = useState('Enter your archer name and join the arena.')
  const [records, setRecords] = useState<LocalRecord[]>([])
  const [hitFlash, setHitFlash] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [shot, setShot] = useState<{ id: string; from: number; to: number } | null>(null)
  const [practice, setPractice] = useState(false)
  const [joined, setJoined] = useState(false)
  const matchIdRef = useRef('')
  const selfRef = useRef(self)
  selfRef.current = self

  useEffect(() => { void readRecords().then(setRecords) }, [])
  const send = useCallback((event: MatchEvent) => {
    if (roomRef.current) void roomRef.current.send({ type: 'broadcast', event: 'arena-action', payload: event })
  }, [])

  const finish = useCallback((won: boolean, opponentName: string) => {
    setBattleOver(true)
    setMessage(won ? 'Victory! Your opponent has been tagged four times.' : 'You have been tagged four times. Better luck next round!')
    const record = { id: crypto.randomUUID(), opponent: opponentName, result: won ? 'Victory' : 'Defeat', date: new Date().toISOString() }
    void saveRecord(record)
    setRecords(old => [record, ...old].slice(0,5))
  }, [])

  useEffect(() => {
    if (!supabase || !joined || practice) return
    let alive = true
    const lobby = supabase.channel('arrow-arena:lobby', { config: { presence: { key: playerId } } })
    channelRef.current = lobby
    lobby.on('presence', { event: 'sync' }, () => {
      if (!alive) return
      const state = lobby.presenceState<Fighter>()
      const players = Object.entries(state).flatMap(([id, metas]) => {
        const latest = metas[metas.length - 1] as unknown as Fighter
        return latest ? [{ ...latest, id }] : []
      }).sort((a,b) => a.id.localeCompare(b.id))
      setOnline(players)
      const me = players.find(p => p.id === playerId)
      const other = players.find(p => p.id !== playerId)
      if (me) setSelf(current => ({ ...current, name: me.name }))
      if (!other) {
        setOpponent(null); setStatus(players.length > 1 ? 'Finding your opponent…' : 'Waiting for another archer to join…')
        return
      }
      const pair = players.slice(0,2)
      if (!pair.some(p => p.id === playerId)) { setOpponent(null); setStatus('Arena is full. You are in the matchmaking queue.'); return }
      setOpponent(other)
      const roomId = pair.map(p => p.id).sort().join(':')
      if (matchIdRef.current === roomId) return
      matchIdRef.current = roomId
      setHp(100); setEnemyHp(100); setBattleOver(false); setMessage('Opponent found! First archer to land four hits wins.')
      void joinRoom(roomId, other)
    })
    lobby.subscribe(async state => {
      if (state === 'SUBSCRIBED') {
        setConnected(true); setStatus('Connected — visible in the live lobby.')
        await lobby.track({ ...selfRef.current, name: localStorage.getItem('arrow-arena-player-name') || 'Festival Archer', joinedAt: new Date().toISOString() })
      } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
        setConnected(false); setStatus('Connection interrupted. Check your Supabase configuration and network.')
      }
    })
    async function joinRoom(roomId: string, other: Fighter) {
      if (!supabase || !alive) return
      if (roomRef.current) await supabase.removeChannel(roomRef.current)
      const room = supabase.channel(`arrow-arena:room:${roomId}`, { config: { broadcast: { self: false } } })
      roomRef.current = room
      room.on('broadcast', { event: 'arena-action' }, ({ payload }) => {
        const event = payload as MatchEvent
        if (!event || event.playerId === playerId) return
        if (event.type === 'move') setOpponent(old => old ? { ...old, x: event.x ?? old.x, y: event.y ?? old.y, facing: event.facing ?? old.facing } : old)
        if (event.type === 'shot') {
          setHp(old => {
            const next = Math.max(0, old - 25)
            if (next === 0) finish(false, other.name)
            return next
          })
          setHitFlash(true); window.setTimeout(() => setHitFlash(false), 480)
          setMessage(`${other.name} landed a hit! -25 health.`)
          setShot({ id: event.shotId || crypto.randomUUID(), from: other.x, to: selfRef.current.x })
          window.setTimeout(() => setShot(null), 520)
        }
        if (event.type === 'rematch') { setHp(100); setEnemyHp(100); setBattleOver(false); setMessage('Rematch accepted. Fight!') }
        if (event.type === 'leave') { setOpponent(null); setStatus('Opponent disconnected. Waiting for a new match…'); matchIdRef.current = '' }
      })
      room.subscribe(state => { if (state === 'SUBSCRIBED') setStatus(`Matched with ${other.name}. Battle live!`) })
    }
    return () => {
      alive = false
      if (roomRef.current) void supabase?.removeChannel(roomRef.current)
      void supabase?.removeChannel(lobby)
      channelRef.current = null; roomRef.current = null; matchIdRef.current = ''
    }
  }, [joined, playerId, practice, finish])

  useEffect(() => {
    if (!joined || !supabase || practice) return
    const interval = window.setInterval(() => {
      const current = selfRef.current
      void channelRef.current?.track({ ...current, name: localStorage.getItem('arrow-arena-player-name') || current.name, joinedAt: new Date().toISOString() })
    }, 5000)
    return () => window.clearInterval(interval)
  }, [joined, practice])

  const join = () => {
    const clean = name.trim().slice(0,18) || 'Festival Archer'
    localStorage.setItem('arrow-arena-player-name', clean)
    setName(clean); setSelf(current => ({ ...current, name: clean }))
    setJoined(true); setPractice(false); setMessage('Searching for an opponent…')
    if (!supabase) setStatus('Supabase is not configured. You can still play local practice.')
  }
  const startPractice = () => {
    setPractice(true); setJoined(true); setConnected(false); setOpponent(makeFighter('practice-bot', 'Practice Bot', 1))
    setHp(100); setEnemyHp(100); setBattleOver(false); setMessage('Practice mode started. Fire four clean shots to win.')
  }
  const move = (direction: -1 | 1) => {
    if (battleOver) return
    setSelf(old => {
      const next = { ...old, x: Math.max(8, Math.min(92, old.x + direction * 5)), facing: direction > 0 ? 'right' as const : 'left' as const }
      selfRef.current = next
      send({ type: 'move', playerId, x: next.x, y: next.y, facing: next.facing })
      return next
    })
  }
  const jump = () => {
    if (jumping || battleOver) return
    setJumping(true); setSelf(old => ({ ...old, y: 62 }))
    window.setTimeout(() => { setJumping(false); setSelf(old => ({ ...old, y: 0 })) }, 520)
  }
  const fire = () => {
    if (!opponent || battleOver || hp <= 0 || enemyHp <= 0) return
    const shotId = crypto.randomUUID()
    setShot({ id: shotId, from: self.x, to: opponent.x })
    window.setTimeout(() => setShot(null), 520)
    if (practice) {
      setEnemyHp(old => {
        const next = Math.max(0, old - 25)
        if (next === 0) finish(true, 'Practice Bot')
        return next
      })
      setMessage('Bullseye! Practice Bot loses 25 health.')
    } else {
      send({ type: 'shot', playerId, x: self.x, shotId })
      setEnemyHp(old => {
        const next = Math.max(0, old - 25)
        if (next === 0) finish(true, opponent.name)
        return next
      })
      setMessage('Arrow launched! A hit deals 25% damage.')
    }
  }
  const rematch = () => {
    setHp(100); setEnemyHp(100); setBattleOver(false); setMessage('Rematch started!')
    if (!practice) send({ type: 'rematch', playerId })
  }
  const leave = () => {
    send({ type: 'leave', playerId })
    setJoined(false); setPractice(false); setOpponent(null); setHp(100); setEnemyHp(100); setBattleOver(false); setStatus('You left the arena.'); matchIdRef.current = ''
  }

  return <main className="inner-page arrow-arena-page">
    <PageIntro eyebrow="ARCADE CHALLENGE • AM WEBTECH" title={<>Aim. Shoot.<br/><em>Challenge a friend.</em></>} description="Join the live lobby, get paired with another visitor and trade playful arrows in a two-player festival showdown. Four hits take a fighter out."/>
    <section className="arena-shell duel-shell">
      <div className="arena-topline"><div><span className="arena-kicker"><Swords size={14}/> ARROW ARENA • DUEL MODE</span><h2 className="display">Dual <em>Battle</em></h2></div><span className={`connection-pill ${connected ? 'is-online' : ''}`}>{connected ? <Wifi size={14}/> : <WifiOff size={14}/>} {connected ? 'LIVE LOBBY' : practice ? 'PRACTICE' : 'NOT CONNECTED'}</span></div>
      {!joined && <div className="duel-entry">
        <label htmlFor="archer-name">YOUR ARCHER NAME</label>
        <input id="archer-name" maxLength={18} value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"/>
        <div className="duel-entry-actions"><button className="button button-gold" onClick={join}><Swords size={15}/> Find opponent</button><button className="arena-reset" onClick={startPractice}>Practice solo</button></div>
        <p>{status}</p>
      </div>}
      {joined && <>
        <div className="duel-status"><span className={connected || practice ? 'status-light live' : 'status-light'}/>{status}<strong>{online.length} online</strong></div>
        <div className="duel-health-row">
          <div className="duel-health"><div><b>{self.name}</b><strong>{hp}%</strong></div><div className="health-track"><span style={{width: hp + '%'}}/></div></div>
          <div className="duel-vs">VS</div>
          <div className="duel-health enemy"><div><b>{opponent?.name || 'Waiting…'}</b><strong>{enemyHp}%</strong></div><div className="health-track"><span style={{width: enemyHp + '%'}}/></div></div>
        </div>
        <div className="duel-stage">
          <div className="duel-sky"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>
          <div className="duel-ground"/>
          <HumanFighter fighter={self} side="left" hit={hitFlash} jumping={jumping}/>
          {opponent && <HumanFighter fighter={opponent} side="right" hit={false} jumping={false}/>}
          {shot && <div key={shot.id} className="duel-arrow" style={{left: `${shot.from}%`, width: `${Math.max(10, Math.abs(shot.to-shot.from))}%`, transform: shot.to < shot.from ? 'rotate(180deg)' : undefined}}>➤</div>}
          {!opponent && <div className="duel-waiting"><span>🏹</span><b>WAITING FOR ANOTHER ARCHER</b><small>Keep this page open. You will be paired automatically.</small></div>}
          {battleOver && <div className="duel-result"><TrophyIcon/><h3>{hp > 0 ? 'You win!' : 'Battle over'}</h3><p>{message}</p><button className="button button-gold" onClick={rematch}><RotateCcw size={14}/> Rematch</button></div>}
        </div>
        <div className="duel-controls">
          <div className="move-controls"><button aria-label="Move left" onClick={() => move(-1)} disabled={battleOver}><ArrowLeft/></button><button aria-label="Move right" onClick={() => move(1)} disabled={battleOver}><ArrowRight/></button><button onClick={jump} disabled={battleOver}><Shield size={17}/> Dodge</button></div>
          <button className="fire-button" onClick={fire} disabled={!opponent || battleOver}><Crosshair size={17}/> FIRE ARROW</button>
        </div>
        <div className="duel-message"><Heart size={15}/>{message}</div>
        <button className="text-button" onClick={leave}>Leave arena</button>
      </>}
    </section>
    <div className="arena-howto"><div><span>01</span><h3>Join the lobby</h3><p>Every visitor gets a unique player identity. The first two available archers are matched automatically; others wait their turn.</p></div><div><span>02</span><h3>Dodge and fire</h3><p>Move across the arena, dodge incoming arrows and launch your own. Each confirmed hit removes 25% health.</p></div><div><span>03</span><h3>Win the duel</h3><p>Four hits defeat a player. Choose rematch to restart the duel with full health.</p></div></div>
    <section className="arena-history"><h3>Recent local matches</h3>{records.length ? records.map(record => <div key={record.id}><span>{record.result === 'Victory' ? '🏆' : '⚔️'} {record.result} vs {record.opponent}</span><small>{new Date(record.date).toLocaleString()}</small></div>) : <p>Your recent match results will appear here on this device.</p>}</section>
    <p className="arena-disclaimer">{practice ? 'Practice mode is running locally.' : supabase ? 'Live presence and battle events use Supabase Realtime. Match history is stored in this browser using IndexedDB.' : 'Multiplayer needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Solo practice works without them.'}</p>
  </main>
}

function TrophyIcon() { return <span className="duel-trophy" aria-hidden="true">🏆</span> }
