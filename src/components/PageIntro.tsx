import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export default function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
 const ref=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!ref.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return; const ctx=gsap.context(()=>{gsap.from('.intro-eyebrow',{y:18,opacity:0,duration:.7,ease:'power3.out'});gsap.from('.intro-title',{y:36,opacity:0,duration:1,ease:'power3.out',delay:.12});gsap.from('.intro-description',{y:20,opacity:0,duration:.8,delay:.25})},ref);return()=>ctx.revert()},[])
 return <div className="page-intro" ref={ref}><span className="eyebrow intro-eyebrow">{eyebrow}</span><h1 className="display intro-title">{title}</h1><p className="intro-description">{description}</p></div>
}