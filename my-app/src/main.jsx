import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Welcome from './Welcome.jsx'
import Continue from './Continue.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Welcome />
    <Continue />
  </StrictMode>,
)
