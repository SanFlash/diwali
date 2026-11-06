import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Sparkles, Sun, HeartHandshake, Lightbulb } from 'lucide-react'
import { gsap } from 'gsap'
import Diya from '../components/Diya'
import FestivalShowcase from '../components/FestivalShowcase'
export default function Home(){
 const hero=useRef<HTMLElement>(null)
 useEffect(()=>{if(!hero.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ctx=gsap.context(()=>{const tl=gsap.timeline({defaults:{ease:'power3.out'}});tl.from('.hero-kicker',{y:18,opacity:0,duration:.7}).from('.hero-title .line',{y:90,opacity:0,rotateX:-35,stagger:.13,duration:1.1},'-=.3').from('.hero-copy,.hero-actions',{y:22,opacity:0,duration:.8,stagger:.15},'-=.45').from('.hero-diya',{scale:.75,opacity:0,duration:1.2},'-=1').from('.hero-orbit',{scale:.65,opacity:0,duration:1.3},'-=1')},hero);return()=>ctx.revert()},[])
 return <div className="home-page">
  <section className="hero-section" ref={hero}>
   <div className="hero-grid"/>
   <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
   <div className="hero-copy-wrap">
    <span className="eyebrow hero-kicker"><Sparkles size={14}/> A FESTIVAL OF LIGHT, HOPE & NEW BEGINNINGS</span>
    <h1 className="display hero-title"><span className="line">Let the light</span><span className="line gold-text">find its way</span><span className="line">to everything.</span></h1>
    <p className="hero-copy">This Diwali, may every little spark become a bright idea, every connection become a reason to celebrate, and every new beginning lead to something extraordinary.</p>
    <div className="hero-actions"><Link to="/celebrate" className="button button-gold">Experience the magic <ArrowRight size={17}/></Link><Link to="/wishes" className="button button-ghost">Explore wishes</Link></div>
    <div className="hero-signoff"><span className="signoff-rule"/> <span>AM Webtech wishes you a very Happy Diwali</span></div>
   </div>
   <div className="hero-art hero-diya"><div className="mandala mandala-large"/><div className="hero-halo"/><Diya size="large"/><div className="floating-note note-a">शुभ दीपावली</div><div className="floating-note note-b">LIGHT • JOY • TOGETHERNESS</div></div>
   <a href="#meaning" className="scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
  </section>
  <section className="meaning-section section-pad" id="meaning">
   <div className="section-heading"><span className="eyebrow">THE SPIRIT OF THE FESTIVAL</span><h2 className="display">A little light can <em>change everything.</em></h2><p>Diwali reminds us that hope is stronger than uncertainty, kindness travels further than we imagine, and together we can make every moment brighter.</p></div>
   <div className="meaning-cards">
    {[{icon:Sun,title:'Light the way',copy:'Celebrate clarity, courage and the beautiful possibilities waiting ahead.'},{icon:HeartHandshake,title:'Share the warmth',copy:'The brightest celebrations are the ones we create together.'},{icon:Lightbulb,title:'Imagine what’s next',copy:'May fresh ideas and bold beginnings illuminate the road ahead.'}].map(({icon:Icon,title,copy},i)=><article className="meaning-card reveal-card" key={title}><span className="card-index">0{i+1}</span><div className="meaning-icon"><Icon size={25}/></div><h3>{title}</h3><p>{copy}</p></article>)}
   </div>
  </section>
  <section className="brand-message-section">
   <div className="brand-message-art"><div className="mandala mandala-small"/><div className="mini-diya">✦</div></div>
   <div className="brand-message-copy"><span className="eyebrow">A NOTE FROM AM WEBTECH</span><h2 className="display">Progress is brighter <em>when we shine together.</em></h2><p>To our colleagues, clients, partners and friends — thank you for being part of our journey. May the season bring renewed energy, meaningful connections and success worth sharing.</p><Link to="/story" className="text-link">Discover the Diwali story <ArrowRight size={16}/></Link></div>
  </section>
  <FestivalShowcase/>
  <section className="playground-promo"><div className="promo-orb promo-orb-one"/><div className="promo-orb promo-orb-two"/><span className="eyebrow">YOUR FESTIVAL. YOUR MAGIC.</span><h2 className="display">Step into the <em>Diwali Playground.</em></h2><p>Light a garden of diyas, create a wish for someone you love, explore colours and take the festive quiz.</p><Link to="/playground" className="button button-gold">Enter the playground <Sparkles size={16}/></Link></section>
  <section className="home-cta section-pad"><span className="eyebrow">MAKE THIS MOMENT YOURS</span><h2 className="display">Ready to add a little <em>more light?</em></h2><p>Light a diya, create a wish and send a little Diwali magic into the world.</p><Link to="/celebrate" className="button button-gold">Celebrate with us <Sparkles size={16}/></Link></section>
 </div>
}