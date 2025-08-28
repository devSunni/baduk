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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
  width: 100%;
  max-width: 720px;
`

const Button = styled.button`
  background: ${p => p.variant === 'primary' ? 'rgba(46, 204, 113, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${p => p.variant === 'primary' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`

const Label = styled.label`
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
`

const Checkbox = styled.input``

const Tip = styled.div`
  color: rgba(255,255,255,0.85);
  text-align: center;
`

const ManualMode = ({ boardSize = 19 }) => {
  const [stones, setStones] = useState([])
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [nextMoveNumber, setNextMoveNumber] = useState(1)
  const [autoColor, setAutoColor] = useState(true)
  const [currentColor, setCurrentColor] = useState('black')
  const [eraser, setEraser] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const [showMoveNumbers, setShowMoveNumbers] = useState(true)
  const [theme, setTheme] = useState('wood')
  const boardRef = useRef(null)

  useEffect(() => {
    handleReset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize])

  const isOccupied = useCallback((x, y) => {
    return stones.some(s => s.x === x && s.y === y)
  }, [stones])

  const pushUndo = useCallback((prev) => {
    setUndoStack(stack => [...stack, prev])
    setRedoStack([])
  }, [])

  const handlePlace = useCallback((x, y) => {
    if (eraser) {
      if (!isOccupied(x, y)) return
      pushUndo({ stones, nextMoveNumber, autoColor, currentColor })
      setStones(prev => prev.filter(s => !(s.x === x && s.y === y)))
      return
    }

    if (isOccupied(x, y)) return
    const color = autoColor ? (nextMoveNumber % 2 === 1 ? 'black' : 'white') : currentColor
    const newStone = { x, y, color, moveNumber: nextMoveNumber }
    pushUndo({ stones, nextMoveNumber, autoColor, currentColor })
    setStones(prev => [...prev, newStone])
    setNextMoveNumber(n => n + 1)
    if (!autoColor) {
      setCurrentColor(c => c === 'black' ? 'white' : 'black')
    }
  }, [autoColor, currentColor, eraser, isOccupied, nextMoveNumber, pushUndo, stones])

  const handleReset = () => {
    setStones([])
    setUndoStack([])
    setRedoStack([])
    setNextMoveNumber(1)
    setCurrentColor('black')
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(stack => stack.slice(0, -1))
    setRedoStack(stack => [...stack, { stones, nextMoveNumber, autoColor, currentColor }])
    setStones(prev.stones)
    setNextMoveNumber(prev.nextMoveNumber)
    setCurrentColor(prev.currentColor)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(stack => stack.slice(0, -1))
    setUndoStack(stack => [...stack, { stones, nextMoveNumber, autoColor, currentColor }])
    setStones(next.stones)
    setNextMoveNumber(next.nextMoveNumber)
    setCurrentColor(next.currentColor)
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
        <Button onClick={handleRedo}>다시실행</Button>
        <Button onClick={handleReset}>초기화</Button>
        <Button onClick={() => setEraser(e => !e)}>{eraser ? '지우개 종료' : '지우개 모드'}</Button>
        <Button onClick={handleSaveImage} variant="primary">그림으로 저장</Button>
      </Controls>

      <Row>
        <Label>
          <Checkbox type="checkbox" checked={autoColor} onChange={(e) => setAutoColor(e.target.checked)} />
          자동 색 번갈아 두기
        </Label>
        {!autoColor && (
          <Select value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}>
            <option value="black">흑</option>
            <option value="white">백</option>
          </Select>
        )}
      </Row>

      <Row>
        <Label>
          <Checkbox type="checkbox" checked={showMoveNumbers} onChange={(e) => setShowMoveNumbers(e.target.checked)} />
          수순 번호 표시
        </Label>
        <Label>
          <Checkbox type="checkbox" checked={showCoordinates} onChange={(e) => setShowCoordinates(e.target.checked)} />
          좌표 표시
        </Label>
        <Label>
          테마
          <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="wood">우드</option>
            <option value="dark">다크</option>
          </Select>
        </Label>
      </Row>

      <BadukBoard
        ref={boardRef}
        boardSize={boardSize}
        stones={stones}
        onStonePlace={handlePlace}
        showCoordinates={showCoordinates}
        showMoveNumbers={showMoveNumbers}
        theme={theme}
      />

      <Tip>돌을 눌러 자유롭게 두세요. 자동/수동 색 전환, 지우개, 좌표/수순 토글, PNG 저장을 지원합니다.</Tip>
    </Wrapper>
  )
}

export default ManualMode 