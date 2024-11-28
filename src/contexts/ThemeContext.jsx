import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

// Get saved theme from localStorage or use defaults
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme ? JSON.parse(savedTheme) : {
    primary: '#DB2777', // Default pink-600
    secondary: '#F9FAFB', // Default gray-50
    text: '#1F2937', // Default gray-800
    background: '#FFFFFF' // Default white
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', JSON.stringify(newTheme))
  }

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}