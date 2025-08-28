import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null

if (!(params && params.get('nosw') === '1')) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true)
    }
  })
  if (params && params.get('nocache') === '1') {
    updateSW(true)
    setTimeout(() => location.replace(location.origin + location.pathname), 200)
  }
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  const fb = document.getElementById('fallback')
  if (fb) fb.style.display = 'none'
}

try {
  render()
} catch (err) {
  console.error(err)
  const fb = document.getElementById('fallback')
  if (fb) fb.textContent = '로딩 중 오류가 발생했습니다: ' + (err?.message || String(err))
} 