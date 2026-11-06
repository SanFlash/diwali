import { motion } from 'framer-motion'
export default function Diya({ lit = true, onClick, size = 'large' }: { lit?: boolean; onClick?: () => void; size?: 'small'|'large' }) {
  return <motion.button type="button" className={`diya-button diya-${size} ${lit?'is-lit':''}`} onClick={onClick} aria-label={lit?'A glowing diya':'Light the diya'} whileHover={{scale:1.045}} whileTap={{scale:.96}}>
    <span className="diya-aura" />
    <svg viewBox="0 0 300 210" role="img" aria-hidden="true" className="diya-svg">
      <defs>
        <linearGradient id="bowl" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ffd98b"/><stop offset=".35" stopColor="#c87929"/><stop offset="1" stopColor="#74351d"/></linearGradient>
        <radialGradient id="flame"><stop stopColor="#fff8cb"/><stop offset=".35" stopColor="#ffd36b"/><stop offset="1" stopColor="#ff7a21" stopOpacity=".1"/></radialGradient>
      </defs>
      <ellipse cx="150" cy="182" rx="94" ry="13" fill="#d58a37" opacity=".2"/>
      <path d="M48 126 Q150 202 252 126 Q239 187 150 190 Q61 187 48 126Z" fill="url(#bowl)" stroke="#ffda91" strokeWidth="3"/>
      <path d="M48 126 Q150 163 252 126" fill="none" stroke="#ffe6ae" strokeWidth="4"/>
      <path d="M150 126 C115 91 151 57 153 16 C193 59 190 93 150 126Z" fill={lit?'url(#flame)':'#4a2c25'} className="diya-flame"/>
      <path d="M150 120 C138 92 157 76 158 52 C177 83 171 103 150 120Z" fill={lit?'#fff5c2':'#35221d'} opacity=".9"/>
      <path d="M150 126 Q148 114 150 101" stroke="#6b371b" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="150" cy="126" r="5" fill="#fff1bd"/>
    </svg>
    <span className="diya-caption">{lit?'A little light, a lot of hope':'Tap to light your diya'}</span>
  </motion.button>
}