import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import TableInput from './pages/TableInput'
import ChoicePage from './pages/ChoicePage'
import Menu from './pages/Menu'
import Payment from './pages/Payment'
import PaymentConfirmation from './pages/PaymentConfirmation'
import FAQ from './pages/FAQ'
import AllergenInfo from './pages/AllergenInfo'
import DashboardLogin from './pages/DashboardLogin'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<TableInput />} />
            <Route path="/choice/:tableNumber" element={<ChoicePage />} />
            <Route path="/menu/:tableNumber" element={<Menu />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/allergens/:tableNumber" element={<AllergenInfo />} />
            <Route path="/games/:tableNumber" element={<ChoicePage />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard-login" element={<DashboardLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App