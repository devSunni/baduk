import React from 'react'
import styled from 'styled-components'

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  margin-bottom: 1rem;
`

const Title = styled.h3`
  margin: 0 0 0.25rem 0;
`

const Sub = styled.div`
  opacity: 0.8;
  margin-bottom: 0.5rem;
`

const ProblemInfo = ({ problem }) => {
  if (!problem) return null
  return (
    <Panel>
      <Title>{problem.title}</Title>
      <Sub>카테고리: {problem.category} · 난이도: {problem.difficulty}</Sub>
      <div style={{opacity: 0.9}}>{problem.description}</div>
    </Panel>
  )
}

export default ProblemInfo 