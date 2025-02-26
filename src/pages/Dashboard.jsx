import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  LogOut, 
  Settings, 
  Upload, 
  Image, 
  X, 
  AlignLeft, 
  AlignCenter, 
  Circle, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Home, 
  PanelLeft, 
  Menu as MenuIcon, 
  Smartphone, 
  Palette, 
  Check, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Info, 
  ArrowLeft,
  Search,
  Globe,
  Laptop,
  Monitor,
  Plus,
  Minus,
  MoreHorizontal,
  ShoppingBag,
  Layout,
  Type,
  MessageCircle,
  FileImage,
  Clock,
  DollarSign,
  BarChart2,
  TrendingUp,
  Star,
  AlarmClock,
  Calendar,
  Zap,
  Activity,
  Percent
} from 'lucide-react'

const DEFAULT_THEME = {
  primary: '#7E6EFF',
  secondary: '#F9FAFB',
  text: '#1F2937',
  background: '#FFFFFF',
  logo: null,
  logoShape: 'circle',
  logoPosition: 'center',
  logoSize: 'medium',
  logoZoom: 1,
  logoOffset: { x: 0, y: 0 },
  banner: null,
  bannerZoom: 1,
  bannerOffset: { x: 0, y: 0 },
  welcomeBackground: null,
  welcomeBackgroundZoom: 1,
  welcomeBackgroundOffset: { x: 0, y: 0 },
  welcomeTitle: 'Welcome to Our Restaurant',
  welcomeSubtitle: 'Scan the QR code to view our menu'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { theme, updateTheme } = useTheme()
  
  // =========== STATE MANAGEMENT ===========
  const [colors, setColors] = useState({ ...DEFAULT_THEME })
  const [savedMessage, setSavedMessage] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoShape, setLogoShape] = useState('circle')
  const [logoPosition, setLogoPosition] = useState('center')
  const [logoSize, setLogoSize] = useState('medium')
  const [isEditingLogo, setIsEditingLogo] = useState(false)
  const [banner, setBanner] = useState(null)
  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [welcomeBackground, setWelcomeBackground] = useState(null)
  const [isEditingWelcomeBackground, setIsEditingWelcomeBackground] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [activeCustomizationTab, setActiveCustomizationTab] = useState('branding')
  const [previewDevice, setPreviewDevice] = useState('mobile')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  
  // Welcome page states
  const [welcomeTitle, setWelcomeTitle] = useState(DEFAULT_THEME.welcomeTitle)
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(DEFAULT_THEME.welcomeSubtitle)
  
  // Image editor states
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [bannerZoom, setBannerZoom] = useState(1)
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 })
  const [welcomeBackgroundZoom, setWelcomeBackgroundZoom] = useState(1)
  const [welcomeBackgroundPosition, setWelcomeBackgroundPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [imageOriginal, setImageOriginal] = useState(null)
  const [bannerOriginal, setBannerOriginal] = useState(null)
  const [welcomeBackgroundOriginal, setWelcomeBackgroundOriginal] = useState(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  
  // Smart Menu states
  const [activeSmartMenuTab, setActiveSmartMenuTab] = useState('rotation')
  const [menuCategories, setMenuCategories] = useState([
    { id: 'appetizers', name: 'Appetizers', menuItems: [] },
    { id: 'mains', name: 'Main Courses', menuItems: [] },
    { id: 'drinks', name: 'Drinks', menuItems: [] },
    { id: 'desserts', name: 'Desserts', menuItems: [] }
  ])
  const [menuRotations, setMenuRotations] = useState([
    { 
      id: 1, 
      name: 'Breakfast Menu', 
      startTime: '07:00', 
      endTime: '11:00', 
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], 
      isActive: true,
      categories: ['appetizers', 'drinks'],
      description: 'Morning offerings including pastries, eggs, and coffee',
      icon: 'Coffee'
    },
    { 
      id: 2, 
      name: 'Lunch Menu', 
      startTime: '11:00', 
      endTime: '16:00', 
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], 
      isActive: true,
      categories: ['appetizers', 'mains', 'drinks', 'desserts'],
      description: 'Full menu with all offerings available',
      icon: 'Pizza'
    },
    { 
      id: 3, 
      name: 'Dinner Menu', 
      startTime: '16:00', 
      endTime: '23:00', 
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], 
      isActive: true,
      categories: ['appetizers', 'mains', 'drinks', 'desserts'],
      description: 'Evening selections with premium offerings',
      icon: 'Wine'
    }
  ])
  const [dynamicPricingRules, setDynamicPricingRules] = useState([
    { 
      id: 1, 
      name: 'Happy Hour', 
      adjustment: -10, 
      startTime: '16:00', 
      endTime: '18:00', 
      days: ['mon', 'tue', 'wed', 'thu', 'fri'], 
      isActive: true,
      categories: ['drinks'],
      itemIds: [],
      applyTo: 'categories',
      description: 'Afternoon discount on all beverages',
      icon: 'Coffee'
    },
    { 
      id: 2, 
      name: 'Weekend Premium', 
      adjustment: 5, 
      startTime: '17:00', 
      endTime: '22:00', 
      days: ['fri', 'sat'], 
      isActive: true,
      categories: [],
      itemIds: ['specialdish1', 'specialdish2'],
      applyTo: 'items',
      description: 'Weekend price increase for special dishes',
      icon: 'Star'
    },
    {
      id: 3,
      name: 'Early Bird Special',
      adjustment: -15,
      startTime: '16:00',
      endTime: '18:00',
      days: ['mon', 'tue', 'wed', 'thu', 'sun'],
      isActive: true,
      categories: ['mains'],
      itemIds: [],
      applyTo: 'categories',
      description: 'Early dinner discount on all main courses',
      icon: 'AlarmClock'
    }
  ])
  const [editingRotation, setEditingRotation] = useState(null)
  const [editingPricingRule, setEditingPricingRule] = useState(null)
  const [allMenuItems, setAllMenuItems] = useState([])
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false)
  
  // =========== REFS ===========
  const logoInputRef = useRef(null)
  const bannerInputRef = useRef(null)
  const welcomeBackgroundInputRef = useRef(null)
  const imageEditorRef = useRef(null)
  const bannerEditorRef = useRef(null)
  const welcomeBackgroundEditorRef = useRef(null)
  const imageRef = useRef(null)
  const bannerRef = useRef(null)
  const welcomeBackgroundRef = useRef(null)
  const colorPickerRefs = useRef({})




