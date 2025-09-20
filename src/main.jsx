import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Pattern.jsx'
import Pattern from './Pattern.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Pattern />
  </StrictMode>,
)
