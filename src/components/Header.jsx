import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  background: rgba(44, 62, 80, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
`

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const RightArea = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
`

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const Header = ({ currentView, onBack, boardSize, onBoardSizeChange }) => {
  return (
    <HeaderContainer>
      <Title>바둑 정석 학습</Title>
      <RightArea>
        <Select 
          value={boardSize}
          onChange={(e) => onBoardSizeChange?.(Number(e.target.value))}
          title="보드 크기 선택"
        >
          <option value={9}>초급 · 9x9</option>
          <option value={13}>중급 · 13x13</option>
          <option value={19}>고급 · 19x19</option>
        </Select>
        {onBack && (
          <BackButton onClick={onBack}>
            ← 메뉴로
          </BackButton>
        )}
      </RightArea>
    </HeaderContainer>
  )
}

export default Header 