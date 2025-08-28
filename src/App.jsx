import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import ProblemSelector from './components/ProblemSelector'
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

function App() {
  const [currentView, setCurrentView] = useState('menu') // 'menu', 'game'
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
          onBack={currentView === 'game' ? handleBackToMenu : null}
          boardSize={boardSize}
          onBoardSizeChange={setBoardSize}
        />
        <MainContent>
          {currentView === 'menu' ? (
            <ProblemSelector 
              onProblemSelect={handleProblemSelect}
              progress={progress}
            />
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