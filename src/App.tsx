import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import FestivalUniverse from './components/FestivalUniverse'
import ExperienceFX from './components/ExperienceFX'
import Shell from './components/Shell'
import Home from './pages/Home'
import Story from './pages/Story'
import Wishes from './pages/Wishes'
import Celebrate from './pages/Celebrate'
import Finale from './pages/Finale'
import FestivalPlayground from './pages/FestivalPlayground'

gsap.registerPlugin(ScrollTrigger)

function AnimatedRoutes({sound,setSound}:{sound:boolean;setSound:(v:boolean)=>void}) {
  const location=useLocation()
  return <AnimatePresence mode="wait"><motion.div key={location.pathname} className="route-transition" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.28,ease:'easeOut'}}><Routes location={location}>
    <Route element={<Shell sound={sound} setSound={setSound}/>}>
      <Route index element={<Home/>}/>
      <Route path="story" element={<Story/>}/>
      <Route path="wishes" element={<Wishes/>}/>
      <Route path="celebrate" element={<Celebrate/>}/>
      <Route path="finale" element={<Finale/>}/>
      <Route path="playground" element={<FestivalPlayground/>}/>
    </Route>
  </Routes></motion.div></AnimatePresence>
}

export default function App(){
  const [sound,setSound]=useState(false)
  useEffect(()=>{
    const lenis=new Lenis({duration:1.05,smoothWheel:true,autoRaf:true})
    lenis.on('scroll', ScrollTrigger.update)
    return()=>lenis.destroy()
  },[])
  useEffect(()=>{
    if(!sound)return
    let ctx:AudioContext|undefined
    try {
      ctx=new AudioContext()
      const now=ctx.currentTime
      ;[523.25,659.25,783.99].forEach((frequency,index)=>{
        const oscillator=ctx!.createOscillator()
        const gain=ctx!.createGain()
        const start=now+index*.22
        oscillator.type='sine'
        oscillator.frequency.value=frequency
        gain.gain.setValueAtTime(.0001,start)
        gain.gain.exponentialRampToValueAtTime(.035,start+.04)
        gain.gain.exponentialRampToValueAtTime(.0001,start+.62)
        oscillator.connect(gain);gain.connect(ctx!.destination)
        oscillator.start(start);oscillator.stop(start+.68)
      })
    } catch { /* Audio is an optional enhancement; visual experience remains complete. */ }
    return()=>{void ctx?.close()}
  },[sound])
  return <div className="app-shell"><FestivalUniverse/><ExperienceFX/><div className="ambient-grain"/><AnimatedRoutes sound={sound} setSound={setSound}/></div>
}
