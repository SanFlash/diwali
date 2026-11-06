import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Check, Copy, Flame, Heart, Palette, Send, Sparkles, Trophy, WandSparkles } from 'lucide-react'
import PageIntro from '../components/PageIntro'

const palettes = [
  { name: 'Royal gold', accent: '#f2c777', glow: 'rgba(242,199,119,.22)' },
  { name: 'Peacock', accent: '#71d2cf', glow: 'rgba(113,210,207,.2)' },
  { name: 'Lotus pink', accent: '#f19ab4', glow: 'rgba(241,154,180,.2)' },
  { name: 'Saffron', accent: '#ff9d54', glow: 'rgba(255,157,84,.2)' },
  { name: 'Mystic violet', accent: '#b8a2ff', glow: 'rgba(184,162,255,.2)' },
]
const quiz = [
  { q: 'What does a lit diya commonly symbolize?', options: ['Hope and the victory of light', 'The arrival of monsoon', 'The start of winter'], answer: 0, note: 'A diya is a symbol of hope, knowledge and light overcoming darkness.' },
  { q: 'What colourful art is often created at the entrance of homes?', options: ['Madhubani only', 'Rangoli', 'Warli mural'], answer: 1, note: 'Rangoli welcomes guests with colour, creativity and auspicious patterns.' },
  { q: 'Which phrase is a traditional Diwali greeting?', options: ['Shubh Deepawali', 'Shubh Yatra', 'Namaste Sada'], answer: 0, note: 'Shubh Deepawali means an auspicious and happy Diwali.' },
]
const blessings = [
  'May your home glow with peace, laughter and prosperity.',
  'May every new beginning bring you closer to your brightest dreams.',
  'May kindness travel far and return to you a thousand times.',
  'May your family find health, harmony and happiness in every season.',
  'May your ideas shine, your courage grow and your journey flourish.',
]
export default function FestivalPlayground() {
  const root = useRef<HTMLElement>(null)
  const [lit, setLit] = useState<number[]>([2, 7, 11])
  const [palette, setPalette] = useState(palettes[0])
  const [wishName, setWishName] = useState('')
  const [wishText, setWishText] = useState('')
  const [wishes, setWishes] = useState(['May every home be filled with light ✨', 'Wishing everyone joy, peace and new beginnings 🪔'])
  const [question, setQuestion] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [blessing, setBlessing] = useState(blessings[0])
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.playground-panel', { y: 48, opacity: 0, stagger: .14, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
      gsap.to('.playground-decor', { rotation: 360, duration: 65, repeat: -1, ease: 'none' })
      gsap.to('.playground-star', { y: -18, opacity: .45, duration: 2.2, yoyo: true, repeat: -1, stagger: .18, ease: 'sine.inOut' })
    }, root)
    return () => ctx.revert()
  }, [])
  const total = 18
  const progress = useMemo(() => Math.round(lit.length / total * 100), [lit.length])
  const toggleDiya = (id: number) => setLit(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const addWish = () => {
    if (!wishText.trim()) return
    setWishes(current => [`${wishName.trim() ? wishName.trim() + ': ' : ''}${wishText.trim()}`, ...current].slice(0, 8))
    setWishText('')
    setWishName('')
  }
  const chooseAnswer = (choice: number) => {
    if (answer !== null) return
    setAnswer(choice)
    if (choice === quiz[question].answer) setScore(value => value + 1)
  }
  const nextQuestion = () => {
    if (question === quiz.length - 1) setQuizDone(true)
    else { setQuestion(value => value + 1); setAnswer(null) }
  }
  const resetQuiz = () => { setQuestion(0); setAnswer(null); setScore(0); setQuizDone(false) }
  const copyBlessing = async () => {
    try { await navigator.clipboard.writeText(blessing); setCopied(true); window.setTimeout(() => setCopied(false), 1600) } catch { setCopied(false) }
  }
  return <main ref={root} className="inner-page playground-page" style={{ '--play-accent': palette.accent, '--play-glow': palette.glow } as React.CSSProperties}>
    <div className="playground-backdrop" aria-hidden="true"><span className="playground-decor">✺</span><span className="playground-star star-one">✦</span><span className="playground-star star-two">✧</span><span className="playground-star star-three">✦</span></div>
    <PageIntro eyebrow="THE FESTIVAL PLAYGROUND" title={<>A little wonder.<br/><em>A lot of Diwali magic.</em></>} description="Explore, create, play and spread the light. This is your interactive corner of the AM Webtech Diwali celebration."/>
    <section className="playground-panel">
      <div className="playground-panel-heading"><span className="eyebrow"><Palette size={14}/> 01 / PICK YOUR FESTIVAL MOOD</span><h2 className="display">Colour your <em>celebration.</em></h2><p>Choose a glowing colour world. The playground changes with your mood.</p></div>
      <div className="palette-options">{palettes.map(item => <button key={item.name} className={palette.name === item.name ? 'palette-swatch selected' : 'palette-swatch'} onClick={() => setPalette(item)} style={{ '--swatch': item.accent } as React.CSSProperties}><span/><b>{item.name}</b>{palette.name === item.name && <Check size={14}/>}</button>)}</div>
    </section>
    <section className="playground-panel">
      <div className="playground-panel-heading"><span className="eyebrow"><Flame size={14}/> 02 / THE GARDEN OF LIGHT</span><h2 className="display">Light up the <em>night.</em></h2><p>Tap each diya to light it. Watch your garden glow brighter with every flame.</p></div>
      <div className="diya-garden">{Array.from({length: total}, (_, id) => <button key={id} className={lit.includes(id) ? 'garden-diya lit' : 'garden-diya'} onClick={() => toggleDiya(id)} aria-label={lit.includes(id) ? 'Extinguish diya' : 'Light diya'}><span className="garden-flame"/><span className="garden-bowl"><i/></span></button>)}</div>
      <div className="garden-progress"><div className="garden-progress-copy"><strong>{lit.length} / {total} diyas glowing</strong><span>{progress}% of your garden illuminated</span></div><div className="garden-track"><span style={{ width: progress + '%' }}/></div><button className="text-button" onClick={() => setLit(lit.length === total ? [] : Array.from({length: total}, (_, i) => i))}>{lit.length === total ? 'Reset the garden' : 'Light every diya'} <Sparkles size={14}/></button></div>
    </section>
    <section className="playground-panel">
      <div className="playground-panel-heading"><span className="eyebrow"><Heart size={14}/> 03 / THE WISH WALL</span><h2 className="display">Send a little <em>light forward.</em></h2><p>Leave a kind message for the celebration. Wishes added here appear in this browser session.</p></div>
      <div className="wish-wall-form"><input value={wishName} onChange={e => setWishName(e.target.value)} placeholder="Your name (optional)" aria-label="Your name"/><textarea value={wishText} onChange={e => setWishText(e.target.value)} maxLength={150} placeholder="Write a warm Diwali wish..." aria-label="Your Diwali wish"/><button className="button button-gold" onClick={addWish} disabled={!wishText.trim()}><Send size={15}/> Add my wish</button></div>
      <div className="wish-wall-list">{wishes.map((item, index) => <article key={index} className="wish-wall-note"><span>✦</span><p>{item}</p></article>)}</div>
    </section>
    <section className="playground-panel">
      <div className="playground-panel-heading"><span className="eyebrow"><WandSparkles size={14}/> 04 / THE BLESSING GENERATOR</span><h2 className="display">A blessing for <em>your next chapter.</em></h2><p>Tap to reveal a fresh festive thought, then copy or share it.</p></div>
      <div className="blessing-card"><span className="blessing-star">✺</span><p>{blessing}</p><div><button className="button button-gold" onClick={() => setBlessing(blessings[Math.floor(Math.random() * blessings.length)])}><Sparkles size={15}/> New blessing</button><button className="button button-ghost" onClick={copyBlessing}><Copy size={15}/> {copied ? 'Copied' : 'Copy blessing'}</button></div></div>
    </section>
    <section className="playground-panel">
      <div className="playground-panel-heading"><span className="eyebrow"><Trophy size={14}/> 05 / FESTIVAL MINI QUIZ</span><h2 className="display">How much Diwali <em>do you know?</em></h2><p>Three quick questions. One little celebration of tradition.</p></div>
      {quizDone ? <div className="quiz-result"><Trophy size={38}/><strong>{score} / {quiz.length}</strong><p>{score === quiz.length ? 'Perfect score! You are a Diwali star.' : 'Beautiful effort. Every festival is a chance to learn something new.'}</p><button className="button button-gold" onClick={resetQuiz}>Play again</button></div> : <div className="quiz-card"><div className="quiz-progress">QUESTION {question + 1} OF {quiz.length}</div><h3>{quiz[question].q}</h3><div className="quiz-options">{quiz[question].options.map((option, index) => <button key={option} className={answer === null ? '' : index === quiz[question].answer ? 'correct' : answer === index ? 'incorrect' : ''} onClick={() => chooseAnswer(index)} disabled={answer !== null}>{option}</button>)}</div>{answer !== null && <div className="quiz-feedback"><p>{quiz[question].note}</p><button className="button button-gold" onClick={nextQuestion}>{question === quiz.length - 1 ? 'See my score' : 'Next question'}</button></div>}</div>}
    </section>
    <div className="playground-signoff"><Sparkles size={16}/><p>Keep spreading kindness. Keep creating light. Keep celebrating together.</p><span>AM WEBTECH • HAPPY DIWALI</span></div>
  </main>
}
