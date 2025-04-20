import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styling/global/global.scss'
import App from './pages/app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
