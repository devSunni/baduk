import React, { useState } from 'react'
import styled from 'styled-components'
import { useProblems } from '../context/ProblemContext'

const Container = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`

const CategorySection = styled.div`
  margin-bottom: 2rem;
`

const CategoryTitle = styled.h2`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
`

const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ProblemCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ProblemTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const ProblemDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`

const ProblemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Difficulty = styled.span`
  background: ${props => {
    switch(props.level) {
      case '초급': return 'rgba(46, 204, 113, 0.8)';
      case '중급': return 'rgba(241, 196, 15, 0.8)';
      case '고급': return 'rgba(231, 76, 60, 0.8)';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`

const ProgressIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.completed ? 'rgba(46, 204, 113, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
`

const ProblemSelector = ({ onProblemSelect, progress }) => {
  const { categories, getProblemsByCategory } = useProblems()
  const [selectedCategory, setSelectedCategory] = useState('기본정석')

  return (
    <Container>
      {categories.map(category => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <ProblemGrid>
            {getProblemsByCategory(category).map(problem => {
              const problemProgress = progress[problem.id]
              return (
                <ProblemCard 
                  key={problem.id}
                  onClick={() => onProblemSelect(problem)}
                >
                  <ProblemTitle>{problem.title}</ProblemTitle>
                  <ProblemDescription>{problem.description}</ProblemDescription>
                  <ProblemMeta>
                    <Difficulty level={problem.difficulty}>
                      {problem.difficulty}
                    </Difficulty>
                    <ProgressIndicator completed={problemProgress?.completed}>
                      {problemProgress?.completed ? '✓' : ''}
                    </ProgressIndicator>
                  </ProblemMeta>
                </ProblemCard>
              )
            })}
          </ProblemGrid>
        </CategorySection>
      ))}
    </Container>
  )
}

export default ProblemSelector 