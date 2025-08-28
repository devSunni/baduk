import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import styled from 'styled-components'

const BoardWrapper = styled.div`
  width: 100%;
  max-width: 720px;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`

const BadukBoard = forwardRef(({ 
  boardSize = 19,
  stones = [], // { x: 1-based, y: 1-based, color: 'black'|'white', moveNumber?: number|null }
  onStonePlace,
  disabled = false,
  showHint = false,
  hintMove = null,
  showCoordinates = true,
  showMoveNumbers = true,
  theme = 'wood' // 'wood' | 'dark'
}, ref) => {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1)

  useImperativeHandle(ref, () => ({
    exportAsImage: () => {
      const canvas = canvasRef.current
      if (!canvas) return null
      return canvas.toDataURL('image/png')
    }
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const resize = () => {
      const { clientWidth, clientHeight } = wrapper
      canvas.width = Math.floor(clientWidth * devicePixelRatio)
      canvas.height = Math.floor(clientHeight * devicePixelRatio)
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)
    resize()
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize, stones, showHint, hintMove, showCoordinates, showMoveNumbers, theme])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const padding = Math.round(w * 0.06)
    const gridSize = Math.min(w, h) - padding * 2
    const cell = gridSize / (boardSize - 1)

    // background theme
    if (theme === 'dark') {
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, '#2b2f36')
      grad.addColorStop(1, '#1f2228')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, '#e6d3a3')
      grad.addColorStop(1, '#d1b87a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }

    // grid lines
    ctx.strokeStyle = theme === 'dark' ? '#a7b0bf' : '#644c27'
    ctx.lineWidth = Math.max(1, Math.floor(cell * 0.04))
    for (let i = 0; i < boardSize; i++) {
      const xy = Math.round(padding + i * cell)
      ctx.beginPath()
      ctx.moveTo(Math.round(padding), xy)
      ctx.lineTo(Math.round(padding + (boardSize - 1) * cell), xy)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xy, Math.round(padding))
      ctx.lineTo(xy, Math.round(padding + (boardSize - 1) * cell))
      ctx.stroke()
    }

    // star points
    const starPoints = getStarPoints(boardSize)
    ctx.fillStyle = theme === 'dark' ? '#c4ccd9' : '#3b2a16'
    starPoints.forEach(([sx, sy]) => {
      const [px, py] = toPixel(sx, sy, padding, cell)
      ctx.beginPath()
      ctx.arc(Math.round(px), Math.round(py), Math.max(2, Math.floor(cell * 0.12)), 0, Math.PI * 2)
      ctx.fill()
    })

    // coordinates
    if (showCoordinates) {
      ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
      ctx.font = `${Math.floor(cell * 0.4)}px system-ui, -apple-system, Segoe UI, Roboto`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = 1; i <= boardSize; i++) {
        const [pxTop, pyTop] = toPixel(i, 1, padding, cell)
        const [pxLeft, pyLeft] = toPixel(1, i, padding, cell)
        ctx.fillText(String(i), Math.round(pxTop), Math.round(pyTop - cell * 0.8))
        ctx.fillText(String(i), Math.round(pxLeft - cell * 0.8), Math.round(pyLeft))
      }
    }

    // hint
    if (showHint && hintMove && hintMove.x >= 1 && hintMove.x <= boardSize && hintMove.y >= 1 && hintMove.y <= boardSize) {
      const [hx, hy] = toPixel(hintMove.x, hintMove.y, padding, cell)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)'
      ctx.lineWidth = Math.max(2, Math.floor(cell * 0.08))
      ctx.arc(Math.round(hx), Math.round(hy), Math.max(cell * 0.35, 8), 0, Math.PI * 2)
      ctx.stroke()
    }

    // stones
    stones.forEach(stone => {
      if (!stone || stone.x < 1 || stone.y < 1 || stone.x > boardSize || stone.y > boardSize) return
      const [px, py] = toPixel(stone.x, stone.y, padding, cell)
      const radius = Math.max(4, cell * 0.42)

      const radial = ctx.createRadialGradient(px - radius * 0.3, py - radius * 0.3, radius * 0.2, px, py, radius)
      if (stone.color === 'black') {
        radial.addColorStop(0, theme === 'dark' ? '#888' : '#666')
        radial.addColorStop(1, '#111')
      } else {
        radial.addColorStop(0, '#fff')
        radial.addColorStop(1, '#ddd')
      }
      ctx.beginPath()
      ctx.fillStyle = radial
      ctx.arc(Math.round(px), Math.round(py), Math.round(radius), 0, Math.PI * 2)
      ctx.fill()

      if (showMoveNumbers && stone.moveNumber && Number.isFinite(stone.moveNumber)) {
        ctx.fillStyle = stone.color === 'black' ? '#ffffff' : '#000000'
        ctx.font = `bold ${Math.floor(radius * 0.95)}px system-ui, -apple-system, Segoe UI, Roboto`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(stone.moveNumber), Math.round(px), Math.round(py))
      }
    })
  }

  const toPixel = (x, y, padding, cell) => {
    const px = padding + (x - 1) * cell
    const py = padding + (y - 1) * cell
    return [px, py]
  }

  const handleClick = (e) => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const cx = (e.clientX - rect.left) * scaleX
    const cy = (e.clientY - rect.top) * scaleY

    const padding = Math.round(canvas.width * 0.06)
    const gridSize = canvas.width - padding * 2
    const cell = gridSize / (boardSize - 1)

    const ix = Math.round((cx - padding) / cell) + 1
    const iy = Math.round((cy - padding) / cell) + 1

    if (ix < 1 || iy < 1 || ix > boardSize || iy > boardSize) return
    onStonePlace && onStonePlace(ix, iy)
  }

  return (
    <BoardWrapper ref={wrapperRef}>
      <Canvas ref={canvasRef} onClick={handleClick} />
    </BoardWrapper>
  )
})

function getStarPoints(n) {
  if (n === 19) return [[4,4],[10,4],[16,4],[4,10],[10,10],[16,10],[4,16],[10,16],[16,16]]
  if (n === 13) return [[4,4],[7,4],[10,4],[4,7],[7,7],[10,7],[4,10],[7,10],[10,10]]
  if (n === 9) return [[3,3],[5,3],[7,3],[3,5],[5,5],[7,5],[3,7],[5,7],[7,7]]
  return []
}

export default BadukBoard 