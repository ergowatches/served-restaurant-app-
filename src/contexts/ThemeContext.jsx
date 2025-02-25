import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context with default values
const ThemeContext = createContext({
  theme: {
    primary: '#DB2777',
    secondary: '#F9FAFB',
    text: '#1F2937',
    background: '#FFFFFF',
    logo: null
  },
  updateTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Initialize state with values from localStorage if available
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    
    return {
      primary: '#DB2777',
      secondary: '#F9FAFB',
      text: '#1F2937',
      background: '#FFFFFF',
      logo: null
    };
  });

  // Update theme and save to localStorage
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  useEffect(() => {
    // Any side effects when theme changes can go here
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;