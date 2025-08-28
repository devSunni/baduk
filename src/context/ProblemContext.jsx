import React, { createContext, useContext, useState, useEffect } from 'react'
import { problems } from '../data/problems'

const ProblemContext = createContext()

export const useProblems = () => {
  const context = useContext(ProblemContext)
  if (!context) {
    throw new Error('useProblems must be used within a ProblemProvider')
  }
  return context
}

export const ProblemProvider = ({ children }) => {
  const [allProblems, setAllProblems] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // 문제 데이터 로드
    setAllProblems(problems)
    
    // 카테고리 추출
    const uniqueCategories = [...new Set(problems.map(p => p.category))]
    setCategories(uniqueCategories)
  }, [])

  const getProblemsByCategory = (category) => {
    return allProblems.filter(p => p.category === category)
  }

  const getProblemById = (id) => {
    return allProblems.find(p => p.id === id)
  }

  const getRandomProblem = (difficulty = null) => {
    let filtered = allProblems
    if (difficulty) {
      filtered = allProblems.filter(p => p.difficulty === difficulty)
    }
    if (filtered.length === 0) return null
    return filtered[Math.floor(Math.random() * filtered.length)]
  }

  const value = {
    allProblems,
    categories,
    getProblemsByCategory,
    getProblemById,
    getRandomProblem
  }

  return (
    <ProblemContext.Provider value={value}>
      {children}
    </ProblemContext.Provider>
  )
} 