import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react'
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

const Score = styled.div`
  color: rgba(255,255,255,0.95);
  text-align: center;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
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
  const [rulesEnabled, setRulesEnabled] = useState(true)
  const [showTerritory, setShowTerritory] = useState(true)
  const [showScore, setShowScore] = useState(true)
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

  const getNeighbors = useCallback((x, y) => {
    const neighbors = []
    if (x > 1) neighbors.push([x - 1, y])
    if (x < boardSize) neighbors.push([x + 1, y])
    if (y > 1) neighbors.push([x, y - 1])
    if (y < boardSize) neighbors.push([x, y + 1])
    return neighbors
  }, [boardSize])

  const keyOf = (x, y) => `${x},${y}`

  const buildStoneMaps = useCallback((stoneList) => {
    const posToStone = new Map()
    const colorAt = new Map()
    stoneList.forEach(s => {
      const k = keyOf(s.x, s.y)
      posToStone.set(k, s)
      colorAt.set(k, s.color)
    })
    return { posToStone, colorAt }
  }, [])

  const getGroupAndLiberties = useCallback((stoneList, x, y) => {
    const { posToStone } = buildStoneMaps(stoneList)
    const origin = posToStone.get(keyOf(x, y))
    if (!origin) return { stones: [], liberties: new Set() }
    const color = origin.color
    const visited = new Set()
    const stack = [[x, y]]
    const group = []
    const liberties = new Set()
    while (stack.length) {
      const [cx, cy] = stack.pop()
      const ck = keyOf(cx, cy)
      if (visited.has(ck)) continue
      visited.add(ck)
      group.push([cx, cy])
      const neighbors = getNeighbors(cx, cy)
      neighbors.forEach(([nx, ny]) => {
        const nk = keyOf(nx, ny)
        const neighborStone = posToStone.get(nk)
        if (!neighborStone) {
          liberties.add(nk)
        } else if (neighborStone.color === color) {
          if (!visited.has(nk)) stack.push([nx, ny])
        }
      })
    }
    return { stones: group, liberties }
  }, [buildStoneMaps, getNeighbors])

  const tryPlaceWithRules = useCallback((x, y, color) => {
    if (isOccupied(x, y)) return { ok: false }

    const placed = { x, y, color, moveNumber: nextMoveNumber }
    let temp = [...stones, placed]

    const opponent = color === 'black' ? 'white' : 'black'
    const neighbors = getNeighbors(x, y)
    const toRemoveKeys = new Set()
    neighbors.forEach(([nx, ny]) => {
      const neighborStone = stones.find(s => s.x === nx && s.y === ny)
      if (neighborStone && neighborStone.color === opponent) {
        const { stones: gStones, liberties } = getGroupAndLiberties(temp, nx, ny)
        if (liberties.size === 0) {
          gStones.forEach(([gx, gy]) => toRemoveKeys.add(keyOf(gx, gy)))
        }
      }
    })

    if (toRemoveKeys.size > 0) {
      temp = temp.filter(s => !toRemoveKeys.has(keyOf(s.x, s.y)))
    }

    const { liberties } = getGroupAndLiberties(temp, x, y)
    if (liberties.size === 0) {
      return { ok: false }
    }

    return { ok: true, nextStones: temp }
  }, [getGroupAndLiberties, getNeighbors, isOccupied, nextMoveNumber, stones])

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

    if (rulesEnabled) {
      const result = tryPlaceWithRules(x, y, color)
      if (!result.ok) return
      pushUndo({ stones, nextMoveNumber, autoColor, currentColor })
      setStones(result.nextStones)
    } else {
      pushUndo({ stones, nextMoveNumber, autoColor, currentColor })
      setStones(prev => [...prev, newStone])
    }

    setNextMoveNumber(n => n + 1)
    if (!autoColor) {
      setCurrentColor(c => c === 'black' ? 'white' : 'black')
    }
  }, [autoColor, currentColor, eraser, isOccupied, nextMoveNumber, pushUndo, rulesEnabled, stones, tryPlaceWithRules])

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

  const emptyPoints = useMemo(() => {
    const occupied = new Set(stones.map(s => keyOf(s.x, s.y)))
    const pts = []
    for (let x = 1; x <= boardSize; x++) {
      for (let y = 1; y <= boardSize; y++) {
        const k = keyOf(x, y)
        if (!occupied.has(k)) pts.push([x, y])
      }
    }
    return pts
  }, [stones, boardSize])

  const { territoryBlackPoints, territoryWhitePoints } = useMemo(() => {
    const visited = new Set()
    const { posToStone } = buildStoneMaps(stones)
    const blackPts = []
    const whitePts = []

    const flood = (sx, sy) => {
      const queue = [[sx, sy]]
      const region = []
      const borderColors = new Set()
      visited.add(keyOf(sx, sy))
      while (queue.length) {
        const [cx, cy] = queue.shift()
        region.push([cx, cy])
        const neighbors = getNeighbors(cx, cy)
        neighbors.forEach(([nx, ny]) => {
          const nk = keyOf(nx, ny)
          const neighborStone = posToStone.get(nk)
          if (neighborStone) {
            borderColors.add(neighborStone.color)
          } else if (!visited.has(nk)) {
            visited.add(nk)
            queue.push([nx, ny])
          }
        })
      }
      return { region, borderColors }
    }

    for (const [x, y] of emptyPoints) {
      const k = keyOf(x, y)
      if (visited.has(k)) continue
      const { region, borderColors } = flood(x, y)
      if (borderColors.size === 1) {
        const only = [...borderColors][0]
        if (only === 'black') {
          region.forEach(([rx, ry]) => blackPts.push({ x: rx, y: ry }))
        } else if (only === 'white') {
          region.forEach(([rx, ry]) => whitePts.push({ x: rx, y: ry }))
        }
      }
    }

    return { territoryBlackPoints: blackPts, territoryWhitePoints: whitePts }
  }, [buildStoneMaps, emptyPoints, getNeighbors, stones])

  const blackScore = territoryBlackPoints.length
  const whiteScore = territoryWhitePoints.length
  const lead = blackScore === whiteScore ? '동점' : (blackScore > whiteScore ? `흑 +${blackScore - whiteScore}` : `백 +${whiteScore - blackScore}`)

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

      <Row>
        <Label>
          <Checkbox type="checkbox" checked={rulesEnabled} onChange={(e) => setRulesEnabled(e.target.checked)} />
          바둑룰 적용(자살금지/따내기)
        </Label>
        <Label>
          <Checkbox type="checkbox" checked={showTerritory} onChange={(e) => setShowTerritory(e.target.checked)} />
          집 표시
        </Label>
        <Label>
          <Checkbox type="checkbox" checked={showScore} onChange={(e) => setShowScore(e.target.checked)} />
          점수/우세 표시
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
        territoryBlack={territoryBlackPoints}
        territoryWhite={territoryWhitePoints}
        showTerritory={showTerritory}
      />

      {showScore && (
        <Score>
          <span>흑 집: {blackScore}</span>
          <span>백 집: {whiteScore}</span>
          <span>현재 우세: {lead}</span>
        </Score>
      )}

      <Tip>돌을 눌러 자유롭게 두세요. 자동/수동 색 전환, 지우개, 룰 적용, 집/점수 표시, PNG 저장을 지원합니다.</Tip>
    </Wrapper>
  )
}

export default ManualMode 