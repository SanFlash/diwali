import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageIntro from '../components/PageIntro'
import { Flame, Flower2, Stars, Sun } from 'lucide-react'
gsap.registerPlugin(ScrollTrigger)
const chapters=[{n:'01',icon:Sun,title:'The triumph of light',copy:'Across generations, Diwali has carried a timeless message: light can guide us through darkness, knowledge can overcome uncertainty, and goodness deserves to be celebrated.',tag:'HOPE & CLARITY'},{n:'02',icon:Flower2,title:'The beauty of belonging',copy:'Homes glow, doorways bloom with rangoli, and people come together. The festival is a reminder that joy becomes richer when it is shared.',tag:'CONNECTION & CARE'},{n:'03',icon:Flame,title:'The promise of a new beginning',copy:'A freshly lit diya is a small promise to begin again — with courage, gratitude and a little more faith in what lies ahead.',tag:'RENEWAL & POSSIBILITY'},{n:'04',icon:Stars,title:'A future worth illuminating',copy:'At AM Webtech, we celebrate the same spirit through curiosity, collaboration and the pursuit of better possibilities. Every bright idea starts with a spark.',tag:'INNOVATION & GROWTH'}]
export default function Story(){
 const section=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!section.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.story-chapter').forEach((el)=>{gsap.from(el,{y:55,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%',once:true}})});gsap.to('.story-glow',{yPercent:24,ease:'none',scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:true}})},section);return()=>ctx.revert()},[])
 return <div className="inner-page story-page" ref={section}><PageIntro eyebrow="A STORY THAT STILL SHINES" title={<>The magic behind<br/><em>the light.</em></>} description="More than a festival, Diwali is a feeling — a celebration of hope, togetherness, gratitude and the courage to begin again."/>
  <div className="story-feature"><div className="story-glow"/><div className="story-feature-ring"/><div className="story-feature-symbol">✦</div><p>तमसो मा ज्योतिर्गमय</p><span>LEAD US FROM DARKNESS TO LIGHT</span></div>
  <div className="story-timeline">{chapters.map(({n,icon:Icon,title,copy,tag})=><article className="story-chapter" key={n}><div className="chapter-number">{n}</div><div className="chapter-content"><span className="chapter-tag"><Icon size={14}/>{tag}</span><h2 className="display">{title}</h2><p>{copy}</p></div><div className="chapter-orb"><Icon size={35}/></div></article>)}</div>
  <div className="story-quote"><span className="eyebrow">A THOUGHT TO CARRY FORWARD</span><blockquote>“The smallest flame can make the greatest difference.”</blockquote><p>May you always find a reason to shine.</p></div>
 </div>
}