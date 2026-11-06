export default function Brand({ compact = false }: { compact?: boolean }) {
  return <a className={`brand-lockup ${compact ? 'compact' : ''}`} href="https://amwebtech.com/" target="_blank" rel="noreferrer" aria-label="AM Webtech official website">
    <img
      className="brand-logo"
      src="https://raw.githubusercontent.com/SanFlash/amwebtech-experience/main/public/amwebtech-logo.png"
      alt="AM Webtech"
      onError={event => { event.currentTarget.style.display = 'none'; const fallback = event.currentTarget.nextElementSibling as HTMLElement | null; if (fallback) fallback.style.display = 'block' }}
    />
    <span className="brand-fallback">AM<span>WEBTECH</span><small>QUALITY • INNOVATION • TRUST</small></span>
  </a>
}
