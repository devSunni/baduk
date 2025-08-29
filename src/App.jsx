import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import ProblemSelector from './components/ProblemSelector'
import ManualMode from './components/ManualMode'
import { ProblemProvider } from './context/ProblemContext'
import { loadProgress, saveProgress } from './utils/storage'

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
`

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  justify-content: flex-end;
`

const GhostButton = styled.button`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  &:hover { background: rgba(255,255,255,0.2); }
`

function App() {
  const [currentView, setCurrentView] = useState('manual') // 'menu', 'game', 'manual'
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [progress, setProgress] = useState({})
  const [boardSize, setBoardSize] = useState(19)

  useEffect(() => {
    const savedProgress = loadProgress()
    setProgress(savedProgress)
  }, [])

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem)
    if (problem?.boardSize) setBoardSize(problem.boardSize)
    setCurrentView('game')
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
    setSelectedProblem(null)
  }

  const handleProblemComplete = (problemId, score) => {
    const newProgress = {
      ...progress,
      [problemId]: {
        completed: true,
        score: Math.max(score, progress[problemId]?.score || 0),
        lastAttempted: new Date().toISOString()
      }
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  return (
    <ProblemProvider>
      <AppContainer>
        <Header 
          currentView={currentView}
          onBack={currentView !== 'menu' ? handleBackToMenu : null}
          boardSize={boardSize}
          onBoardSizeChange={setBoardSize}
        />
        {currentView === 'menu' && (
          <Toolbar>
            <GhostButton onClick={() => setCurrentView('manual')}>매뉴얼 모드</GhostButton>
          </Toolbar>
        )}
        <MainContent>
          {currentView === 'menu' ? (
            <ProblemSelector 
              onProblemSelect={handleProblemSelect}
              progress={progress}
            />
          ) : currentView === 'manual' ? (
            <ManualMode boardSize={boardSize} />
          ) : (
            <GameBoard
              problem={selectedProblem}
              onComplete={handleProblemComplete}
              onBack={handleBackToMenu}
              boardSize={boardSize}
            />
          )}
        </MainContent>
      </AppContainer>
    </ProblemProvider>
  )
}

export default App 