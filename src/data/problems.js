// 바둑 정석 문제 데이터
export const problems = [
  {
    id: 'jungsuk_001',
    title: '3-3 포인트 정석',
    category: '기본정석',
    difficulty: '초급',
    description: '3-3 포인트에서 흑이 어떻게 응수해야 할까요?',
    boardSize: 19,
    initialPosition: {
      stones: [
        { x: 3, y: 3, color: 'white' },
        { x: 15, y: 15, color: 'black' }
      ]
    },
    moves: [
      { x: 3, y: 4, color: 'black', description: '흑 1로 응수' },
      { x: 4, y: 3, color: 'white', description: '백 2로 받음' },
      { x: 2, y: 3, color: 'black', description: '흑 3으로 연결' }
    ],
    solution: [
      { x: 3, y: 4, color: 'black' },
      { x: 2, y: 3, color: 'black' }
    ],
    explanation: '3-3 포인트는 바둑의 기본 정석 중 하나입니다. 흑은 먼저 3-4로 응수한 후 2-3으로 연결하여 안전하게 살아야 합니다.'
  },
  {
    id: 'jungsuk_002',
    title: '4-4 포인트 정석',
    category: '기본정석',
    difficulty: '초급',
    description: '4-4 포인트에서 흑이 어떻게 응수해야 할까요?',
    boardSize: 19,
    initialPosition: {
      stones: [
        { x: 4, y: 4, color: 'white' },
        { x: 15, y: 15, color: 'black' }
      ]
    },
    moves: [
      { x: 4, y: 6, color: 'black', description: '흑 1로 응수' },
      { x: 6, y: 4, color: 'white', description: '백 2로 받음' },
      { x: 3, y: 4, color: 'black', description: '흑 3으로 연결' }
    ],
    solution: [
      { x: 4, y: 6, color: 'black' },
      { x: 3, y: 4, color: 'black' }
    ],
    explanation: '4-4 포인트는 바둑의 핵심 정석입니다. 흑은 4-6으로 응수한 후 3-4로 연결하여 안전하게 살아야 합니다.'
  },
  {
    id: 'jungsuk_003',
    title: '5-3 포인트 정석',
    category: '기본정석',
    difficulty: '초급',
    description: '5-3 포인트에서 흑이 어떻게 응수해야 할까요?',
    boardSize: 19,
    initialPosition: {
      stones: [
        { x: 5, y: 3, color: 'white' },
        { x: 15, y: 15, color: 'black' }
      ]
    },
    moves: [
      { x: 5, y: 5, color: 'black', description: '흑 1로 응수' },
      { x: 7, y: 3, color: 'white', description: '백 2로 받음' },
      { x: 3, y: 3, color: 'black', description: '흑 3으로 연결' }
    ],
    solution: [
      { x: 5, y: 5, color: 'black' },
      { x: 3, y: 3, color: 'black' }
    ],
    explanation: '5-3 포인트는 바둑의 기본 정석 중 하나입니다. 흑은 먼저 5-5로 응수한 후 3-3으로 연결하여 안전하게 살아야 합니다.'
  },
  {
    id: 'jungsuk_004',
    title: '6-3 포인트 정석',
    category: '기본정석',
    difficulty: '초급',
    description: '6-3 포인트에서 흑이 어떻게 응수해야 할까요?',
    boardSize: 19,
    initialPosition: {
      stones: [
        { x: 6, y: 3, color: 'white' },
        { x: 15, y: 15, color: 'black' }
      ]
    },
    moves: [
      { x: 6, y: 6, color: 'black', description: '흑 1로 응수' },
      { x: 9, y: 3, color: 'white', description: '백 2로 받음' },
      { x: 3, y: 3, color: 'black', description: '흑 3으로 연결' }
    ],
    solution: [
      { x: 6, y: 6, color: 'black' },
      { x: 3, y: 3, color: 'black' }
    ],
    explanation: '6-3 포인트는 바둑의 기본 정석 중 하나입니다. 흑은 먼저 6-6으로 응수한 후 3-3으로 연결하여 안전하게 살아야 합니다.'
  },
  {
    id: 'jungsuk_005',
    title: '7-3 포인트 정석',
    category: '기본정석',
    difficulty: '초급',
    description: '7-3 포인트에서 흑이 어떻게 응수해야 할까요?',
    boardSize: 19,
    initialPosition: {
      stones: [
        { x: 7, y: 3, color: 'white' },
        { x: 15, y: 15, color: 'black' }
      ]
    },
    moves: [
      { x: 7, y: 7, color: 'black', description: '흑 1로 응수' },
      { x: 10, y: 3, color: 'white', description: '백 2로 받음' },
      { x: 4, y: 3, color: 'black', description: '흑 3으로 연결' }
    ],
    solution: [
      { x: 7, y: 7, color: 'black' },
      { x: 4, y: 3, color: 'black' }
    ],
    explanation: '7-3 포인트는 바둑의 기본 정석 중 하나입니다. 흑은 먼저 7-7로 응수한 후 4-3으로 연결하여 안전하게 살아야 합니다.'
  }
]

// 카테고리별 문제 그룹화
export const getProblemsByCategory = (category) => {
  return problems.filter(p => p.category === category)
}

// 난이도별 문제 그룹화
export const getProblemsByDifficulty = (difficulty) => {
  return problems.filter(p => p.difficulty === difficulty)
} 