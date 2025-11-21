import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

const applyResponsiveRootFont = () => {
  const w = window.innerWidth
  let size = '100%'
  if (w <= 340) {
    size = '81.25%'
  } else if (w <= 360) {
    size = '87.5%'
  } else if (w <= 375) {
    size = '93.75%'
  }
  document.documentElement.style.fontSize = size
  console.log('[ResponsiveRootFont]', { width: w, fontSize: size, dpr: window.devicePixelRatio })
}

window.addEventListener('resize', applyResponsiveRootFont)
window.addEventListener('orientationchange', applyResponsiveRootFont)
applyResponsiveRootFont()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
