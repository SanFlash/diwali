import { useEffect, useRef } from 'react'
type Particle = { x:number; y:number; vx:number; vy:number; life:number; max:number; hue:number; size:number }
export default function Fireworks({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, raf = 0, tick = 0
    const particles: Particle[] = []
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.7)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr)
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    const burst = (x:number,y:number,count=42) => {
      for(let i=0;i<count;i++){
        const angle = Math.PI*2*i/count + Math.random()*.12
        const speed = 1.2 + Math.random()*3.5
        particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,max:55+Math.random()*35,hue:[34,42,12,350,205][Math.floor(Math.random()*5)],size:1+Math.random()*2.1})
      }
    }
    const onClick = (e:MouseEvent) => {
      const r=canvas.getBoundingClientRect()
      burst(e.clientX-r.left,e.clientY-r.top,65)
    }
    resize()
    canvas.addEventListener('click', onClick)
    const draw = () => {
      tick++
      ctx.clearRect(0,0,width,height)
      if(active && !reduced && tick%92===0) burst(Math.random()*width,width?height*(.18+Math.random()*.36):150,32)
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy; p.vy+=.025; p.vx*=.992
        const alpha=Math.max(0,1-p.life/p.max)
        ctx.beginPath(); ctx.fillStyle=`hsla(${p.hue},95%,68%,${alpha})`; ctx.shadowBlur=12; ctx.shadowColor=`hsla(${p.hue},100%,65%,${alpha})`
        ctx.arc(p.x,p.y,p.size*alpha,0,Math.PI*2); ctx.fill()
        if(p.life>=p.max) particles.splice(i,1)
      }
      ctx.shadowBlur=0
      if(!reduced) raf=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener('click',onClick) }
  }, [active])
  return <canvas ref={canvasRef} className="fireworks-canvas" aria-label="Interactive fireworks; click to launch a burst" />
}