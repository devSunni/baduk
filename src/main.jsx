import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  }
})

// emergency refresh on ?nocache=1
if (typeof window !== 'undefined' && new URLSearchParams(location.search).get('nocache') === '1') {
  updateSW(true)
  setTimeout(() => location.replace(location.origin + location.pathname), 200)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 