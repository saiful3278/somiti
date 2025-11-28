import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

const applyResponsiveRootFont = () => {
  const w = window.innerWidth
  const dpr = window.devicePixelRatio || 1
  let base = w / 520
  if (dpr >= 3 && w <= 400) base -= 0.04
  if (dpr >= 3.5 && w <= 360) base -= 0.06
  base = Math.max(0.8, Math.min(1, base))
  const percent = Math.round(base * 10000) / 100
  document.documentElement.style.fontSize = percent + '%'
  console.log('[ResponsiveRootFont]', { width: w, dpr, base, fontSizePercent: percent })
}

if (!window.__responsiveRootFontAttached) {
  window.addEventListener('resize', applyResponsiveRootFont)
  window.addEventListener('orientationchange', applyResponsiveRootFont)
  window.__responsiveRootFontAttached = true
}
applyResponsiveRootFont()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
