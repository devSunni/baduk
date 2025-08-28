import React, { useCallback, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import BadukBoard from './BadukBoard'

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
`

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`

const Button = styled.button`
  background: ${p => p.variant === 'primary' ? 'rgba(46, 204, 113, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${p => p.variant === 'primary' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

const Tip = styled.div`
  color: rgba(255,255,255,0.85);
  text-align: center;
`

const ManualMode = ({ boardSize = 19 }) => {
  const [stones, setStones] = useState([])
  const [nextMoveNumber, setNextMoveNumber] = useState(1)
  const [nextColor, setNextColor] = useState('black')
  const boardRef = useRef(null)

  useEffect(() => {
    // 보드 크기 바뀌면 초기화
    handleReset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize])

  const isOccupied = useCallback((x, y) => {
    return stones.some(s => s.x === x && s.y === y)
  }, [stones])

  const handlePlace = useCallback((x, y) => {
    if (isOccupied(x, y)) return
    const newStone = { x, y, color: nextColor, moveNumber: nextMoveNumber }
    setStones(prev => [...prev, newStone])
    setNextMoveNumber(n => n + 1)
    setNextColor(c => c === 'black' ? 'white' : 'black')
  }, [isOccupied, nextColor, nextMoveNumber])

  const handleReset = () => {
    setStones([])
    setNextMoveNumber(1)
    setNextColor('black')
  }

  const handleUndo = () => {
    setStones(prev => prev.slice(0, -1))
    setNextMoveNumber(n => Math.max(1, n - 1))
    setNextColor(c => c === 'black' ? 'white' : 'black')
  }

  const handleSaveImage = () => {
    const dataUrl = boardRef.current?.exportAsImage?.()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `manual_${boardSize}x${boardSize}.png`
    a.click()
  }

  return (
    <Wrapper>
      <Controls>
        <Button onClick={handleUndo}>되돌리기</Button>
        <Button onClick={handleReset}>초기화</Button>
        <Button variant="primary" onClick={handleSaveImage}>그림으로 저장</Button>
      </Controls>
      <BadukBoard
        ref={boardRef}
        boardSize={boardSize}
        stones={stones}
        onStonePlace={handlePlace}
      />
      <Tip>돌을 눌러 자유롭게 두세요. 색은 자동으로 번갈아 둡니다.</Tip>
    </Wrapper>
  )
}

export default ManualMode 