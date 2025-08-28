import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import BadukBoard from './BadukBoard'
import MoveHistory from './MoveHistory'
import ProblemInfo from './ProblemInfo'

const GameContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const BoardSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const SidePanel = styled.div`
  width: 100%;
  max-width: 400px;
  
  @media (min-width: 1024px) {
    width: 350px;
  }
`

const GameControls = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const ControlButton = styled.button`
  background: ${props => props.variant === 'primary' ? 'rgba(46, 204, 113, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.variant === 'primary' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const GameBoard = ({ problem, onComplete, onBack, boardSize }) => {
  const [currentPosition, setCurrentPosition] = useState([])
  const [moveHistory, setMoveHistory] = useState([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing', 'completed', 'failed'
  const [showHint, setShowHint] = useState(false)
  const [nextMoveNumber, setNextMoveNumber] = useState(1)
  const boardRef = useRef(null)

  useEffect(() => {
    if (problem) {
      // 초기 위치 설정 (기존 돌에는 moveNumber 부여하지 않음)
      const baseStones = (problem.initialPosition.stones || [])
        .filter(s => s.x >= 1 && s.y >= 1 && s.x <= boardSize && s.y <= boardSize)
        .map(s => ({ ...s, moveNumber: null }))
      setCurrentPosition(baseStones)
      setMoveHistory([])
      setCurrentMoveIndex(0)
      setGameState('playing')
      setShowHint(false)
      setNextMoveNumber(1)
    }
  }, [problem, boardSize])

  const isOccupied = useCallback((x, y) => {
    return currentPosition.some(s => s.x === x && s.y === y)
  }, [currentPosition])

  const placeMove = useCallback((move, playerTag) => {
    setCurrentPosition(prev => ([...prev, { x: move.x, y: move.y, color: move.color, moveNumber: nextMoveNumber }]))
    setMoveHistory(prev => ([...prev, { ...move, player: playerTag, moveNumber: nextMoveNumber }]))
    setNextMoveNumber(n => n + 1)
  }, [nextMoveNumber])

  const handleStonePlace = useCallback((x, y) => {
    if (gameState !== 'playing') return
    if (isOccupied(x, y)) return

    const currentMove = problem.moves[currentMoveIndex]
    if (!currentMove) return

    if (x === currentMove.x && y === currentMove.y) {
      // 정답 수
      placeMove(currentMove, 'user')

      // 다음 수가 있는지 확인 (AI 자동 수)
      if (currentMoveIndex + 1 < problem.moves.length) {
        setCurrentMoveIndex(i => i + 1)
        setTimeout(() => {
          const nextMove = problem.moves[currentMoveIndex + 1]
          if (nextMove && !isOccupied(nextMove.x, nextMove.y)) {
            placeMove(nextMove, 'ai')
            setCurrentMoveIndex(i => i + 1)
          }
        }, 400)
      } else {
        setGameState('completed')
        onComplete(problem.id, 100)
      }
    } else {
      setGameState('failed')
    }
  }, [currentMoveIndex, gameState, isOccupied, onComplete, placeMove, problem.moves, problem.id])

  const handleReset = () => {
    const baseStones = (problem.initialPosition.stones || [])
      .filter(s => s.x >= 1 && s.y >= 1 && s.x <= boardSize && s.y <= boardSize)
      .map(s => ({ ...s, moveNumber: null }))
    setCurrentPosition(baseStones)
    setMoveHistory([])
    setCurrentMoveIndex(0)
    setGameState('playing')
    setShowHint(false)
    setNextMoveNumber(1)
  }

  const handleHint = () => {
    setShowHint(true)
  }

  const handleNext = () => {
    if (currentMoveIndex < problem.moves.length) {
      const mv = problem.moves[currentMoveIndex]
      if (!isOccupied(mv.x, mv.y)) {
        placeMove(mv, 'auto')
        setCurrentMoveIndex(i => i + 1)
      }
    }
  }

  const handleSaveImage = () => {
    const dataUrl = boardRef.current?.exportAsImage?.()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${problem.id}_${boardSize}x${boardSize}.png`
    a.click()
  }

  if (!problem) return null

  return (
    <GameContainer>
      <BoardSection>
        <GameControls>
          <ControlButton onClick={handleReset}>
            다시 시작
          </ControlButton>
          <ControlButton onClick={handleHint} disabled={showHint}>
            힌트 보기
          </ControlButton>
          <ControlButton onClick={handleNext} disabled={currentMoveIndex >= problem.moves.length}>
            다음 수
          </ControlButton>
          <ControlButton onClick={handleSaveImage} variant="primary">
            그림으로 저장
          </ControlButton>
        </GameControls>
        
        <BadukBoard
          ref={boardRef}
          boardSize={boardSize}
          stones={currentPosition}
          onStonePlace={handleStonePlace}
          disabled={gameState !== 'playing'}
          showHint={showHint}
          hintMove={problem.moves[currentMoveIndex]}
        />
        
        {gameState === 'completed' && (
          <div style={{ color: 'white', textAlign: 'center', padding: '1rem' }}>
            <h3>🎉 정답입니다!</h3>
            <p>{problem.explanation}</p>
          </div>
        )}
        
        {gameState === 'failed' && (
          <div style={{ color: 'white', textAlign: 'center', padding: '1rem' }}>
            <h3>❌ 다시 시도해보세요</h3>
            <p>정답: {problem.moves[currentMoveIndex]?.description}</p>
          </div>
        )}
      </BoardSection>
      
      <SidePanel>
        <ProblemInfo problem={problem} />
        <MoveHistory 
          moves={moveHistory}
          problemMoves={problem.moves}
          currentIndex={currentMoveIndex}
        />
      </SidePanel>
    </GameContainer>
  )
}

export default GameBoard 