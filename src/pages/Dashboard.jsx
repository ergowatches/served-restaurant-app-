import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Save, LogOut, RefreshCw, Settings, Upload, X, AlignLeft, AlignCenter, Circle, Square, ZoomIn, ZoomOut } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { theme, updateTheme } = useTheme()
  const [colors, setColors] = useState(theme)
  const [savedMessage, setSavedMessage] = useState('')
  const [logo, setLogo] = useState(theme.logo || null)
  const [logoShape, setLogoShape] = useState(theme.logoShape || 'circle')
  const [logoPosition, setLogoPosition] = useState(theme.logoPosition || 'center')
  const [logoSize, setLogoSize] = useState(theme.logoSize || 'medium')
  const [isEditingLogo, setIsEditingLogo] = useState(false)
  
  // Image editor states
  const [zoom, setZoom] = useState(theme.logoZoom || 1)
  const [position, setPosition] = useState(theme.logoOffset || { x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [imageOriginal, setImageOriginal] = useState(null)
  
  const fileInputRef = useRef(null)
  const imageEditorRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/dashboard-login')
    }
  }, [navigate])

  useEffect(() => {
    // Initialize position and zoom from theme if available
    if (theme.logoPosition) setLogoPosition(theme.logoPosition)
    if (theme.logoZoom) setZoom(theme.logoZoom)
    if (theme.logoOffset) setPosition(theme.logoOffset)
  }, [theme])

  const handleColorChange = (key, value) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    updateTheme({
      ...colors,
      logo,
      logoShape,
      logoPosition,
      logoSize,
      logoZoom: zoom,
      logoOffset: position
    })
    setSavedMessage('Changes saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/dashboard-login')
  }

  const handleReset = () => {
    const defaultTheme = {
      primary: '#DB2777',
      secondary: '#F9FAFB',
      text: '#1F2937',
      background: '#FFFFFF',
      logo: null,
      logoShape: 'circle',
      logoPosition: 'center',
      logoSize: 'medium',
      logoZoom: 1,
      logoOffset: { x: 0, y: 0 }
    }
    setColors(defaultTheme)
    setLogo(null)
    setLogoShape('circle')
    setLogoPosition('center')
    setLogoSize('medium')
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    updateTheme(defaultTheme)
    setSavedMessage('Theme reset to defaults!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
  
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be less than 2MB')
      return
    }
  
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageOriginal(event.target.result)
      // Set initial zoom to show the full image
      setZoom(0.8) // Start zoomed out
      setPosition({ x: 0, y: 0 })
      setIsEditingLogo(true)
      
      // Preload the image to calculate better initial zoom
      const img = new Image()
      img.onload = () => {
        // Calculate initial zoom to fit image within container
        if (imageEditorRef.current) {
          const containerSize = imageEditorRef.current.clientWidth
          const imgRatio = img.width / img.height
          const zoomFactor = imgRatio > 1 ? 
            containerSize / img.width * 0.8 : 
            containerSize / img.height * 0.8
          setZoom(Math.min(1, zoomFactor)) // Cap at 1 to avoid zooming in initially
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleLogoRemove = () => {
    setLogo(null)
    setImageOriginal(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle mouse down for image dragging
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (!imageRef.current) return
    
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // Handle mouse move for image dragging
  const handleMouseMove = (e) => {
    e.preventDefault()
    if (!isDragging || !imageRef.current || !imageEditorRef.current) return

    // Calculate new position
    const newX = e.clientX - startPosition.x
    const newY = e.clientY - startPosition.y
    
    // Apply the new position (we'll handle boundaries during rendering)
    setPosition({ x: newX, y: newY })
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  // Handle zoom changes
  const handleZoomChange = (e) => {
    setZoom(parseFloat(e.target.value))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.1))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.1))
  }

  // Save the edited logo
  const handleSaveLogoEdit = () => {
    if (!imageRef.current || !imageEditorRef.current || !imageOriginal) {
      console.error("Missing required elements for logo editing")
      setIsEditingLogo(false)
      return
    }

    // Create a canvas to render the cropped image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
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
      // Calculate center of the image
      const imgCenterX = img.width / 2
      const imgCenterY = img.height / 2
      
      // Calculate scaled image dimensions based on zoom
      const scaledWidth = img.width * zoom
      const scaledHeight = img.height * zoom
      
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
      try {
        const dataUrl = canvas.toDataURL('image/png')
        setLogo(dataUrl)
        setIsEditingLogo(false)
      } catch (err) {
        console.error("Error creating logo:", err)
        alert("Error creating logo. Please try again with a different image.")
        setIsEditingLogo(false)
      }
    }
    
    img.onerror = () => {
      console.error("Error loading image")
      alert("Error loading image. Please try again with a different image.")
      setIsEditingLogo(false)
    }
  }

  const handleCancelLogoEdit = () => {
    setIsEditingLogo(false)
    if (!logo) {
      // Clear the uploaded image if there was no logo before
      setImageOriginal(null)
    }
  }

  // Calculate drag constraints to keep the image within the editor
  const calculateTransform = () => {
    if (!imageRef.current || !imageOriginal) return ""
    
    return `translate(${position.x}px, ${position.y}px) scale(${zoom})`
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Improved Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Logo Editor Modal */}
      {isEditingLogo && imageOriginal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium">Edit Logo</h3>
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
                  className={`relative w-64 h-64 overflow-hidden ${logoShape === 'circle' ? 'rounded-full' : 'rounded-md'} border-2 border-gray-200`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
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
  onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
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
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Zoom</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleZoomOut}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="w-4 h-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={handleZoomIn}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
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
                <p className="text-sm text-gray-500 mb-2">
                  Drag the image to position it perfectly. Use the zoom slider to adjust the size.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelLogoEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLogoEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Customize Your Brand</h2>
            <p className="text-gray-500 text-sm mt-1">Adjust colors and upload your logo to match your restaurant's branding</p>
          </div>

          <div className="p-6">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Left Column - Settings */}
              <div className="space-y-8">
                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Restaurant Logo
                  </label>
                  <div className="space-y-4">
                    {logo ? (
                      <div className="relative w-full max-w-xs">
                        <div 
                          className={`
                            bg-gray-50 border border-gray-200 p-2 flex items-center justify-center cursor-pointer
                            ${logoShape === 'circle' ? 'rounded-full aspect-square w-24 h-24 overflow-hidden' : 'rounded-md'}
                          `}
                          onClick={() => {
                            // Edit existing logo
                            setImageOriginal(logo)
                            setIsEditingLogo(true)
                          }}
                        >
                          <img 
                            src={logo} 
                            alt="Restaurant logo" 
                            className={`
                              ${logoShape === 'circle' 
                                ? 'h-full w-full object-cover' 
                                : 'max-h-24 max-w-full object-contain'}
                            `}
                          />
                        </div>
                        <button
                          onClick={handleLogoRemove}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                          aria-label="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-1 text-xs text-gray-500">
                          Click on the logo to reposition or resize
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload a logo</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleLogoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                    >
                      {logo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                  </div>

                  {/* Logo Shape Option */}
                  {logo && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Shape
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setLogoShape('circle')}
                          className={`
                            flex items-center px-3 py-2 rounded-md text-sm
                            ${logoShape === 'circle' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          <Circle className="w-4 h-4 mr-1" />
                          Circle
                        </button>
                        <button
                          onClick={() => setLogoShape('square')}
                          className={`
                            flex items-center px-3 py-2 rounded-md text-sm
                            ${logoShape === 'square' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          <Square className="w-4 h-4 mr-1" />
                          Original
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Logo Position */}
                  {logo && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Position on Menu
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setLogoPosition('left')}
                          className={`
                            flex items-center px-3 py-2 rounded-md text-sm
                            ${logoPosition === 'left' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          <AlignLeft className="w-4 h-4 mr-1" />
                          Left
                        </button>
                        <button
                          onClick={() => setLogoPosition('center')}
                          className={`
                            flex items-center px-3 py-2 rounded-md text-sm
                            ${logoPosition === 'center' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          <AlignCenter className="w-4 h-4 mr-1" />
                          Center
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Logo Size */}
                  {logo && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Size
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setLogoSize('small')}
                          className={`
                            px-3 py-2 rounded-md text-sm
                            ${logoSize === 'small' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          Small
                        </button>
                        <button
                          onClick={() => setLogoSize('medium')}
                          className={`
                            px-3 py-2 rounded-md text-sm
                            ${logoSize === 'medium' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => setLogoSize('large')}
                          className={`
                            px-3 py-2 rounded-md text-sm
                            ${logoSize === 'large' 
                              ? 'bg-gray-200 font-medium'
                              : 'bg-white border border-gray-300'}
                          `}
                        >
                          Large
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Color Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="h-12 w-24 cursor-pointer rounded-md border border-gray-300"
                      />
                      <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                        Buttons, Headers
                      </div>
                    </div>
                    <input
                      type="text"
                      value={colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-40 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-gray-200 focus:border-gray-400 focus:outline-none"
                      placeholder="#DB2777"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="h-12 w-24 cursor-pointer rounded-md border border-gray-300"
                      />
                      <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                        Page Background
                      </div>
                    </div>
                    <input
                      type="text"
                      value={colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-40 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-gray-200 focus:border-gray-400 focus:outline-none"
                      placeholder="#F9FAFB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        className="h-12 w-24 cursor-pointer rounded-md border border-gray-300"
                      />
                      <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                        Content Text
                      </div>
                    </div>
                    <input
                      type="text"
                      value={colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-40 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-gray-200 focus:border-gray-400 focus:outline-none"
                      placeholder="#1F2937"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <h3 className="text-lg font-medium p-4 border-b border-gray-100">Live Preview</h3>
                <div 
                  className="p-6"
                  style={{ backgroundColor: colors.secondary }}
                >
                  {/* Mobile menu preview with logo */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
                    <div 
                      className="px-4 py-3 flex items-center relative" 
                      style={{ backgroundColor: colors.primary }}
                    >
                      {/* Back button */}
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <ArrowLeftIcon className="w-5 h-5 text-white" />
                      </div>

                      {/* Logo with position */}
                      {logo && (
                        <div 
                          className={`
                            ${logoPosition === 'left' ? 'absolute left-16' : 
                              'absolute left-1/2 transform -translate-x-1/2'}
                            z-10
                          `}
                        >
                          <div 
                            className={`
                              ${logoShape === 'circle' ? 'rounded-full overflow-hidden' : ''}
                              ${logoSize === 'small' ? 'h-8 w-8' : 
                                logoSize === 'medium' ? 'h-10 w-10' : 
                                'h-12 w-12'}
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

                      {/* Search/language */}
                      <div className="ml-auto flex">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <SearchIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Welcome text */}
                    <div className="text-center py-2" style={{ backgroundColor: colors.primary, color: 'white' }}>
                      <p className="font-bold">Welcome to Our Restaurant</p>
                    </div>
                  </div>

                  {/* Menu item preview */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium" style={{ color: colors.text }}>Margherita Pizza</h4>
                      <span style={{ color: colors.primary }} className="font-bold">$14.99</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Fresh mozzarella, tomatoes, and basil on our signature crust</p>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 rounded-full text-white text-sm"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium" style={{ color: colors.text }}>Tiramisu</h4>
                      <span style={{ color: colors.primary }} className="font-bold">$8.99</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Classic Italian dessert with espresso and mascarpone</p>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 rounded-full text-white text-sm"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Improved Action Buttons */}
          <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Reset to Defaults</span>
            </button>
            <div className="flex items-center space-x-4">
              {savedMessage && (
                <span className="text-green-600 text-sm bg-green-50 px-3 py-1 rounded-md border border-green-100">
                  {savedMessage}
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                style={{ backgroundColor: colors.primary }}
              >
                <Save className="w-4 h-4 mr-2" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple icon components for the preview
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);