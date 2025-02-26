import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ 
        backgroundColor: theme.welcomeBackground ? 'transparent' : theme.primary,
        backgroundImage: theme.welcomeBackground ? `url(${theme.welcomeBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        {/* Logo */}
        {theme.logo && (
          <div className="mb-8">
            <div 
              className={`
                ${theme.logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                ${theme.logoSize === 'small' ? 'h-24 w-24' : 
                  theme.logoSize === 'medium' ? 'h-32 w-32' : 
                  'h-40 w-40'}
                bg-white/20 backdrop-blur-sm p-2 mx-auto
              `}
            >
              <img 
                src={theme.logo} 
                alt="Restaurant logo" 
                className={`
                  ${theme.logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}
                `}
              />
            </div>
          </div>
        )}
        
        {/* Welcome Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md text-white"
        >
          <h1 className="text-3xl font-bold mb-3">{theme.welcomeTitle || 'Welcome to Our Restaurant'}</h1>
          <p className="text-xl text-white/80 mb-8">{theme.welcomeSubtitle || 'Scan the QR code to view our menu'}</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/table')}
            className="px-6 py-3 text-lg font-medium bg-white text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Ordering
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}