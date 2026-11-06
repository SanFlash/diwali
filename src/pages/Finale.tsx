import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, Sparkles, Heart } from 'lucide-react'
import Diya from '../components/Diya'
import Fireworks from '../components/Fireworks'
export default function Finale(){
 const ref=useRef<HTMLElement>(null)
 useEffect(()=>{if(!ref.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ctx=gsap.context(()=>{gsap.from('.finale-kicker',{opacity:0,y:20,duration:.8});gsap.from('.finale-title span',{opacity:0,y:70,rotateX:-25,stagger:.16,duration:1.2,ease:'power3.out',delay:.2});gsap.from('.finale-message,.finale-brand',{opacity:0,y:24,duration:1,delay:.9,stagger:.2})},ref);return()=>ctx.revert()},[])
 return <section className="finale-page" ref={ref}><Fireworks active/><div className="finale-mandala"/><div className="finale-content"><span className="eyebrow finale-kicker"><Sparkles size={14}/> A CELEBRATION OF LIGHT & POSSIBILITY</span><h1 className="display finale-title"><span>Lights of happiness.</span><span className="gold-text">Dreams of tomorrow.</span><span>Together, we shine brighter.</span></h1><div className="finale-diya"><Diya/></div><p className="finale-message">May this festival of lights bring happiness, prosperity, good health, meaningful opportunities and endless success to you and your loved ones.</p><div className="finale-brand"><strong>AM WEBTECH</strong><span>WISHES YOU AND YOUR FAMILY</span><b>A VERY HAPPY DIWALI</b></div><p className="finale-thanks">Thank you for being part of our journey. <Heart size={13} fill="currentColor"/></p><Link to="/" className="button button-ghost"><ArrowLeft size={16}/> Back to the beginning</Link></div><div className="finale-footnote">LIGHT • JOY • TOGETHERNESS • NEW BEGINNINGS</div></section>
}