const [showSuggestion, setShowSuggestion] = useState(false);
const [currentSuggestion, setCurrentSuggestion] = useState(null);
const [suggestions, setSuggestions] = useState([
  {
    id: 1,
    type: 'pricing',
    title: 'Happy Hour Suggestion',
    description: 'We noticed you don\'t have discounted drinks between 4-6pm. Add a happy hour pricing rule to boost weekday traffic?',
    applied: false,
    dismissed: false
  },
  {
    id: 2,
    type: 'menu',
    title: 'Breakfast Menu Suggestion',
    description: 'Your breakfast menu rotation starts at 7am. Consider starting at 6am to capture early commuters.',
    applied: false,
    dismissed: false
  }
]);

  // =========== EFFECTS ===========
  
  // Authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/dashboard-login')
    }
  }, [navigate])

  // Initialize from theme
  useEffect(() => {
    if (theme) {
      setColors({ ...DEFAULT_THEME, ...theme })
      
      if (theme.logo) setLogo(theme.logo)
      if (theme.logoShape) setLogoShape(theme.logoShape)
      if (theme.logoPosition) setLogoPosition(theme.logoPosition)
      if (theme.logoSize) setLogoSize(theme.logoSize)
      if (theme.logoZoom) setZoom(theme.logoZoom)
      if (theme.logoOffset) setPosition(theme.logoOffset)
      if (theme.banner) setBanner(theme.banner)
      if (theme.bannerZoom) setBannerZoom(theme.bannerZoom)
      if (theme.bannerOffset) setBannerPosition(theme.bannerOffset)
      if (theme.welcomeBackground) setWelcomeBackground(theme.welcomeBackground)
      if (theme.welcomeBackgroundZoom) setWelcomeBackgroundZoom(theme.welcomeBackgroundZoom)
      if (theme.welcomeBackgroundOffset) setWelcomeBackgroundPosition(theme.welcomeBackgroundOffset)
      if (theme.welcomeTitle) setWelcomeTitle(theme.welcomeTitle)
      if (theme.welcomeSubtitle) setWelcomeSubtitle(theme.welcomeSubtitle)
    }
  }, [theme])
  
  // Track unsaved changes
  useEffect(() => {
    if (!theme) return;
    
    const themeChanged = JSON.stringify(colors) !== JSON.stringify(theme) ||
      logo !== theme.logo ||
      logoShape !== theme.logoShape ||
      logoPosition !== theme.logoPosition ||
      logoSize !== theme.logoSize ||
      zoom !== theme.logoZoom ||
      JSON.stringify(position) !== JSON.stringify(theme.logoOffset) ||
      banner !== theme.banner ||
      bannerZoom !== theme.bannerZoom ||
      JSON.stringify(bannerPosition) !== JSON.stringify(theme.bannerOffset) ||
      welcomeBackground !== theme.welcomeBackground ||
      welcomeBackgroundZoom !== theme.welcomeBackgroundZoom ||
      JSON.stringify(welcomeBackgroundPosition) !== JSON.stringify(theme.welcomeBackgroundOffset) ||
      welcomeTitle !== theme.welcomeTitle ||
      welcomeSubtitle !== theme.welcomeSubtitle
      
    setUnsavedChanges(themeChanged)
  }, [
    colors, logo, logoShape, logoPosition, logoSize, zoom, position, 
    banner, bannerZoom, bannerPosition, welcomeBackground, 
    welcomeBackgroundZoom, welcomeBackgroundPosition, welcomeTitle, 
    welcomeSubtitle, theme
  ])

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initialize on mount
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Find suggestions that haven't been dismissed or applied
    const activeSuggestions = suggestions.filter(s => !s.dismissed && !s.applied);
    
    if (activeSuggestions.length > 0) {
      // Set a timer to show a suggestion after the component mounts
      const timerId = setTimeout(() => {
        setCurrentSuggestion(activeSuggestions[Math.floor(Math.random() * activeSuggestions.length)]);
        setShowSuggestion(true);
      }, 10000); // Show after 10 seconds
      
      return () => clearTimeout(timerId);
    }
  }, [suggestions]);

  // =========== HANDLERS & UTILITIES ===========
  
  // Handle color change
  const handleColorChange = (key, value) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    
    // Auto-hide toast after 3 seconds
    const timerId = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timerId)
  }

  const dismissSuggestion = (id) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? {...s, dismissed: true} : s
    ));
    setShowSuggestion(false);
  };
  
  // Apply suggestion
  const applySuggestion = (suggestion) => {
    if (suggestion.type === 'pricing') {
      // Add a new happy hour pricing rule
      const newId = dynamicPricingRules.length > 0 ? Math.max(...dynamicPricingRules.map(r => r.id)) + 1 : 1;
      const happyHourRule = {
        id: newId,
        name: 'Happy Hour',
        adjustment: -15,
        startTime: '16:00',
        endTime: '18:00', 
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        isActive: true,
        categories: ['drinks'],
        itemIds: [],
        applyTo: 'categories',
        description: 'Discounted drinks to boost weekday traffic',
        icon: 'Coffee'
      };
      setDynamicPricingRules([...dynamicPricingRules, happyHourRule]);
      showNotification('Happy Hour pricing rule added!');
    } else if (suggestion.type === 'menu') {
      // Update breakfast menu start time
      setMenuRotations(prev => prev.map(r => 
        r.name.includes('Breakfast') ? {...r, startTime: '06:00'} : r
      ));
      showNotification('Breakfast menu start time updated!');
    }
    
    // Mark suggestion as applied
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? {...s, applied: true, dismissed: true} : s
    ));
    setShowSuggestion(false);
  };

  // Save theme changes
  const handleSave = () => {
    try {
      const updatedTheme = {
        ...colors,
        logo,
        logoShape,
        logoPosition,
        logoSize,
        logoZoom: zoom,
        logoOffset: position,
        banner,
        bannerZoom,
        bannerOffset: bannerPosition,
        welcomeBackground,
        welcomeBackgroundZoom: welcomeBackgroundZoom,
        welcomeBackgroundOffset: welcomeBackgroundPosition,
        welcomeTitle,
        welcomeSubtitle
      }
      
      updateTheme(updatedTheme)
      showNotification('Your changes have been saved successfully!')
      setUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving theme:', error)
      showNotification('Failed to save changes. Please try again.', 'error')
    }
  }

  // Logout handler
  const handleLogout = () => {
    // If there are unsaved changes, confirm before logout
    if (unsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to logout?')) {
        try {
          localStorage.removeItem('isAuthenticated')
          navigate('/dashboard-login')
        } catch (error) {
          console.error('Error during logout:', error)
          showNotification('Failed to logout. Please try again.', 'error')
        }
      }
    } else {
      try {
        localStorage.removeItem('isAuthenticated')
        navigate('/dashboard-login')
      } catch (error) {
        console.error('Error during logout:', error)
        showNotification('Failed to logout. Please try again.', 'error')
      }
    }
  }

  // Reset to defaults
  const handleReset = () => {
    setColors({ ...DEFAULT_THEME })
    setLogo(null)
    setLogoShape('circle')
    setLogoPosition('center')
    setLogoSize('medium')
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setBanner(null)
    setBannerZoom(1)
    setBannerPosition({ x: 0, y: 0 })
    setWelcomeBackground(null)
    setWelcomeBackgroundZoom(1)
    setWelcomeBackgroundPosition({ x: 0, y: 0 })
    setWelcomeTitle('Welcome to Our Restaurant')
    setWelcomeSubtitle('Scan the QR code to view our menu')
    
    // Update the theme context with defaults
    updateTheme({ ...DEFAULT_THEME })
    showNotification('Theme reset to defaults')
  }

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error')
      return
    }
  
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Logo must be less than 2MB', 'error')
      return
    }
  
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageOriginal(event.target.result)
        setIsEditingLogo(true)
      }
    }
    reader.onerror = () => {
      showNotification('Error reading file. Please try again.', 'error')
    }
    reader.readAsDataURL(file)
  }

  // Handle banner upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error')
      return
    }
  
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Banner must be less than 2MB', 'error')
      return
    }
  
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerOriginal(event.target.result)
        setIsEditingBanner(true)
      }
    }
    reader.onerror = () => {
      showNotification('Error reading file. Please try again.', 'error')
    }
    reader.readAsDataURL(file)
  }

  // Handle welcome background upload
  const handleWelcomeBackgroundUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error')
      return
    }
  
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Background image must be less than 2MB', 'error')
      return
    }
  
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setWelcomeBackgroundOriginal(event.target.result)
        setIsEditingWelcomeBackground(true)
      }
    }
    reader.onerror = () => {
      showNotification('Error reading file. Please try again.', 'error')
    }
    reader.readAsDataURL(file)
  }

  // Remove logo
  const handleLogoRemove = () => {
    setLogo(null)
    setImageOriginal(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
    showNotification('Logo removed successfully')
  }

  // Remove banner
  const handleBannerRemove = () => {
    setBanner(null)
    setBannerOriginal(null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
    showNotification('Banner removed successfully')
  }

  // Remove welcome background
  const handleWelcomeBackgroundRemove = () => {
    setWelcomeBackground(null)
    setWelcomeBackgroundOriginal(null)
    if (welcomeBackgroundInputRef.current) {
      welcomeBackgroundInputRef.current.value = ''
    }
    showNotification('Welcome background removed successfully')
  }

  // =========== DRAGGING HANDLERS ===========
  
  // Handle mouse down for logo dragging
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (!imageRef.current) return
    
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // Handle mouse move for logo dragging
  const handleMouseMove = (e) => {
    e.preventDefault()
    if (!isDragging || !imageRef.current || !imageEditorRef.current) return

    // Calculate new position
    const newX = e.clientX - startPosition.x
    const newY = e.clientY - startPosition.y
    
    // Apply the new position
    setPosition({ x: newX, y: newY })
  }

  // Handle mouse down for banner dragging
  const handleBannerMouseDown = (e) => {
    e.preventDefault()
    if (!bannerRef.current) return
    
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - bannerPosition.x,
      y: e.clientY - bannerPosition.y
    })
  }

  // Handle mouse move for banner dragging
  const handleBannerMouseMove = (e) => {
    e.preventDefault()
    if (!isDragging || !bannerRef.current || !bannerEditorRef.current) return

    // Calculate new position
    const newX = e.clientX - startPosition.x
    const newY = e.clientY - startPosition.y
    
    // Apply the new position
    setBannerPosition({ x: newX, y: newY })
  }

  // Handle mouse down for welcome background dragging
  const handleWelcomeBackgroundMouseDown = (e) => {
    e.preventDefault()
    if (!welcomeBackgroundRef.current) return
    
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - welcomeBackgroundPosition.x,
      y: e.clientY - welcomeBackgroundPosition.y
    })
  }

  // Handle mouse move for welcome background dragging
  const handleWelcomeBackgroundMouseMove = (e) => {
    e.preventDefault()
    if (!isDragging || !welcomeBackgroundRef.current || !welcomeBackgroundEditorRef.current) return

    // Calculate new position
    const newX = e.clientX - startPosition.x
    const newY = e.clientY - startPosition.y
    
    // Apply the new position
    setWelcomeBackgroundPosition({ x: newX, y: newY })
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  // =========== ZOOM HANDLERS ===========

  // Handle zoom changes for logo
  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setZoom(value)
    }
  }

  // Handle zoom changes for banner
  const handleBannerZoomChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setBannerZoom(value)
    }
  }

  // Handle zoom changes for welcome background
  const handleWelcomeBackgroundZoomChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setWelcomeBackgroundZoom(value)
    }
  }

  // Zoom in/out buttons for logo
  const handleZoomIn = () => setZoom(prev => Math.min(3, prev + 0.1))
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1))

  // Zoom in/out buttons for banner
  const handleBannerZoomIn = () => setBannerZoom(prev => Math.min(3, prev + 0.1))
  const handleBannerZoomOut = () => setBannerZoom(prev => Math.max(0.5, prev - 0.1))

  // Zoom in/out buttons for welcome background
  const handleWelcomeBackgroundZoomIn = () => setWelcomeBackgroundZoom(prev => Math.min(3, prev + 0.1))
  const handleWelcomeBackgroundZoomOut = () => setWelcomeBackgroundZoom(prev => Math.max(0.5, prev - 0.1))

  // =========== IMAGE EDITORS ===========

  // Save the edited logo
  const handleSaveLogoEdit = () => {
    if (!imageRef.current || !imageEditorRef.current || !imageOriginal) {
      console.error("Missing required elements for logo editing")
      setIsEditingLogo(false)
      return
    }

    try {
      // Create a canvas to render the cropped image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }
      
      // Get the container dimensions
      const containerRect = imageEditorRef.current.getBoundingClientRect()
      
      // Set canvas dimensions to match the cropping area
      canvas.width = containerRect.width
      canvas.height = containerRect.height
      
      // Create a temporary image to draw on canvas
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageOriginal
      
      img.onload = () => {
        try {
          // Calculate center of the image
          const imgCenterX = img.width / 2
          const imgCenterY = img.height / 2
          
          // Calculate source coordinates (where to crop from the original image)
          const sourceX = imgCenterX - (containerRect.width / 2 / zoom) + (position.x / zoom)
          const sourceY = imgCenterY - (containerRect.height / 2 / zoom) + (position.y / zoom)
          const sourceWidth = containerRect.width / zoom
          const sourceHeight = containerRect.height / zoom
          
          // Draw the image with proper cropping
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
          )
          
          // Convert canvas to data URL and set as logo
          const dataUrl = canvas.toDataURL('image/png')
          
          // Update local state
          setLogo(dataUrl)
          setIsEditingLogo(false)
          showNotification('Logo updated successfully')
        } catch (err) {
          console.error("Error creating logo:", err)
          showNotification('Error creating logo. Please try again with a different image.', 'error')
          setIsEditingLogo(false)
        }
      }
      
      img.onerror = () => {
        console.error("Error loading image")
        showNotification('Error loading image. Please try again with a different image.', 'error')
        setIsEditingLogo(false)
      }
    } catch (error) {
      console.error("Error in logo editing:", error)
      showNotification('Failed to process the image. Please try again.', 'error')
      setIsEditingLogo(false)
    }
  }

  // Save the edited banner
  const handleSaveBannerEdit = () => {
    if (!bannerRef.current || !bannerEditorRef.current || !bannerOriginal) {
      console.error("Missing required elements for banner editing")
      setIsEditingBanner(false)
      return
    }

    try {
      // Create a canvas to render the cropped image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }
      
      // Get the container dimensions
      const containerRect = bannerEditorRef.current.getBoundingClientRect()
      
      // Set canvas dimensions to match the cropping area
      canvas.width = containerRect.width
      canvas.height = containerRect.height
      
      // Create a temporary image to draw on canvas
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = bannerOriginal
      
      img.onload = () => {
        try {
          // Calculate center of the image
          const imgCenterX = img.width / 2
          const imgCenterY = img.height / 2
          
          // Calculate source coordinates (where to crop from the original image)
          const sourceX = imgCenterX - (containerRect.width / 2 / bannerZoom) + (bannerPosition.x / bannerZoom)
          const sourceY = imgCenterY - (containerRect.height / 2 / bannerZoom) + (bannerPosition.y / bannerZoom)
          const sourceWidth = containerRect.width / bannerZoom
          const sourceHeight = containerRect.height / bannerZoom
          
          // Draw the image with proper cropping
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
          )
          
          // Convert canvas to data URL and set as banner
          const dataUrl = canvas.toDataURL('image/png')
          
          // Update local state
          setBanner(dataUrl)
          setIsEditingBanner(false)
          showNotification('Banner updated successfully')
        } catch (err) {
          console.error("Error creating banner:", err)
          showNotification('Error creating banner. Please try again with a different image.', 'error')
          setIsEditingBanner(false)
        }
      }
      
      img.onerror = () => {
        console.error("Error loading image")
        showNotification('Error loading image. Please try again with a different image.', 'error')
        setIsEditingBanner(false)
      }
    } catch (error) {
      console.error("Error in banner editing:", error)
      showNotification('Failed to process the image. Please try again.', 'error')
      setIsEditingBanner(false)
    }
  }

  // Save the edited welcome background
  const handleSaveWelcomeBackgroundEdit = () => {
    if (!welcomeBackgroundRef.current || !welcomeBackgroundEditorRef.current || !welcomeBackgroundOriginal) {
      console.error("Missing required elements for welcome background editing")
      setIsEditingWelcomeBackground(false)
      return
    }

    try {
      // Create a canvas to render the cropped image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }
      
      // Get the container dimensions
      const containerRect = welcomeBackgroundEditorRef.current.getBoundingClientRect()
      
      // Set canvas dimensions to match the cropping area
      canvas.width = containerRect.width
      canvas.height = containerRect.height
      
      // Create a temporary image to draw on canvas
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = welcomeBackgroundOriginal
      
      img.onload = () => {
        try {
          // Calculate center of the image
          const imgCenterX = img.width / 2
          const imgCenterY = img.height / 2
          
          // Calculate source coordinates (where to crop from the original image)
          const sourceX = imgCenterX - (containerRect.width / 2 / welcomeBackgroundZoom) + (welcomeBackgroundPosition.x / welcomeBackgroundZoom)
          const sourceY = imgCenterY - (containerRect.height / 2 / welcomeBackgroundZoom) + (welcomeBackgroundPosition.y / welcomeBackgroundZoom)
          const sourceWidth = containerRect.width / welcomeBackgroundZoom
          const sourceHeight = containerRect.height / welcomeBackgroundZoom
          
          // Draw the image with proper cropping
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
          )
          
          // Convert canvas to data URL and set as welcome background
          const dataUrl = canvas.toDataURL('image/png')
          
          // Update local state
          setWelcomeBackground(dataUrl)
          setIsEditingWelcomeBackground(false)
          showNotification('Welcome background updated successfully')
        } catch (err) {
          console.error("Error creating welcome background:", err)
          showNotification('Error creating welcome background. Please try again with a different image.', 'error')
          setIsEditingWelcomeBackground(false)
        }
      }
      
      img.onerror = () => {
        console.error("Error loading image")
        showNotification('Error loading image. Please try again with a different image.', 'error')
        setIsEditingWelcomeBackground(false)
      }
    } catch (error) {
      console.error("Error in background editing:", error)
      showNotification('Failed to process the image. Please try again.', 'error')
      setIsEditingWelcomeBackground(false)
    }
  }

  // Cancel editing handlers
  const handleCancelLogoEdit = () => {
    setIsEditingLogo(false)
    if (!logo) {
      // Clear the uploaded image if there was no logo before
      setImageOriginal(null)
    }
  }

  const handleCancelBannerEdit = () => {
    setIsEditingBanner(false)
    if (!banner) {
      // Clear the uploaded image if there was no banner before
      setBannerOriginal(null)
    }
  }

  const handleCancelWelcomeBackgroundEdit = () => {
    setIsEditingWelcomeBackground(false)
    if (!welcomeBackground) {
      // Clear the uploaded image if there was no welcome background before
      setWelcomeBackgroundOriginal(null)
    }
  }

  // =========== SMART MENU HANDLERS ===========

  // Fetch menu items (simulating API call)
  const fetchMenuItems = () => {
    setIsLoadingMenuItems(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const mockMenuItems = [
        { id: 'app1', name: 'Garlic Bread', category: 'appetizers', price: 6.99, description: 'Toasted artisan bread with garlic butter' },
        { id: 'app2', name: 'Bruschetta', category: 'appetizers', price: 8.99, description: 'Tomato, basil and garlic on toasted bread' },
        { id: 'app3', name: 'Chicken Wings', category: 'appetizers', price: 12.99, description: 'Spicy buffalo wings with blue cheese dip' },
        { id: 'main1', name: 'Margherita Pizza', category: 'mains', price: 14.99, description: 'Classic pizza with tomato, mozzarella and basil' },
        { id: 'main2', name: 'Spaghetti Carbonara', category: 'mains', price: 16.99, description: 'Pasta with egg, cheese, pancetta and black pepper' },
        { id: 'main3', name: 'Grilled Salmon', category: 'mains', price: 22.99, description: 'Atlantic salmon with lemon butter sauce' },
        { id: 'specialdish1', name: 'Filet Mignon', category: 'mains', price: 32.99, description: 'Premium cut steak with red wine reduction' },
        { id: 'specialdish2', name: 'Lobster Thermidor', category: 'mains', price: 42.99, description: 'Lobster with creamy wine sauce' },
        { id: 'drink1', name: 'House Red Wine', category: 'drinks', price: 9.99, description: 'Glass of our house cabernet sauvignon' },
        { id: 'drink2', name: 'Craft Beer', category: 'drinks', price: 7.99, description: 'Local IPA on tap' },
        { id: 'drink3', name: 'Espresso', category: 'drinks', price: 3.99, description: 'Double shot of our signature blend' },
        { id: 'dessert1', name: 'Tiramisu', category: 'desserts', price: 8.99, description: 'Classic Italian coffee-flavored dessert' },
        { id: 'dessert2', name: 'Chocolate Lava Cake', category: 'desserts', price: 9.99, description: 'Warm chocolate cake with a molten center' }
      ]
      setAllMenuItems(mockMenuItems)
      
      // Update categories with menu items
      const updatedCategories = [...menuCategories]
      updatedCategories.forEach(category => {
        category.menuItems = mockMenuItems.filter(item => item.category === category.id)
      })
      setMenuCategories(updatedCategories)
      
      setIsLoadingMenuItems(false)
    }, 1000)
  }
  
  // Load menu items when component mounts
  useEffect(() => {
    fetchMenuItems()
  }, [])

  // Add new menu rotation
  const handleAddMenuRotation = () => {
    const newId = menuRotations.length > 0 ? Math.max(...menuRotations.map(r => r.id)) + 1 : 1
    const newRotation = {
      id: newId,
      name: `New Menu ${newId}`,
      startTime: '12:00',
      endTime: '23:59',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      isActive: true,
      categories: [],
      description: 'Define your menu availability',
      icon: 'Coffee'
    }
    setMenuRotations([...menuRotations, newRotation])
    // Open editor for the new rotation
    setEditingRotation(newRotation)
    showNotification('New menu rotation added')
  }

  // Save menu rotation changes
  const handleSaveRotation = (rotation) => {
    setMenuRotations(menuRotations.map(r => 
      r.id === rotation.id ? rotation : r
    ))
    setEditingRotation(null)
    showNotification('Menu rotation updated successfully')
  }

  // Delete menu rotation
  const handleDeleteRotation = (id) => {
    if (window.confirm('Are you sure you want to delete this menu rotation?')) {
      setMenuRotations(menuRotations.filter(r => r.id !== id))
      setEditingRotation(null)
      showNotification('Menu rotation deleted')
    }
  }

  // Add new dynamic pricing rule
  const handleAddPricingRule = () => {
    const newId = dynamicPricingRules.length > 0 ? Math.max(...dynamicPricingRules.map(r => r.id)) + 1 : 1
    const newRule = {
      id: newId,
      name: `New Pricing Rule ${newId}`,
      adjustment: 0,
      startTime: '17:00',
      endTime: '19:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      isActive: true,
      categories: [],
      itemIds: [],
      applyTo: 'categories',
      description: 'Define your pricing adjustment',
      icon: 'Percent'
    }
    setDynamicPricingRules([...dynamicPricingRules, newRule])
    // Open editor for the new rule
    setEditingPricingRule(newRule)
    showNotification('New pricing rule added')
  }

  // Save pricing rule changes
  const handleSavePricingRule = (rule) => {
    setDynamicPricingRules(dynamicPricingRules.map(r => 
      r.id === rule.id ? rule : r
    ))
    setEditingPricingRule(null)
    showNotification('Pricing rule updated successfully')
  }

  // Delete pricing rule
  const handleDeletePricingRule = (id) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      setDynamicPricingRules(dynamicPricingRules.filter(r => r.id !== id))
      setEditingPricingRule(null)
      showNotification('Pricing rule deleted')
    }
  }

  // Toggle menu rotation active state
  const toggleMenuRotationActive = (id) => {
    setMenuRotations(menuRotations.map(rotation => 
      rotation.id === id ? { ...rotation, isActive: !rotation.isActive } : rotation
    ))
    showNotification('Menu rotation updated')
  }

  // Toggle pricing rule active state
  const togglePricingRuleActive = (id) => {
    setDynamicPricingRules(dynamicPricingRules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ))
    showNotification('Pricing rule updated')
  }
  
  // Calculate current active menu based on time and day
  const getCurrentActiveMenu = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const currentDay = days[now.getDay()]
    
    return menuRotations.filter(rotation => 
      rotation.isActive && 
      rotation.days.includes(currentDay) && 
      rotation.startTime <= currentTime && 
      rotation.endTime >= currentTime
    )
  }
  
  // Calculate price adjustment for an item
  const getItemPriceAdjustment = (itemId, category) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const currentDay = days[now.getDay()]
    
    // Find applicable rules
    const applicableRules = dynamicPricingRules.filter(rule => 
      rule.isActive && 
      rule.days.includes(currentDay) && 
      rule.startTime <= currentTime && 
      rule.endTime >= currentTime && 
      ((rule.applyTo === 'categories' && rule.categories.includes(category)) ||
       (rule.applyTo === 'items' && rule.itemIds.includes(itemId)))
    )
    
    // Calculate combined adjustment (could be policy-based, here we just take the most significant)
    if (applicableRules.length === 0) return 0
    
    // Find the largest absolute adjustment
    const significantRule = applicableRules.reduce((prev, current) => 
      Math.abs(current.adjustment) > Math.abs(prev.adjustment) ? current : prev
    )
    
    return significantRule.adjustment
  }
  
  // Preview adjusted item price
  const getAdjustedPrice = (basePrice, itemId, category) => {
    const adjustment = getItemPriceAdjustment(itemId, category)
    const multiplier = 1 + (adjustment / 100)
    return (basePrice * multiplier).toFixed(2)
  }

  // Apply theme preset
  const applyThemePreset = (preset) => {
    if (preset && typeof preset === 'object') {
      setColors(prev => ({
        ...prev,
        ...preset
      }))
    }
  }

  // =========== THEME PRESETS ===========
  
  // Color presets for easier selection
  const colorPresets = {
    primary: [
      '#7E6EFF', // Pink
      '#2563EB', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#000000', // Black
    ],
    text: [
      '#1F2937', // Dark gray
      '#4B5563', // Medium gray
      '#6B7280', // Light gray
      '#111827', // Almost black
      '#000000', // Black
      '#1E3A8A', // Dark blue
      '#7F1D1D', // Dark red
    ],
    background: [
      '#FFFFFF', // White
      '#F9FAFB', // Light gray
      '#F3F4F6', // Slightly darker light gray
      '#FEF3C7', // Light yellow
      '#E0F2FE', // Light blue
      '#F0FDF4', // Light green
      '#FEF2F2', // Light red
    ],
    secondary: [
      '#F9FAFB', // Light gray
      '#F3F4F6', // Slightly darker light gray
      '#E5E7EB', // Even darker light gray
      '#FFF7ED', // Light orange
      '#ECFDF5', // Light teal
      '#F0F9FF', // Light sky blue
      '#FFFBEB', // Light yellow
    ]
  }
  
  // Theme presets with complete color schemes
  const themePresets = {
    'pink': {
      primary: '#7E6EFF',
      secondary: '#F9FAFB',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'blue': {
      primary: '#2563EB',
      secondary: '#F0F9FF',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'green': {
      primary: '#10B981',
      secondary: '#F0FDF4',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'amber': {
      primary: '#F59E0B',
      secondary: '#FFFBEB',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'purple': {
      primary: '#8B5CF6',
      secondary: '#F5F3FF',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'red': {
      primary: '#EF4444',
      secondary: '#FEF2F2',
      text: '#1F2937',
      background: '#FFFFFF',
    },
    'slate': {
      primary: '#1E293B',
      secondary: '#F8FAFC',
      text: '#334155',
      background: '#FFFFFF',
    },
    'teal': {
      primary: '#0D9488',
      secondary: '#F0FDFA',
      text: '#1F2937',
      background: '#FFFFFF',
    }
  }

  // =========== COMPONENT DEFINITIONS ===========
  
  // Welcome Page Preview component
  const WelcomePagePreview = ({ isMini = false }) => (
    <div className={`relative ${isMini ? 'w-56 h-96' : 'w-72 h-[600px]'} border-8 border-gray-800 rounded-3xl overflow-hidden shadow-xl mx-auto transition-all duration-300`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-lg z-20"></div>
      
      {/* Welcome background */}
      <div 
        className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
        style={{ 
          backgroundColor: welcomeBackground ? 'transparent' : colors.primary,
          backgroundImage: welcomeBackground ? `url(${welcomeBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        
        {/* Center Logo - Made Larger */}
        <div className="flex flex-col items-center justify-center h-full z-10">
          {logo && (
            <div className="mb-6">
              <div 
                className={`
                  ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                  ${logoSize === 'small' ? 'h-24 w-24' : 
                    logoSize === 'medium' ? 'h-32 w-32' : 
                    'h-40 w-40'}
                  bg-white/20 backdrop-blur-sm p-2 mx-auto
                `}
              >
                <img 
                  src={logo} 
                  alt="Restaurant logo" 
                  className={`
                    ${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}
                  `}
                />
              </div>
            </div>
          )}
          
          {/* Welcome text */}
          <div className="relative z-10">
            <h1 className="text-xl font-bold text-white mb-2">{welcomeTitle}</h1>
            <p className="text-sm text-white/90">{welcomeSubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Phone menu preview component
  const PhonePreview = ({ isMini = false }) => (
    <div className={`relative ${isMini ? 'w-56 h-96' : 'w-72 h-[600px]'} border-8 border-gray-800 rounded-3xl overflow-hidden shadow-xl mx-auto transition-all duration-300`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-lg z-20"></div>
      
      {/* Banner/Header */}
      <div className="relative w-full h-32 overflow-hidden" style={{ 
        backgroundColor: banner ? 'transparent' : colors.primary,
        backgroundImage: banner ? `url(${banner})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Header content */}
        <div className="absolute inset-0 pt-8 px-4">
          <div className="flex items-center">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            
            {logo && (
              <div 
                className={`
                  ${logoPosition === 'left' ? 'absolute left-12' : 
                    'absolute left-1/2 transform -translate-x-1/2'}
                `}
              >
                <div 
                  className={`
                    ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                    ${logoSize === 'small' ? 'h-6 w-6' : 
                      logoSize === 'medium' ? 'h-8 w-8' : 
                      'h-10 w-10'}
                    flex items-center justify-center bg-white/20 p-0.5
                  `}
                >
                  <img 
                    src={logo} 
                    alt="Restaurant logo" 
                    className={`
                      ${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}
                    `}
                  />
                </div>
              </div>
            )}
            
            <div className="ml-auto flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
                <Search className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
                <Globe className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <h1 className="text-sm font-bold truncate text-white">Welcome to Restaurant Name</h1>
            <div className="inline-block bg-white/20 px-2 py-0.5 rounded-full mt-1 text-xs text-white">
              Table 12
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="h-[calc(100%-8rem)] overflow-y-auto bg-gray-100">
        {/* Category tabs */}
        <div className="flex overflow-x-auto px-2 py-2 space-x-2 bg-white border-b border-gray-200 hide-scrollbar">
          {['All', 'Starters', 'Mains'].map((category, index) => (
            <div key={index} className="flex flex-col items-center shrink-0">
              <div 
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-1 ${index === 0 ? 'text-white' : 'text-gray-600 bg-gray-100'}`}
                style={{ backgroundColor: index === 0 ? colors.primary : '' }}
              >
                <Coffee className="w-4 h-4" />
              </div>
              <span className={`text-[10px] ${index === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                {category}
              </span>
            </div>
          ))}
        </div>
        
        {/* Menu items */}
        <div className="p-2 space-y-2">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm" style={{ color: colors.text }}>Margherita Pizza</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">Fresh mozzarella, tomatoes, and basil</p>
                </div>
                <span className="font-bold text-sm ml-2" style={{ color: colors.primary }}>
                  $14.99
                </span>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="px-3 py-1 rounded-full text-white text-xs"
                  style={{ backgroundColor: colors.primary }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom floating button */}
      <div className="absolute bottom-4 right-4">
        <button 
          className="flex items-center px-3 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <ShoppingBag className="w-4 h-4 text-white" />
          <span className="ml-1 text-xs text-white font-medium">$0.00</span>
        </button>
      </div>
    </div>
  );

  // Customization tab navigation
  const CustomizationTabs = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCustomizationTab('branding')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeCustomizationTab === 'branding'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeCustomizationTab === 'branding' ? colors.primary : '' }}
        >
          <Image className="w-4 h-4 mr-2" />
          Logo & Banner
        </button>
        <button
          onClick={() => setActiveCustomizationTab('colors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeCustomizationTab === 'colors'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeCustomizationTab === 'colors' ? colors.primary : '' }}
        >
          <Palette className="w-4 h-4 mr-2" />
          Colors & Theme
        </button>
        <button
          onClick={() => setActiveCustomizationTab('welcome')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeCustomizationTab === 'welcome'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeCustomizationTab === 'welcome' ? colors.primary : '' }}
        >
          <Layout className="w-4 h-4 mr-2" />
          Welcome Page
        </button>
        <button
          onClick={() => setActiveCustomizationTab('preview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeCustomizationTab === 'preview'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeCustomizationTab === 'preview' ? colors.primary : '' }}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </button>
      </div>
    </div>
  );

  // Smart Menu tab navigation
  const SmartMenuTabs = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSmartMenuTab('rotation')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeSmartMenuTab === 'rotation'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeSmartMenuTab === 'rotation' ? colors.primary : '' }}
        >
          <Clock className="w-4 h-4 mr-2" />
          Menu Rotation
        </button>
        <button
          onClick={() => setActiveSmartMenuTab('pricing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            activeSmartMenuTab === 'pricing'
              ? 'text-white'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: activeSmartMenuTab === 'pricing' ? colors.primary : '' }}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Dynamic Pricing
        </button>
      </div>
    </div>
  );

  // Render week day selector
  const WeekdaySelector = ({ selectedDays, onChange }) => {
    const days = [
      { id: 'mon', label: 'M' },
      { id: 'tue', label: 'T' },
      { id: 'wed', label: 'W' },
      { id: 'thu', label: 'T' },
      { id: 'fri', label: 'F' },
      { id: 'sat', label: 'S' },
      { id: 'sun', label: 'S' }
    ];

    const toggleDay = (dayId) => {
      if (selectedDays.includes(dayId)) {
        onChange(selectedDays.filter(id => id !== dayId));
      } else {
        onChange([...selectedDays, dayId]);
      }
    };

    return (
      <div className="flex space-x-1">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => toggleDay(day.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              selectedDays.includes(day.id)
                ? 'text-white'
                : 'text-gray-600 bg-gray-100'
            }`}
            style={{ backgroundColor: selectedDays.includes(day.id) ? colors.primary : '' }}
          >
            {day.label}
          </button>
        ))}
      </div>
    );
  };

  // =========== RENDER ===========
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
              toastType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
              toastType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {toastType === 'success' && <Check className="w-5 h-5" />}
            {toastType === 'error' && <X className="w-5 h-5" />}
            {toastType === 'info' && <Info className="w-5 h-5" />}
            <p className="font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Suggestion Toast */}
      <AnimatePresence>
        {showSuggestion && currentSuggestion && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg max-w-md border ${
              currentSuggestion.type === 'pricing' 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                currentSuggestion.type === 'pricing' 
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {currentSuggestion.type === 'pricing' ? (
                  <Percent className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{currentSuggestion.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{currentSuggestion.description}</p>
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => dismissSuggestion(currentSuggestion.id)}
                    className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => applySuggestion(currentSuggestion)}
                    className="px-3 py-1.5 rounded-md text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                onClick={() => dismissSuggestion(currentSuggestion.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Editor Modal */}
      <AnimatePresence>
        {isEditingLogo && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50"
              onClick={handleCancelLogoEdit}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Customize Logo</h3>
                  <button 
                    onClick={handleCancelLogoEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      ref={imageEditorRef}
                      className={`relative w-64 h-64 overflow-hidden ${logoShape === 'circle' ? 'rounded-full' : 'rounded-lg'} border-2 border-gray-200 shadow-inner`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      {imageOriginal && (
                        <img 
                          ref={imageRef}
                          src={imageOriginal} 
                          alt="Logo preview" 
                          className="absolute"
                          style={{
                            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            transformOrigin: 'center',
                            left: '50%',
                            top: '50%',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                          }}
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                          onLoad={(e) => {
                            // Automatically calculate better initial zoom when image loads
                            if (imageEditorRef.current) {
                              const container = imageEditorRef.current.getBoundingClientRect()
                              const img = e.target
                              const imgRatio = img.naturalWidth / img.naturalHeight
                              const containerRatio = container.width / container.height
                              
                              // Calculate zoom to fit the entire image
                              let newZoom
                              if (imgRatio > containerRatio) {
                                // Image is wider than container
                                newZoom = container.width / img.naturalWidth * 0.8
                              } else {
                                // Image is taller than container
                                newZoom = container.height / img.naturalHeight * 0.8
                              }
                              
                              // Set the zoom (but don't zoom in beyond 1)
                              setZoom(Math.min(1, newZoom))
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Zoom</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleZoomOut}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={zoom <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4 text-gray-700" />
                        </button>
                        <button 
                          onClick={handleZoomIn}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={zoom >= 3}
                        >
                          <ZoomIn className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.01" 
                      value={zoom}
                      onChange={handleZoomChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex mb-3 space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Shape</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setLogoShape('circle')}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              logoShape === 'circle' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                : 'bg-white border border-gray-300 text-gray-700'
                            }`}
                          >
                            <Circle className="w-4 h-4 mr-1" />
                            Circle
                          </button>
                          <button
                            onClick={() => setLogoShape('square')}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              logoShape === 'square' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                : 'bg-white border border-gray-300 text-gray-700'
                            }`}
                          >
                            <Square className="w-4 h-4 mr-1" />
                            Original
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      <Info className="w-4 h-4 inline mr-1" />
                      Drag to position. Use zoom to adjust size.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelLogoEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveLogoEdit}
                      className="flex-1 px-4 py-2 text-white rounded-md transition-colors"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Save Logo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Banner Editor Modal */}
      <AnimatePresence>
        {isEditingBanner && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50"
              onClick={handleCancelBannerEdit}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Customize Banner</h3>
                  <button 
                    onClick={handleCancelBannerEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      ref={bannerEditorRef}
                      className="relative w-full h-32 overflow-hidden rounded-lg border-2 border-gray-200 shadow-inner"
                      onMouseDown={handleBannerMouseDown}
                      onMouseMove={handleBannerMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      {bannerOriginal && (
                        <img 
                          ref={bannerRef}
                          src={bannerOriginal} 
                          alt="Banner preview" 
                          className="absolute"
                          style={{
                            transform: `translate(-50%, -50%) translate(${bannerPosition.x}px, ${bannerPosition.y}px) scale(${bannerZoom})`,
                            transformOrigin: 'center',
                            left: '50%',
                            top: '50%',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                          }}
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                          onLoad={(e) => {
                            // Automatically calculate better initial zoom when image loads
                            if (bannerEditorRef.current) {
                              const container = bannerEditorRef.current.getBoundingClientRect()
                              const img = e.target
                              const imgRatio = img.naturalWidth / img.naturalHeight
                              const containerRatio = container.width / container.height
                              
                              // Calculate zoom to fit the entire image
                              let newZoom
                              if (imgRatio > containerRatio) {
                                // Image is wider than container
                                newZoom = container.height / img.naturalHeight * 0.8
                              } else {
                                // Image is taller than container
                                newZoom = container.width / img.naturalWidth * 0.8
                              }
                              
                              // Set the zoom (but don't zoom in beyond 1)
                              setBannerZoom(Math.min(1, newZoom))
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Zoom</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleBannerZoomOut}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={bannerZoom <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4 text-gray-700" />
                        </button>
                        <button 
                          onClick={handleBannerZoomIn}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={bannerZoom >= 3}
                        >
                          <ZoomIn className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.01" 
                      value={bannerZoom}
                      onChange={handleBannerZoomChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">
                      <Info className="w-4 h-4 inline mr-1" />
                      Drag to position. Use zoom to adjust size. The banner will replace the header background color.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelBannerEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBannerEdit}
                      className="flex-1 px-4 py-2 text-white rounded-md transition-colors"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Save Banner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Welcome Background Editor Modal */}
      <AnimatePresence>
        {isEditingWelcomeBackground && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50"
              onClick={handleCancelWelcomeBackgroundEdit}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Customize Welcome Background</h3>
                  <button 
                    onClick={handleCancelWelcomeBackgroundEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      ref={welcomeBackgroundEditorRef}
                      className="relative w-full h-56 overflow-hidden rounded-lg border-2 border-gray-200 shadow-inner"
                      onMouseDown={handleWelcomeBackgroundMouseDown}
                      onMouseMove={handleWelcomeBackgroundMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      {welcomeBackgroundOriginal && (
                        <img 
                          ref={welcomeBackgroundRef}
                          src={welcomeBackgroundOriginal} 
                          alt="Welcome background preview" 
                          className="absolute"
                          style={{
                            transform: `translate(-50%, -50%) translate(${welcomeBackgroundPosition.x}px, ${welcomeBackgroundPosition.y}px) scale(${welcomeBackgroundZoom})`,
                            transformOrigin: 'center',
                            left: '50%',
                            top: '50%',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                          }}
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                          onLoad={(e) => {
                            // Automatically calculate better initial zoom when image loads
                            if (welcomeBackgroundEditorRef.current) {
                              const container = welcomeBackgroundEditorRef.current.getBoundingClientRect()
                              const img = e.target
                              const imgRatio = img.naturalWidth / img.naturalHeight
                              const containerRatio = container.width / container.height
                              
                              // Calculate zoom to fit the entire image
                              let newZoom
                              if (imgRatio > containerRatio) {
                                // Image is wider than container
                                newZoom = container.height / img.naturalHeight * 0.8
                              } else {
                                // Image is taller than container
                                newZoom = container.width / img.naturalWidth * 0.8
                              }
                              
                              // Set the zoom (but don't zoom in beyond 1)
                              setWelcomeBackgroundZoom(Math.min(1, newZoom))
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Zoom</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleWelcomeBackgroundZoomOut}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={welcomeBackgroundZoom <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4 text-gray-700" />
                        </button>
                        <button 
                          onClick={handleWelcomeBackgroundZoomIn}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          disabled={welcomeBackgroundZoom >= 3}
                        >
                          <ZoomIn className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.01" 
                      value={welcomeBackgroundZoom}
                      onChange={handleWelcomeBackgroundZoomChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">
                      <Info className="w-4 h-4 inline mr-1" />
                      Drag to position. Use zoom to adjust size. This image will be used as the welcome page background.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelWelcomeBackgroundEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWelcomeBackgroundEdit}
                      className="flex-1 px-4 py-2 text-white rounded-md transition-colors"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Save Background
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
              <div className="h-8 w-auto">
  <img 
    src="https://i.imgur.com/J7wcKLS.png" 
    alt="Served Logo" 
    className="h-full w-auto object-contain"
  />
</div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {unsavedChanges && (
                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  unsavedChanges 
                    ? 'text-white focus:ring-blue-500 hover:opacity-90'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
                }`}
                style={{ backgroundColor: unsavedChanges ? colors.primary : '' }}
                disabled={!unsavedChanges}
              >
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-r border-gray-200 w-64 fixed inset-y-16 z-30 lg:relative lg:inset-y-0"
            >
              <div className="h-full flex flex-col">
                <nav className="flex-1 py-6 px-4">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveSection('dashboard')}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'dashboard'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Home className="w-5 h-5 mr-3" />
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection('customization')
                          setActiveCustomizationTab('branding')
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'customization'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Palette className="w-5 h-5 mr-3" />
                        Customization
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('analytics')}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'analytics'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <BarChart2 className="w-5 h-5 mr-3" />
                        Restaurant Analytics
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection('smartmenu')
                          setActiveSmartMenuTab('rotation')
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'smartmenu'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Zap className="w-5 h-5 mr-3" />
                        Smart Menu
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('growth')}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'growth'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <TrendingUp className="w-5 h-5 mr-3" />
                        Growth
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('settings')}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeSection === 'settings'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                      </button>
                    </li>
                  </ul>
                </nav>
                
                {/* Current theme info */}
                {activeSection === 'customization' && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Current Theme</h3>
                      <div className="flex space-x-2 items-center mb-2">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                        <span className="text-xs text-gray-600">Primary</span>
                      </div>
                      <div className="flex space-x-2 items-center">
                        {logo ? (
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            <img src={logo} alt="Logo" className="h-4 w-4 object-cover" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-600">Logo</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleReset}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main 
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'lg:ml-0' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
            
            {/* Dashboard content */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Served Dashboard</h2>
                    <p className="opacity-90">Customize your restaurant's digital menu experience from here.</p>
                  </div>

                  <div className="p-6">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-violet-50 to-indigo-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-indigo-500 text-white">
                          <Palette className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Customization</h3>
                        <p className="text-gray-600 text-sm mb-4">Personalize your menu's appearance, logo, and colors</p>
                        <button
                          onClick={() => {
                            setActiveSection('customization')
                            setActiveCustomizationTab('branding')
                          }}
                          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center"
                        >
                          Edit appearance <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-blue-500 text-white">
                          <BarChart2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Analytics</h3>
                        <p className="text-gray-600 text-sm mb-4">Track performance metrics and customer insights</p>
                        <button
                          onClick={() => setActiveSection('analytics')}
                          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
                        >
                          View analytics <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-amber-500 text-white">
                          <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Smart Menu</h3>
                        <p className="text-gray-600 text-sm mb-4">Schedule menu rotation and dynamic pricing</p>
                        <button
                          onClick={() => {
                            setActiveSection('smartmenu')
                            setActiveSmartMenuTab('rotation')
                          }}
                          className="text-amber-600 text-sm font-medium hover:text-amber-800 transition-colors flex items-center"
                        >
                          Configure <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-green-500 text-white">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Growth</h3>
                        <p className="text-gray-600 text-sm mb-4">Boost your business with review automation</p>
                        <button
                          onClick={() => setActiveSection('growth')}
                          className="text-green-600 text-sm font-medium hover:text-green-800 transition-colors flex items-center"
                        >
                          Explore tools <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                          onClick={() => {
                            setActiveSection('customization');
                            setActiveCustomizationTab('branding');
                            setTimeout(() => logoInputRef.current?.click(), 500);
                          }}
                          className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">Upload Logo</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveSection('customization');
                            setActiveCustomizationTab('welcome');
                            setTimeout(() => welcomeBackgroundInputRef.current?.click(), 500);
                          }}
                          className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <FileImage className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">Edit Welcome Page</span>
                        </button>
                        
                        <button
                          onClick={handleSave}
                          className={`flex items-center justify-center p-4 rounded-lg border ${
                            unsavedChanges
                              ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                          } transition-colors`}
                          disabled={!unsavedChanges}
                        >
                          <Save className={`w-5 h-5 mr-2 ${unsavedChanges ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span>Save Changes</span>
                        </button>
                        
                        <button
                          onClick={() => navigate('/menu/1')}
                          className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">View Menu</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Recent activity or stats section */}
                    <div className="mt-10">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">Theme Status</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-500 mb-1">Primary Color</div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.primary }}></div>
                              <span className="font-mono text-sm">{colors.primary}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-500 mb-1">Logo</div>
                            <div className="flex items-center">
                              {logo ? (
                                <>
                                  <div className="w-6 h-6 mr-2 border border-gray-200 rounded-full overflow-hidden bg-white">
                                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                                  </div>
                                  <span className="text-sm text-gray-700">Uploaded</span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">Not set</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-500 mb-1">Welcome Background</div>
                            <div className="flex items-center">
                              {welcomeBackground ? (
                                <>
                                  <div className="w-10 h-6 mr-2 border border-gray-200 rounded overflow-hidden bg-white">
                                    <img src={welcomeBackground} alt="Welcome background" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-sm text-gray-700">Uploaded</span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">Using primary color</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${unsavedChanges ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              <span className="text-sm">{unsavedChanges ? 'Unsaved changes' : 'Up to date'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customization section */}
            {activeSection === 'customization' && (
              <div className="space-y-6">
                <CustomizationTabs />
                
                {/* Logo & Banner Section */}
                {activeCustomizationTab === 'branding' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Logo Upload Section */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Logo</h2>
                          <p className="text-gray-500 text-sm mt-1">Upload and customize your restaurant's logo</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="space-y-4">
                              {logo ? (
                                <div className="relative w-full max-w-md">
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                                    <div 
                                      className={`
                                        ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                                        h-32 w-32 cursor-pointer
                                      `}
                                      onClick={() => {
                                        // Edit existing logo
                                        setImageOriginal(logo)
                                        setIsEditingLogo(true)
                                      }}
                                    >
                                      <img 
                                        src={logo} 
                                        alt="Logo" 
                                        className={`
                                          ${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-full object-contain'}
                                        `}
                                      />
                                    </div>
                                    <button
                                      onClick={handleLogoRemove}
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                      aria-label="Remove logo"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="mt-2 text-xs text-blue-600">
                                    Click on the image to edit
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-40" 
                                  onClick={() => logoInputRef.current?.click()}
                                >
                                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                                    <Image className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm text-gray-600 font-medium">Upload your restaurant logo</p>
                                  <p className="text-xs text-gray-500 mt-1">Will be shown on menu pages and welcome screen</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                ref={logoInputRef}
                                onChange={handleLogoUpload} 
                                accept="image/*" 
                                className="hidden" 
                              />
                              <button
                                onClick={() => logoInputRef.current?.click()}
                                className="inline-flex items-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                              >
                                {logo ? 'Change Logo' : 'Upload Logo'}
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Shape</label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setLogoShape('circle')}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                      logoShape === 'circle' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    <Circle className="w-4 h-4 mr-1" />
                                    Circle
                                  </button>
                                  <button
                                    onClick={() => setLogoShape('square')}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                      logoShape === 'square' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    <Square className="w-4 h-4 mr-1" />
                                    Original
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setLogoPosition('left')}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                      logoPosition === 'left' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    <AlignLeft className="w-4 h-4 mr-1" />
                                    Left
                                  </button>
                                  <button
                                    onClick={() => setLogoPosition('center')}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                      logoPosition === 'center' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    <AlignCenter className="w-4 h-4 mr-1" />
                                    Center
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Size</label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setLogoSize('small')}
                                    className={`px-3 py-2 rounded-md text-sm ${
                                      logoSize === 'small' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    Small
                                  </button>
                                  <button
                                    onClick={() => setLogoSize('medium')}
                                    className={`px-3 py-2 rounded-md text-sm ${
                                      logoSize === 'medium' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    Medium
                                  </button>
                                  <button
                                    onClick={() => setLogoSize('large')}
                                    className={`px-3 py-2 rounded-md text-sm ${
                                      logoSize === 'large' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    Large
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-500">
                              <Info className="w-4 h-4 inline mr-1" />
                              Your logo will appear in the menu header and welcome page.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Banner Upload Section */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Banner</h2>
                          <p className="text-gray-500 text-sm mt-1">Customize your menu header banner</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="space-y-4">
                              {banner ? (
                                <div className="relative w-full max-w-md">
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                                    <div 
                                      className="w-full h-28 cursor-pointer overflow-hidden rounded-md"
                                      onClick={() => {
                                        // Edit existing banner
                                        setBannerOriginal(banner)
                                        setIsEditingBanner(true)
                                      }}
                                    >
                                      <img 
                                        src={banner} 
                                        alt="Banner" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      onClick={handleBannerRemove}
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                      aria-label="Remove banner"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="mt-2 text-xs text-blue-600">
                                    Click on the image to edit
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-28" 
                                  onClick={() => bannerInputRef.current?.click()}
                                >
                                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                                    <FileImage className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm text-gray-600 font-medium">Upload a banner image</p>
                                  <p className="text-xs text-gray-500 mt-1">Will be displayed at the top of menu pages</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                ref={bannerInputRef}
                                onChange={handleBannerUpload} 
                                accept="image/*" 
                                className="hidden" 
                              />
                              <button
                                onClick={() => bannerInputRef.current?.click()}
                                className="inline-flex items-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                              >
                                {banner ? 'Change Banner' : 'Upload Banner'}
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-500">
                              <Info className="w-4 h-4 inline mr-1" />
                              The banner will be displayed at the top of each menu page. If no banner is uploaded, your primary color will be used instead.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo and Banner Preview */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-center mb-6">Logo Preview</h3>
                        <div className="flex flex-col items-center">
                          {logo ? (
                            <div 
                              className={`
                                ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                                ${logoSize === 'small' ? 'h-16 w-16' : 
                                  logoSize === 'medium' ? 'h-24 w-24' : 
                                  'h-32 w-32'}
                                bg-gray-100 p-1 flex items-center justify-center
                              `}
                            >
                              <img 
                                src={logo} 
                                alt="Logo preview" 
                                className={`
                                  ${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}
                                `}
                              />
                            </div>
                          ) : (
                            <div 
                              className={`
                                ${logoShape === 'circle' ? 'rounded-full' : 'rounded-lg'}
                                ${logoSize === 'small' ? 'h-16 w-16' : 
                                  logoSize === 'medium' ? 'h-24 w-24' : 
                                  'h-32 w-32'}
                                bg-gray-200 flex items-center justify-center
                              `}
                            >
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <p className="text-sm text-center text-gray-500 mt-4">
                            {logo ? 'Your restaurant logo' : 'No logo uploaded yet'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="p-6 border-b border-gray-100">
                          <h3 className="text-lg font-medium text-center">Menu Preview</h3>
                        </div>
                        <div className="p-4 flex justify-center">
                          <PhonePreview isMini={true} />
                        </div>
                        <div className="p-4 text-center">
                          <button
                            onClick={() => setActiveCustomizationTab('preview')}
                            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center mx-auto"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Full Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Colors & Theme Section */}
                {activeCustomizationTab === 'colors' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Quick Color Themes */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Quick Color Themes</h2>
                          <p className="text-gray-500 text-sm mt-1">Choose a predefined color scheme</p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button 
                              onClick={() => applyThemePreset(themePresets.pink)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#7E6EFF' ? '#7E6EFF' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#7E6EFF]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F9FAFB] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Pink (Default)</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.blue)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#2563EB' ? '#2563EB' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#2563EB]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F0F9FF] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Blue Sky</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.green)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#10B981' ? '#10B981' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#10B981]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F0FDF4] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Fresh Green</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.amber)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#F59E0B' ? '#F59E0B' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#F59E0B]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#FFFBEB] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Warm Amber</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.purple)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#8B5CF6' ? '#8B5CF6' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#8B5CF6]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F5F3FF] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Royal Purple</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.red)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#EF4444' ? '#EF4444' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#EF4444]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#FEF2F2] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Vibrant Red</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.slate)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#1E293B' ? '#1E293B' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#1E293B]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#334155]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F8FAFC] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Classic Slate</p>
                            </button>
                            
                            <button 
                              onClick={() => applyThemePreset(themePresets.teal)}
                              className="bg-white p-3 rounded-xl border-2 hover:shadow-md transition-shadow"
                              style={{ borderColor: colors.primary === '#0D9488' ? '#0D9488' : 'transparent' }}
                            >
                              <div className="flex justify-between space-x-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#0D9488]"></div>
                                <div className="w-6 h-6 rounded-full bg-[#1F2937]"></div>
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200"></div>
                                <div className="w-6 h-6 rounded-full bg-[#F0FDFA] border border-gray-200"></div>
                              </div>
                              <p className="text-sm font-medium text-center">Teal Monochrome</p>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Color Selection */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Theme Colors</h2>
                          <p className="text-gray-500 text-sm mt-1">Customize your menu's color palette</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-8">
                            {/* Primary Color */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                <div 
                                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                                  style={{ backgroundColor: colors.primary }}
                                ></div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {colorPresets.primary.map((color, index) => (
                                  <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 ${colors.primary === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange('primary', color)}
                                    aria-label={`Select color ${color}`}
                                  ></button>
                                ))}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Custom:</span>
                                <input
                                  type="color"
                                  value={colors.primary}
                                  onChange={(e) => handleColorChange('primary', e.target.value)}
                                  className="h-8 w-16 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={colors.primary}
                                  onChange={(e) => handleColorChange('primary', e.target.value)}
                                  className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Used for buttons, accents, and highlights throughout the menu.
                              </p>
                            </div>
                            
                            {/* Text Color */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                                <div 
                                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                                  style={{ backgroundColor: colors.text }}
                                ></div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {colorPresets.text.map((color, index) => (
                                  <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 ${colors.text === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange('text', color)}
                                    aria-label={`Select color ${color}`}
                                  ></button>
                                ))}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Custom:</span>
                                <input
                                  type="color"
                                  value={colors.text}
                                  onChange={(e) => handleColorChange('text', e.target.value)}
                                  className="h-8 w-16 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={colors.text}
                                  onChange={(e) => handleColorChange('text', e.target.value)}
                                  className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Used for main text content like item names and descriptions.
                              </p>
                            </div>
                            
                            {/* Background Color */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                                <div 
                                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                                  style={{ backgroundColor: colors.background }}
                                ></div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {colorPresets.background.map((color, index) => (
                                  <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 ${colors.background === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange('background', color)}
                                    aria-label={`Select color ${color}`}
                                  ></button>
                                ))}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Custom:</span>
                                <input
                                  type="color"
                                  value={colors.background}
                                  onChange={(e) => handleColorChange('background', e.target.value)}
                                  className="h-8 w-16 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={colors.background}
                                  onChange={(e) => handleColorChange('background', e.target.value)}
                                  className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Main background color for the menu UI.
                              </p>
                            </div>
                            
                            {/* Secondary Color */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                                <div 
                                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                                  style={{ backgroundColor: colors.secondary }}
                                ></div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {colorPresets.secondary.map((color, index) => (
                                  <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 ${colors.secondary === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange('secondary', color)}
                                    aria-label={`Select color ${color}`}
                                  ></button>
                                ))}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Custom:</span>
                                <input
                                  type="color"
                                  value={colors.secondary}
                                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                                  className="h-8 w-16 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={colors.secondary}
                                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                                  className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Used for supporting UI elements and backgrounds.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Theme Preview */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-center mb-6">Theme Preview</h3>
                        <div 
                          className="rounded-lg overflow-hidden shadow-sm border border-gray-200"
                          style={{ backgroundColor: colors.background }}
                        >
                          {/* Header */}
                          <div 
                            className="p-4"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <h4 className="text-white font-medium text-center">Restaurant Name</h4>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4 space-y-4">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                              <div className="flex justify-between items-center">
                                <h5 className="font-medium" style={{ color: colors.text }}>Menu Item</h5>
                                <span className="font-bold" style={{ color: colors.primary }}>$12.99</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">Description of this delicious menu item</p>
                              <div className="flex justify-end mt-2">
                                <button 
                                  className="px-3 py-1 rounded-full text-white text-xs"
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  Add to Order
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <h5 
                                className="text-sm font-medium mb-2"
                                style={{ color: colors.text }}
                              >
                                Category
                              </h5>
                              <div className="flex space-x-2">
                                <div 
                                  className="h-12 w-12 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  <Coffee className="text-white w-5 h-5" />
                                </div>
                                <div 
                                  className="h-12 w-12 rounded-lg flex items-center justify-center bg-gray-100"
                                >
                                  <Coffee style={{ color: colors.text }} className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <PhonePreview isMini={true} />
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setActiveCustomizationTab('preview')}
                            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors inline-flex items-center"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Full Preview
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-center mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button
                            onClick={handleSave}
                            className={`w-full flex items-center justify-center p-3 rounded-md ${
                              unsavedChanges
                                ? 'text-white font-medium'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            style={{ backgroundColor: unsavedChanges ? colors.primary : '' }}
                            disabled={!unsavedChanges}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                          
                          <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset to Default
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Welcome Page Section */}
                {activeCustomizationTab === 'welcome' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Welcome Background Upload Section */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Welcome Page Background</h2>
                          <p className="text-gray-500 text-sm mt-1">Upload and customize your welcome page background image</p>
                        </div>

                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="space-y-4">
                              {welcomeBackground ? (
                                <div className="relative w-full max-w-md">
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                                    <div 
                                      className="w-full h-40 cursor-pointer overflow-hidden rounded-md"
                                      onClick={() => {
                                        // Edit existing welcome background
                                        setWelcomeBackgroundOriginal(welcomeBackground)
                                        setIsEditingWelcomeBackground(true)
                                      }}
                                    >
                                      <img 
                                        src={welcomeBackground} 
                                        alt="Welcome background" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      onClick={handleWelcomeBackgroundRemove}
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                      aria-label="Remove welcome background"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="mt-2 text-xs text-blue-600">
                                    Click on the image to edit
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-40" 
                                  onClick={() => welcomeBackgroundInputRef.current?.click()}
                                >
                                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                                    <Image className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm text-gray-600 font-medium">Upload a welcome page background image</p>
                                  <p className="text-xs text-gray-500 mt-1">Will be displayed behind welcome text and QR code</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                ref={welcomeBackgroundInputRef}
                                onChange={handleWelcomeBackgroundUpload} 
                                accept="image/*" 
                                className="hidden" 
                              />
                              <button
                                onClick={() => welcomeBackgroundInputRef.current?.click()}
                                className="inline-flex items-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                              >
                                {welcomeBackground ? 'Change Background' : 'Upload Background'}
                              </button>
                            </div>

                            <p className="text-sm text-gray-500">
                              <Info className="w-4 h-4 inline mr-1" />
                              The welcome page is shown before customers enter the menu. It's the perfect place for branding and instructions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Welcome Text Section */}
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <h2 className="text-xl font-semibold text-gray-800">Welcome Text</h2>
                          <p className="text-gray-500 text-sm mt-1">Customize the welcome page text</p>
                        </div>

                        <div className="p-6">
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Welcome Title
                                <span className="ml-2 text-xs text-gray-500">(Max 40 characters)</span>
                              </label>
                              <input
                                type="text"
                                value={welcomeTitle}
                                onChange={(e) => setWelcomeTitle(e.target.value.slice(0, 40))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Welcome to Our Restaurant"
                                maxLength={40}
                              />
                              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                                <span>Main heading on the welcome page</span>
                                <span>{welcomeTitle.length}/40</span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Welcome Subtitle
                                <span className="ml-2 text-xs text-gray-500">(Max 80 characters)</span>
                              </label>
                              <input
                                type="text"
                                value={welcomeSubtitle}
                                onChange={(e) => setWelcomeSubtitle(e.target.value.slice(0, 80))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Scan the QR code to view our menu"
                                maxLength={80}
                              />
                              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                                <span>Secondary text below the main heading</span>
                                <span>{welcomeSubtitle.length}/80</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Welcome Page Preview */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-center mb-6">Welcome Page Preview</h3>
                        <WelcomePagePreview />
                        <p className="text-sm text-center text-gray-500 mt-4">
                          <Info className="w-4 h-4 inline mr-1" />
                          This is how customers will see your welcome page
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200">
                        <div className="space-y-3">
                          <button
                            onClick={handleSave}
                            className={`w-full flex items-center justify-center p-3 rounded-md ${
                              unsavedChanges
                                ? 'text-white font-medium'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            style={{ backgroundColor: unsavedChanges ? colors.primary : '' }}
                            disabled={!unsavedChanges}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Preview Section */}
                {activeCustomizationTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Menu Preview</h2>
                        <p className="text-gray-500 text-sm mt-1">See how your menu will look to customers on different devices</p>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-medium text-gray-700">Device Preview</h3>
                          <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
                            <button
                              onClick={() => setPreviewDevice('mobile')}
                              className={`px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                                previewDevice === 'mobile' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
                              }`}
                            >
                              <Smartphone className="w-4 h-4 mr-1.5" />
                              Mobile
                            </button>
                            <button
                              onClick={() => setPreviewDevice('tablet')}
                              className={`px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                                previewDevice === 'tablet' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
                              }`}
                            >
                              <PanelLeft className="w-4 h-4 mr-1.5" />
                              Tablet
                            </button>
                            <button
                              onClick={() => setPreviewDevice('desktop')}
                              className={`px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                                previewDevice === 'desktop' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
                              }`}
                            >
                              <Laptop className="w-4 h-4 mr-1.5" />
                              Desktop
                            </button>
                          </div>
                        </div>
                        
                        {/* Mobile Preview - Welcome Page */}
                        {previewDevice === 'mobile' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center">
                              <div className="mb-4 text-center">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  Welcome Page
                                </span>
                              </div>
                              <WelcomePagePreview />
                              <div className="mt-6">
                                <p className="text-sm text-gray-500 text-center">
                                  <Info className="w-4 h-4 inline mr-1" />
                                  Initial screen customers will see
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="mb-4 text-center">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  Menu Page
                                </span>
                              </div>
                              <PhonePreview />
                              <div className="mt-6">
                                <p className="text-sm text-gray-500 text-center">
                                  <Info className="w-4 h-4 inline mr-1" />
                                  Main menu interface
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Tablet Preview */}
                        {previewDevice === 'tablet' && (
                          <div className="flex flex-col items-center">
                            <div className="mb-4 text-center">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                iPad / Tablet
                              </span>
                            </div>
                            <div className="relative w-[500px] h-[700px] border-12 border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                              {/* Tablet home button */}
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 border-gray-600"></div>
                              
                              {/* Banner/Header */}
                              <div className="relative w-full h-40 overflow-hidden" style={{ 
                                backgroundColor: banner ? 'transparent' : colors.primary,
                                backgroundImage: banner ? `url(${banner})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}>
                                {/* Header content */}
                                <div className="absolute inset-0 pt-10 px-6">
                                  <div className="flex items-center">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20">
                                      <ArrowLeft className="w-4 h-4 text-white" />
                                    </button>
                                    
                                    {logo && (
                                      <div 
                                        className={`
                                          ${logoPosition === 'left' ? 'absolute left-16' : 
                                            'absolute left-1/2 transform -translate-x-1/2'}
                                        `}
                                      >
                                        <div 
                                          className={`
                                            ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                                            ${logoSize === 'small' ? 'h-8 w-8' : 
                                              logoSize === 'medium' ? 'h-10 w-10' : 
                                              'h-14 w-14'}
                                            flex items-center justify-center bg-white/20 p-1
                                          `}
                                        >
                                          <img 
                                            src={logo} 
                                            alt="Restaurant logo" 
                                            className={`
                                              ${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}
                                            `}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="ml-auto flex space-x-2">
                                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20">
                                        <Search className="w-4 h-4 text-white" />
                                      </button>
                                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20">
                                        <Globe className="w-4 h-4 text-white" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="text-center mt-4" style={{ color: 'white' }}>
                                    <h1 className="text-xl font-bold">Welcome to Restaurant Name</h1>
                                    <div className="inline-block bg-white/20 px-3 py-1 rounded-full mt-2 text-sm">
                                      Table 12
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="h-[calc(100%-10rem)] overflow-y-auto bg-gray-100">
                                {/* Category tabs */}
                                <div className="flex overflow-x-auto px-4 py-3 space-x-4 bg-white border-b border-gray-200 hide-scrollbar">
                                  {['All', 'Starters', 'Mains', 'Desserts', 'Drinks'].map((category, index) => (
                                    <div key={index} className="flex flex-col items-center shrink-0">
                                      <div 
                                        className={`w-16 h-16 rounded-lg flex items-center justify-center mb-1 ${index === 0 ? 'text-white' : 'text-gray-600 bg-gray-100'}`}
                                        style={{ backgroundColor: index === 0 ? colors.primary : '' }}
                                      >
                                        <Coffee className="w-6 h-6" />
                                      </div>
                                      <span className={`text-xs ${index === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                        {category}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Menu items */}
                                <div className="p-4 space-y-4 grid grid-cols-2 gap-4">
                                  {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3 className="font-medium" style={{ color: colors.text }}>Margherita Pizza</h3>
                                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">Fresh mozzarella, tomatoes, and basil on our signature crust</p>
                                        </div>
                                        <span className="font-bold" style={{ color: colors.primary }}>$14.99</span>
                                      </div>
                                      <div className="flex justify-end mt-3">
                                        <button
                                          className="px-4 py-2 rounded-full text-white text-sm"
                                          style={{ backgroundColor: colors.primary }}
                                        >
                                          Add to Cart
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 flex justify-center">
                              <button
                                onClick={() => navigate('/menu/1')}
                                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center"
                                style={{ backgroundColor: colors.primary }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Live Menu
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Desktop Preview */}
                        {previewDevice === 'desktop' && (
                          <div className="flex flex-col items-center">
                            <div className="mb-4 text-center">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Laptop / Desktop
                              </span>
                            </div>
                            <div className="relative w-[800px] h-[500px] border-t-8 border-l-8 border-r-8 border-b-16 border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                              {/* Desktop camera */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-2 h-2 rounded-full bg-gray-600 ring-2 ring-gray-800"></div>
                              
                              {/* Content */}
                              <div className="flex h-full bg-gray-100">
                                {/* Sidebar */}
                                <div className="w-56 bg-white border-r border-gray-200 overflow-hidden shrink-0">
                                  <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-center">
                                      {logo && (
                                        <div className={`${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''} w-12 h-12 mr-2`}>
                                          <img 
                                            src={logo} 
                                            alt="Restaurant logo" 
                                            className={`${logoShape === 'circle' ? 'h-full w-full object-cover' : 'h-full w-auto object-contain'}`}
                                          />
                                        </div>
                                      )}
                                      <h2 className="font-bold text-lg" style={{ color: colors.text }}>Restaurant</h2>
                                    </div>
                                  </div>
                                  <div className="p-2">
                                    <div className="rounded-lg bg-gray-100 p-2 mb-1">
                                      <div className="flex items-center text-sm font-medium" style={{ color: colors.primary }}>
                                        <Coffee className="w-4 h-4 mr-2" />
                                        All
                                      </div>
                                    </div>
                                    <div className="rounded-lg hover:bg-gray-100 p-2 mb-1">
                                      <div className="flex items-center text-sm text-gray-700">
                                        <Coffee className="w-4 h-4 mr-2" />
                                        Starters
                                      </div>
                                    </div>
                                    <div className="rounded-lg hover:bg-gray-100 p-2 mb-1">
                                      <div className="flex items-center text-sm text-gray-700">
                                        <Coffee className="w-4 h-4 mr-2" />
                                        Mains
                                      </div>
                                    </div>
                                    <div className="rounded-lg hover:bg-gray-100 p-2 mb-1">
                                      <div className="flex items-center text-sm text-gray-700">
                                        <Coffee className="w-4 h-4 mr-2" />
                                        Desserts
                                      </div>
                                    </div>
                                    <div className="rounded-lg hover:bg-gray-100 p-2 mb-1">
                                      <div className="flex items-center text-sm text-gray-700">
                                        <Coffee className="w-4 h-4 mr-2" />
                                        Drinks
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Main content */}
                                <div className="flex-1 overflow-y-auto">
                                  {/* Header */}
                                  <div className="sticky top-0 z-10 p-4 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="font-bold text-lg" style={{ color: colors.text }}>All Items</h2>
                                    <div className="flex items-center space-x-2">
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="Search menu..."
                                          className="w-56 px-4 py-2 pr-8 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                          style={{ 
                                            focusRing: colors.primary,
                                            color: colors.text
                                          }}
                                        />
                                        <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                      </div>
                                      <button className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                                        <MoreHorizontal className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Menu items grid */}
                                  <div className="p-4 grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((item) => (
                                      <div key={item} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h3 className="font-medium" style={{ color: colors.text }}>Margherita Pizza</h3>
                                            <p className="text-sm text-gray-500 mt-1">Fresh mozzarella, tomatoes, and basil on our signature crust</p>
                                          </div>
                                          <span className="font-bold" style={{ color: colors.primary }}>$14.99</span>
                                        </div>
                                        <div className="flex justify-end mt-3">
                                          <button
                                            className="px-4 py-2 rounded-full text-white text-sm"
                                            style={{ backgroundColor: colors.primary }}
                                          >
                                            Add to Cart
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 flex justify-center">
                              <button
                                onClick={() => navigate('/menu/1')}
                                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center"
                                style={{ backgroundColor: colors.primary }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Live Menu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Analytics Section (Coming Soon) */}
            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart2 className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Restaurant Analytics</h2>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">
                      Gain valuable insights into your restaurant's performance with detailed analytics. Track orders, popular items, peak hours, and more.
                    </p>
                    <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                      Coming Soon!
                    </div>
                    
                    <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <Activity className="w-8 h-8 text-indigo-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Order Metrics</h3>
                        <p className="text-sm text-gray-500">Track total orders, average order value, and popular ordering times</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <Coffee className="w-8 h-8 text-indigo-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Menu Performance</h3>
                        <p className="text-sm text-gray-500">Analyze your best and worst performing menu items</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <TrendingUp className="w-8 h-8 text-indigo-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Trend Analysis</h3>
                        <p className="text-sm text-gray-500">See how your restaurant performs over time and identify opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Smart Menu Section */}
            {activeSection === 'smartmenu' && (
              <div className="space-y-6">
                <SmartMenuTabs />
                
                {/* Menu Rotation Section */}
                {activeSmartMenuTab === 'rotation' && (
                  <div className="space-y-6">
                    {/* Current Active Menu Status */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" />
                          Current Active Menu
                        </h2>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          {getCurrentActiveMenu().length > 0 ? (
                            <>
                              <div className="flex items-center mb-2">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  <Coffee className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800">{getCurrentActiveMenu()[0].name}</h3>
                                  <p className="text-sm text-gray-600">{getCurrentActiveMenu()[0].description}</p>
                                </div>
                                <div className="ml-auto">
                                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <span className="text-sm text-gray-700 font-medium">Available Categories:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {getCurrentActiveMenu()[0].categories.map(catId => {
                                    const category = menuCategories.find(c => c.id === catId)
                                    return category ? (
                                      <span key={catId} className="text-xs px-2 py-1 bg-white text-gray-700 rounded-full border border-gray-200">
                                        {category.name}
                                      </span>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">No Active Menu</h3>
                                <p className="text-sm text-gray-600">
                                  No menu is currently active based on your schedules.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Menu Rotation</h2>
                        <p className="text-gray-500 text-sm mt-1">
                          Automatically change your menu offerings at specific times. Control which menu sections are visible based on time of day and day of week.
                        </p>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-6">
                          {/* Editing Interface for Rotation */}
                          {editingRotation && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                              <h3 className="text-lg font-medium text-gray-800 mb-4">
                                {editingRotation.id ? 'Edit' : 'New'} Menu Rotation
                              </h3>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                                  <input 
                                    type="text"
                                    value={editingRotation.name}
                                    onChange={e => setEditingRotation({...editingRotation, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g. Breakfast Menu"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <input 
                                    type="text"
                                    value={editingRotation.description}
                                    onChange={e => setEditingRotation({...editingRotation, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Brief description of this menu"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input 
                                      type="time"
                                      value={editingRotation.startTime}
                                      onChange={e => setEditingRotation({...editingRotation, startTime: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input 
                                      type="time"
                                      value={editingRotation.endTime}
                                      onChange={e => setEditingRotation({...editingRotation, endTime: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                                  <WeekdaySelector 
                                    selectedDays={editingRotation.days}
                                    onChange={(days) => setEditingRotation({...editingRotation, days})}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Categories</label>
                                  <div className="bg-white border border-gray-200 rounded-md max-h-64 overflow-y-auto p-3">
                                    {isLoadingMenuItems ? (
                                      <div className="flex justify-center py-4">
                                        <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                      </div>
                                    ) : (
                                      menuCategories.map(category => (
                                        <div key={category.id} className="flex items-center mb-2 last:mb-0">
                                          <input
                                            type="checkbox"
                                            id={`cat-${category.id}`}
                                            checked={editingRotation.categories.includes(category.id)}
                                            onChange={(e) => {
                                              const checked = e.target.checked
                                              setEditingRotation(prev => ({
                                                ...prev,
                                                categories: checked 
                                                  ? [...prev.categories, category.id]
                                                  : prev.categories.filter(id => id !== category.id)
                                              }))
                                            }}
                                            className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                          />
                                          <label htmlFor={`cat-${category.id}`} className="text-sm text-gray-700">
                                            {category.name} <span className="text-xs text-gray-500">({category.menuItems.length} items)</span>
                                          </label>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Only selected categories will be visible to customers during this time slot.
                                  </p>
                                </div>
                                
                                <div className="flex space-x-3 pt-3">
                                  <button
                                    onClick={() => setEditingRotation(null)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  {editingRotation.id && (
                                    <button
                                      onClick={() => handleDeleteRotation(editingRotation.id)}
                                      className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 hover:bg-red-100"
                                    >
                                      Delete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleSaveRotation(editingRotation)}
                                    className="flex-1 px-4 py-2 text-white rounded-md"
                                    style={{ backgroundColor: colors.primary }}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Menu Rotation Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menuRotations.map((rotation) => (
                              <div 
                                key={rotation.id} 
                                className={`p-4 border ${rotation.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                                onClick={() => setEditingRotation(rotation)}
                              >
                                <div className="flex items-start">
                                  <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${rotation.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}
                                  >
                                    <Coffee className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-medium text-gray-800">{rotation.name}</h3>
                                      <div className={`ml-3 px-2 py-0.5 text-xs rounded-full ${rotation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {rotation.isActive ? 'Active' : 'Inactive'}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{rotation.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center text-xs text-gray-600">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {rotation.startTime} - {rotation.endTime}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {rotation.categories.length} categories
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                  <div className="flex space-x-1">
                                    {rotation.days.includes('mon') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">M</span>}
                                    {rotation.days.includes('tue') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">T</span>}
                                    {rotation.days.includes('wed') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">W</span>}
                                    {rotation.days.includes('thu') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">T</span>}
                                    {rotation.days.includes('fri') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">F</span>}
                                    {rotation.days.includes('sat') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">S</span>}
                                    {rotation.days.includes('sun') && <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">S</span>}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleMenuRotationActive(rotation.id)
                                      }}
                                      className={`p-1.5 rounded ${rotation.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                    >
                                      {rotation.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add New Menu Rotation Card */}
                            <button
                              onClick={handleAddMenuRotation}
                              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                <Plus className="w-5 h-5 text-gray-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Add New Menu Rotation</p>
                              <p className="text-xs text-gray-500 mt-1">Create time-based menu availability</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900 mb-1">How Menu Rotation Works</h3>
                          <p className="text-blue-800 text-sm">
                            Control which menu sections are visible at different times. For example, show breakfast items in the morning, lunch menu during midday, and dinner options in the evening.
                          </p>
                          <div className="mt-4 bg-white p-3 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for Effective Menu Rotation</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-1">•</span>
                                <span>Define separate rotations for breakfast, lunch, and dinner times</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-1">•</span>
                                <span>Create weekend-specific menus for special brunch offerings</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-1">•</span>
                                <span>Ensure time slots don't overlap to avoid confusion about which menu applies</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Dynamic Pricing Section */}
                {activeSmartMenuTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Active Pricing Rules Status */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <Percent className="w-5 h-5 mr-2 text-amber-600" />
                          Active Pricing Rules
                        </h2>
                        
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                          {dynamicPricingRules.filter(rule => 
                            rule.isActive && 
                            rule.days.includes(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()])
                          ).length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-800">Price Adjustments in Effect</h3>
                                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {dynamicPricingRules.filter(rule => 
                                  rule.isActive && 
                                  rule.days.includes(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()])
                                ).map(rule => (
                                  <div key={rule.id} className="flex items-center bg-white p-2 rounded-lg border border-amber-100">
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                        rule.adjustment > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                      }`}
                                    >
                                      {rule.adjustment > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-800">{rule.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {rule.applyTo === 'categories' 
                                          ? `${rule.categories.map(c => menuCategories.find(cat => cat.id === c)?.name).join(', ')}`
                                          : `${rule.itemIds.length} specific items`
                                        }
                                      </div>
                                    </div>
                                    <div className="ml-auto">
                                      <span 
                                        className={`text-sm font-medium rounded-md px-2 py-1 ${
                                          rule.adjustment > 0 
                                            ? 'bg-green-50 text-green-800'
                                            : 'bg-red-50 text-red-800'
                                        }`}
                                      >
                                        {rule.adjustment > 0 ? '+' : ''}{rule.adjustment}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Price Example */}
                              <div className="bg-white p-3 rounded-lg border border-amber-100 mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Price Adjustments</h4>
                                <div className="text-sm text-gray-600">
                                  {allMenuItems.length > 0 && (
                                    <ul className="space-y-2">
                                      {allMenuItems.filter(item => 
                                        dynamicPricingRules.some(rule => 
                                          rule.isActive && 
                                          rule.days.includes(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()]) &&
                                          ((rule.applyTo === 'categories' && rule.categories.includes(item.category)) ||
                                           (rule.applyTo === 'items' && rule.itemIds.includes(item.id)))
                                        )
                                      ).slice(0, 3).map(item => (
                                        <li key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                          <span>{item.name}</span>
                                          <div className="flex items-center">
                                            <span className="text-gray-400 line-through mr-2">${item.price.toFixed(2)}</span>
                                            <span className="font-medium" style={{ color: colors.primary }}>
                                              ${getAdjustedPrice(item.price, item.id, item.category)}
                                            </span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">No Active Pricing Rules</h3>
                                <p className="text-sm text-gray-600">
                                  No pricing adjustments are currently active based on your rules.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Dynamic Pricing</h2>
                        <p className="text-gray-500 text-sm mt-1">
                          Automatically adjust menu prices based on time of day, day of week, or special occasions. Increase revenue with smart pricing strategies.
                        </p>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-6">
                          {/* Editing Interface for Pricing Rule */}
                          {editingPricingRule && (
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6">
                              <h3 className="text-lg font-medium text-gray-800 mb-4">
                                {editingPricingRule.id ? 'Edit' : 'New'} Pricing Rule
                              </h3>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                                  <input 
                                    type="text"
                                    value={editingPricingRule.name}
                                    onChange={e => setEditingPricingRule({...editingPricingRule, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g. Happy Hour"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <input 
                                    type="text"
                                    value={editingPricingRule.description}
                                    onChange={e => setEditingPricingRule({...editingPricingRule, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Brief description of this pricing rule"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment (%)</label>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => setEditingPricingRule({...editingPricingRule, adjustment: -Math.abs(editingPricingRule.adjustment || 0)})}
                                      className={`px-3 py-2 border ${editingPricingRule.adjustment <= 0 ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300 bg-gray-50 text-gray-700'} rounded-l-md`}
                                    >
                                      Discount
                                    </button>
                                    <button
                                      onClick={() => setEditingPricingRule({...editingPricingRule, adjustment: Math.abs(editingPricingRule.adjustment || 0)})}
                                      className={`px-3 py-2 border ${editingPricingRule.adjustment > 0 ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300 bg-gray-50 text-gray-700'} rounded-r-md`}
                                    >
                                      Premium
                                    </button>
                                    <input 
                                      type="number"
                                      value={Math.abs(editingPricingRule.adjustment || 0)}
                                      onChange={e => {
                                        const value = Math.abs(parseFloat(e.target.value) || 0)
                                        setEditingPricingRule({
                                          ...editingPricingRule, 
                                          adjustment: editingPricingRule.adjustment < 0 ? -value : value
                                        })
                                      }}
                                      className="w-24 ml-3 px-3 py-2 border border-gray-300 rounded-md"
                                      step="0.1"
                                      min="0"
                                    />
                                    <span className="ml-1 text-xl">%</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input 
                                      type="time"
                                      value={editingPricingRule.startTime}
                                      onChange={e => setEditingPricingRule({...editingPricingRule, startTime: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input 
                                      type="time"
                                      value={editingPricingRule.endTime}
                                      onChange={e => setEditingPricingRule({...editingPricingRule, endTime: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                                  <WeekdaySelector 
                                    selectedDays={editingPricingRule.days}
                                    onChange={(days) => setEditingPricingRule({...editingPricingRule, days})}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Apply To</label>
                                  <div className="flex space-x-4 mb-3">
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        checked={editingPricingRule.applyTo === 'categories'}
                                        onChange={() => setEditingPricingRule({...editingPricingRule, applyTo: 'categories'})}
                                        className="mr-2"
                                      />
                                      <span className="text-sm text-gray-700">Entire Categories</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        checked={editingPricingRule.applyTo === 'items'}
                                        onChange={() => setEditingPricingRule({...editingPricingRule, applyTo: 'items'})}
                                        className="mr-2"
                                      />
                                      <span className="text-sm text-gray-700">Specific Items</span>
                                    </label>
                                  </div>
                                  
                                  {editingPricingRule.applyTo === 'categories' ? (
                                    <div className="bg-white border border-gray-200 rounded-md max-h-64 overflow-y-auto p-3">
                                      {isLoadingMenuItems ? (
                                        <div className="flex justify-center py-4">
                                          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        </div>
                                      ) : (
                                        menuCategories.map(category => (
                                          <div key={category.id} className="flex items-center mb-2 last:mb-0">
                                            <input
                                              type="checkbox"
                                              id={`price-cat-${category.id}`}
                                              checked={editingPricingRule.categories.includes(category.id)}
                                              onChange={(e) => {
                                                const checked = e.target.checked
                                                setEditingPricingRule(prev => ({
                                                  ...prev,
                                                  categories: checked 
                                                    ? [...prev.categories, category.id]
                                                    : prev.categories.filter(id => id !== category.id)
                                                }))
                                              }}
                                              className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                            />
                                            <label htmlFor={`price-cat-${category.id}`} className="text-sm text-gray-700">
                                              {category.name} <span className="text-xs text-gray-500">({category.menuItems.length} items)</span>
                                            </label>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  ) : (
                                    <div className="bg-white border border-gray-200 rounded-md max-h-64 overflow-y-auto p-3">
                                      {isLoadingMenuItems ? (
                                        <div className="flex justify-center py-4">
                                          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        </div>
                                      ) : (
                                        <div>
                                          {menuCategories.map(category => (
                                            <div key={category.id} className="mb-3 last:mb-0">
                                              <h4 className="text-sm font-medium text-gray-700 mb-1">{category.name}</h4>
                                              <div className="pl-2 space-y-1 border-l-2 border-gray-100">
                                                {category.menuItems.map(item => (
                                                  <div key={item.id} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                      <input
                                                        type="checkbox"
                                                        id={`price-item-${item.id}`}
                                                        checked={editingPricingRule.itemIds.includes(item.id)}
                                                        onChange={(e) => {
                                                          const checked = e.target.checked
                                                          setEditingPricingRule(prev => ({
                                                            ...prev,
                                                            itemIds: checked 
                                                              ? [...prev.itemIds, item.id]
                                                              : prev.itemIds.filter(id => id !== item.id)
                                                          }))
                                                        }}
                                                        className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                                      />
                                                      <label htmlFor={`price-item-${item.id}`} className="text-sm text-gray-700">
                                                        {item.name}
                                                      </label>
                                                    </div>
                                                    <span className="text-xs text-gray-500">${item.price.toFixed(2)}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <p className="text-xs text-gray-500 mt-2">
                                    Pricing adjustments will only apply to the selected items or categories.
                                  </p>
                                </div>
                                
                                <div className="flex space-x-3 pt-3">
                                  <button
                                    onClick={() => setEditingPricingRule(null)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  {editingPricingRule.id && (
                                    <button
                                      onClick={() => handleDeletePricingRule(editingPricingRule.id)}
                                      className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 hover:bg-red-100"
                                    >
                                      Delete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleSavePricingRule(editingPricingRule)}
                                    className="flex-1 px-4 py-2 text-white rounded-md"
                                    style={{ backgroundColor: colors.primary }}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Pricing Rule Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dynamicPricingRules.map((rule) => (
                              <div 
                                key={rule.id} 
                                className={`p-4 border ${rule.isActive ? rule.adjustment > 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                                onClick={() => setEditingPricingRule(rule)}
                              >
                                <div className="flex items-start">
                                  <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                      rule.isActive 
                                        ? rule.adjustment > 0 
                                          ? 'bg-green-100 text-green-600' 
                                          : 'bg-red-100 text-red-600'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    {rule.adjustment > 0 ? <TrendingUp className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-medium text-gray-800">{rule.name}</h3>
                                      <div className={`ml-3 px-2 py-0.5 text-xs rounded-full ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {rule.isActive ? 'Active' : 'Inactive'}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{rule.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center text-xs text-gray-600">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {rule.startTime} - {rule.endTime}
                                      </div>
                                      <div 
                                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                                          rule.adjustment > 0 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                        }`}
                                      >
                                        {rule.adjustment > 0 ? '+' : ''}{rule.adjustment}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                  <div className="flex space-x-1">
                                    {rule.days.includes('mon') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">M</span>}
                                    {rule.days.includes('tue') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">T</span>}
                                    {rule.days.includes('wed') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">W</span>}
                                    {rule.days.includes('thu') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">T</span>}
                                    {rule.days.includes('fri') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">F</span>}
                                    {rule.days.includes('sat') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">S</span>}
                                    {rule.days.includes('sun') && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">S</span>}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        togglePricingRuleActive(rule.id)
                                      }}
                                      className={`p-1.5 rounded ${rule.isActive ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'}`}
                                    >
                                      {rule.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add New Pricing Rule Card */}
                            <button
                              onClick={handleAddPricingRule}
                              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                <Plus className="w-5 h-5 text-gray-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Add New Pricing Rule</p>
                              <p className="text-xs text-gray-500 mt-1">Create time-based price adjustments</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-lg mr-4">
                          <Percent className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-900 mb-1">How Dynamic Pricing Works</h3>
                          <p className="text-amber-800 text-sm">
                            Automatically adjust menu prices based on time of day, day of week, or special occasions. Increase revenue with happy hour discounts or weekend premiums.
                          </p>
                          <div className="mt-4 bg-white p-3 rounded-lg border border-amber-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Pricing Strategies</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li className="flex items-start">
                                <span className="text-amber-500 mr-1">•</span>
                                <span><b>Happy Hour:</b> -15% on drinks from 4-6pm on weekdays</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-amber-500 mr-1">•</span>
                                <span><b>Weekend Premium:</b> +10% on special dishes Friday and Saturday nights</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-amber-500 mr-1">•</span>
                                <span><b>Early Bird:</b> -10% on all items from 5-6pm to attract early diners</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Growth Section (Coming Soon) */}
            {activeSection === 'growth' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Growth & Marketing Tools</h2>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">
                      Expand your business with our powerful growth tools. Automate review collection, increase customer engagement, and boost your online presence.
                    </p>
                    <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                      Coming Soon!
                    </div>
                    
                    <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <Star className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Review Automation</h3>
                        <p className="text-sm text-gray-500">Automatically collect reviews from satisfied customers directly through your digital menu</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <MessageCircle className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Customer Feedback</h3>
                        <p className="text-sm text-gray-500">Collect valuable feedback to improve your service and offerings</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <Globe className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Social Integration</h3>
                        <p className="text-sm text-gray-500">Connect with your customers on social media platforms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard Settings</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your dashboard preferences</p>
                  </div>

                  <div className="p-6">
                    <div className="max-w-xl mx-auto space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          Account Settings
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Change Password</p>
                              <p className="text-xs text-gray-500 mt-1">Update your account password</p>
                            </div>
                            <button 
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                              onClick={() => showNotification('Password reset email has been sent to your email address.')}
                            >
                              Reset Password
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                            <Palette className="w-4 h-4 text-purple-600" />
                          </div>
                          Theme Appearance
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">Reset to Default Theme</p>
                              <p className="text-xs text-gray-500 mt-1">Restore the original appearance settings</p>
                            </div>
                            <RefreshCw className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <Eye className="w-4 h-4 text-green-600" />
                          </div>
                          Menu Actions
                        </h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => navigate('/menu/1')}
                            className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                          >
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">View Menu</p>
                              <p className="text-xs text-gray-500 mt-1">See the customer-facing menu</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Eye className="w-5 h-5 text-gray-600" />
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              showNotification('Coming soon: QR code generator');
                            }}
                            className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                          >
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">Get QR Code</p>
                              <p className="text-xs text-gray-500 mt-1">Download QR code for your restaurant</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-gray-600" />
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          Account Actions
                        </h3>
                        <div className="space-y-3">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
                          >
                            <div className="text-left">
                              <p className="text-sm font-medium text-red-700">Logout</p>
                              <p className="text-xs text-red-500 mt-1">Sign out from your account</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}