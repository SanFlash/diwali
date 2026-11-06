import { useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ExperienceFX() {
  const progress = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (progress.current) {
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: self => gsap.set(progress.current, { scaleX: self.progress })
        })
      }
      if (back.current) {
        gsap.set(back.current, { autoAlpha: 0, y: 12 })
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: '+=240',
          onUpdate: self => gsap.to(back.current, { autoAlpha: self.progress, y: 12 * (1 - self.progress), duration: .18, overwrite: true })
        })
      }
      const targets = gsap.utils.toArray<HTMLElement>('.meaning-card, .story-chapter, .wish-card, .celebrate-block, .wish-generator, .brand-message-section, .home-cta, .showcase-card')
      targets.forEach((element, index) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: 48, rotateX: 3, transformPerspective: 900 },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: .85, delay: (index % 3) * .07, ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true } }
        )
      })
    })
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [pathname])
  return <>
    <div ref={progress} className="experience-progress" />
    <button ref={back} className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={18}/></button>
  </>
}
