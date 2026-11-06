import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Volume2, VolumeX } from 'lucide-react'
import Brand from './Brand'
const links=[['Home','/'],['The Story','/story'],['Wishes','/wishes'],['Celebrate','/celebrate'],['Finale','/finale'],['Playground','/playground'],['Arrow Arena','/arrow-arena']]
export default function Navbar({sound,setSound}:{sound:boolean;setSound:(v:boolean)=>void}) {
 const [open,setOpen]=useState(false)
 return <header className="site-header">
  <div className="nav-inner">
   <Brand/>
   <nav className={`nav-links ${open?'open':''}`} aria-label="Main navigation">
    {links.map(([label,path])=><NavLink key={path} to={path} end={path==='/'} onClick={()=>setOpen(false)}>{label}</NavLink>)}
   </nav>
   <div className="nav-actions">
    <button className="sound-toggle" onClick={()=>setSound(!sound)} aria-label={sound?'Mute festive sound':'Enable festive sound'} title={sound?'Mute sound':'Enable sound'}>{sound?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>{sound?'Sound on':'Sound off'}</span></button>
    <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'}>{open?<X/>:<Menu/>}</button>
   </div>
  </div>
 </header>
}