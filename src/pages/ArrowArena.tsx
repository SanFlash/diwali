import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, RotateCcw, Target, Trophy, Zap } from 'lucide-react'
import PageIntro from '../components/PageIntro'

const COLS = 10
const ROWS = 7
const TOTAL = COLS * ROWS
const START = [32, 42, 52]
const neighbors = (id: number) => [id - COLS, id + COLS, ...(id % COLS ? [id - 1] : []), ...((id + 1) % COLS ? [id + 1] : [])].filter(n => n >= 0 && n < TOTAL && Math.abs((n % COLS) - (id % COLS)) + Math.abs(Math.floor(n / COLS) - Math.floor(id / COLS)) === 1)

export default function ArrowArena() {
  const [owned, setOwned] = useState<number[]>(START)
  const [shots, setShots] = useState(18)
  const [flying, setFlying] = useState<number | null>(null)
  const [lastHit, setLastHit] = useState<number | null>(null)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [message, setMessage] = useState('Choose a glowing frontier tile and launch your arrow.')
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [level, setLevel] = useState(1)
  const score = owned.length * 10
  const percent = Math.round(owned.length / TOTAL * 100)
  const reachable = useMemo(() => {
    const set = new Set<number>()
    owned.forEach(id => neighbors(id).forEach(n => set.add(n)))
    return set
  }, [owned])

  useEffect(() => {
    if (!started || gameOver) return
    const timer = window.setInterval(() => setTimeLeft(t => {
      if (t <= 1) { setGameOver(true); setMessage('Time is up! Your captured kingdom is yours to keep.'); return 0 }
      return t - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [started, gameOver])

  useEffect(() => {
    if (flying === null) return
    const timer = window.setTimeout(() => {
      const splash = neighbors(flying).filter(n => !owned.includes(n))
      const bonus = splash.length ? splash[Math.floor(Math.random() * splash.length)] : null
      setOwned(current => [...new Set([...current, flying, ...(bonus === null ? [] : [bonus])])])
      setLastHit(flying)
      setCombo(c => {
        const next = c + 1
        setBestCombo(best => Math.max(best, next))
        return next
      })
      setMessage(bonus === null ? 'Bullseye! Frontier captured.' : 'Bullseye + chain capture! Two tiles claimed.')
      setFlying(null)
      if (shots <= 1) { setGameOver(true); setMessage('Arrows exhausted! Your final territory is locked in.') }
      setShots(s => Math.max(0, s - 1))
    }, 620)
    return () => window.clearTimeout(timer)
  }, [flying])

  useEffect(() => {
    if (percent >= 55 && !gameOver && started) {
      setLevel(2)
      setMessage('Territory milestone reached! Level 2 — keep expanding.')
    }
  }, [percent, gameOver, started])

  const shoot = (id: number) => {
    if (!started) { setStarted(true); setMessage('Game on! Capture connected frontier tiles.'); }
    if (gameOver || flying !== null || shots <= 0 || owned.includes(id) || !reachable.has(id)) return
    setLastHit(null)
    setFlying(id)
  }
  const reset = () => {
    setOwned(START); setShots(18); setFlying(null); setLastHit(null); setCombo(0); setBestCombo(0)
    setMessage('Choose a glowing frontier tile and launch your arrow.')
    setGameOver(false); setStarted(false); setTimeLeft(60); setLevel(1)
  }
  return <main className="inner-page arrow-arena-page">
    <PageIntro eyebrow="ARCADE CHALLENGE • AM WEBTECH" title={<>Aim. Shoot.<br/><em>Claim the kingdom.</em></>} description="A fast-paced territory capture challenge. Fire arrows into connected frontier zones, trigger chain captures and paint the arena in your festival colours."/>
    <section className="arena-shell">
      <div className="arena-topline"><div><span className="arena-kicker"><Target size={14}/> TERRITORY WARFARE</span><h2 className="display">Arrow <em>Arena</em></h2></div><button className="arena-reset" onClick={reset}><RotateCcw size={15}/> Restart</button></div>
      <div className="arena-stats">
        <div><span>YOUR SCORE</span><strong>{score.toLocaleString()}</strong></div>
        <div><span>TERRITORY</span><strong>{percent}%</strong></div>
        <div><span>ARROWS LEFT</span><strong>{shots}</strong></div>
        <div><span>TIME LEFT</span><strong>00:{String(timeLeft).padStart(2, '0')}</strong></div>
      </div>
      <div className="arena-progress"><span style={{width: percent + '%'}}/></div>
      <div className="arena-instructions"><span className="arena-dot own"/> Your territory <span className="arena-dot frontier"/> Reachable frontier <span className="arena-dot neutral"/> Unclaimed land</div>
      <div className="capture-board" aria-label="Territory capture game board">
        {Array.from({length: TOTAL}, (_, id) => {
          const isOwned = owned.includes(id)
          const canShoot = reachable.has(id) && !isOwned && !gameOver && flying === null && shots > 0
          return <button key={id} className={`capture-cell ${isOwned ? 'captured' : canShoot ? 'frontier' : ''} ${lastHit === id ? 'hit' : ''}`} onClick={() => shoot(id)} disabled={!canShoot && !isOwned} aria-label={`Tile ${id + 1}: ${isOwned ? 'captured' : canShoot ? 'shoot to capture' : 'unavailable'}`}>
            {isOwned ? <span>✦</span> : canShoot ? <span className="frontier-cross">＋</span> : null}
          </button>
        })}
        {flying !== null && <div className="arena-arrow" style={{left: `${((flying % COLS) + .5) / COLS * 100}%`, top: `${(Math.floor(flying / COLS) + .5) / ROWS * 100}%`}}>➤</div>}
        <div className="arena-archer" aria-hidden="true">🏹</div>
        {gameOver && <div className="arena-overlay"><div><Trophy size={38}/><h3>{percent >= 55 ? 'Kingdom conquered!' : 'Battle complete!'}</h3><p>You captured {owned.length} of {TOTAL} tiles and scored {score} points.</p><button className="button button-gold" onClick={reset}>Play again</button></div></div>}
        {!started && !gameOver && <div className="arena-start-hint"><span>🏹</span><b>YOUR KINGDOM STARTS HERE</b><small>Tap a glowing tile to fire</small></div>}
      </div>
      <div className="arena-footer"><div><Zap size={15}/><span>{message}</span></div><strong>LEVEL {level} <i>•</i> BEST COMBO {bestCombo}×</strong></div>
    </section>
    <div className="arena-howto"><div><span>01</span><h3>Pick a frontier</h3><p>Only tiles touching your territory can be targeted. Plan your expansion route.</p></div><div><span>02</span><h3>Fire your arrow</h3><p>Each shot captures the target and may trigger a bonus chain capture nearby.</p></div><div><span>03</span><h3>Own the arena</h3><p>Capture 55% of the board to reach Level 2. Score as much as you can before time runs out.</p></div></div>
    <p className="arena-disclaimer">Single-player arcade mode • Your score is local to this play session.</p>
  </main>
}
