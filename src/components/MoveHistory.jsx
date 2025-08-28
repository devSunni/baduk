import React from 'react'
import styled from 'styled-components'

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  max-height: 40vh;
  overflow-y: auto;
`

const Title = styled.h4`
  margin: 0 0 0.5rem 0;
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.4rem;
  border-bottom: 1px dashed rgba(255,255,255,0.15);
  font-size: 0.9rem;
`

const Badge = styled.span`
  background: ${p => p.color === 'black' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'};
  color: ${p => p.color === 'black' ? '#fff' : '#000'};
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  min-width: 34px;
  text-align: center;
  font-weight: 700;
`

const MoveHistory = ({ moves = [], problemMoves = [], currentIndex = 0 }) => {
  return (
    <Panel>
      <Title>수순</Title>
      {moves.length === 0 && <div style={{opacity:0.7}}>아직 수가 없습니다.</div>}
      {moves.map((m, idx) => (
        <Item key={idx}>
          <div>({m.x}, {m.y})</div>
          <Badge color={m.color}>{m.moveNumber ?? '-'}</Badge>
        </Item>
      ))}
    </Panel>
  )
}

export default MoveHistory 