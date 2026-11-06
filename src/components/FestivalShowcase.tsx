import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Flame, Flower2, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  { icon: Flame, symbol: '✧', title: 'The Light Lab', copy: 'Light your diya, launch fireworks and build a little moment of magic.', link: '/celebrate', action: 'Enter the studio' },
  { icon: Flower2, symbol: '✺', title: 'Wishes in Bloom', copy: 'Explore heartfelt messages and share a festive greeting with someone special.', link: '/wishes', action: 'Explore wishes' },
  { icon: Sparkles, symbol: '✦', title: 'The Story of Light', copy: 'Travel through the meaning, traditions and spirit behind the celebration.', link: '/story', action: 'Discover the story' }
]

export default function FestivalShowcase() {
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!section.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.showcase-heading > *', { y: 30, opacity: 0, stagger: .12, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 78%', once: true } })
    }, section)
    return () => ctx.revert()
  }, [])
  return <section className="festival-showcase" ref={section}>
    <div className="showcase-heading">
      <span className="eyebrow">STEP INTO THE FESTIVAL</span>
      <h2 className="display">More than a page. <em>A whole experience.</em></h2>
      <p>Explore the festival at your own pace. Every corner has a little light waiting to be discovered.</p>
    </div>
    <div className="showcase-grid">
      {experiences.map(({ icon: Icon, symbol, title, copy, link, action }) => <motion.article key={title} className="showcase-card" whileHover={{ y: -12, rotateX: 3, rotateY: -3, scale: 1.015 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>
        <div className="showcase-card-art"><div className="showcase-orbit"/><span className="showcase-symbol">{symbol}</span></div>
        <div><h3>{title}</h3><p>{copy}</p><Link className="showcase-link" to={link}>{action} <ArrowUpRight size={15}/></Link></div>
      </motion.article>)}
    </div>
  </section>
}
