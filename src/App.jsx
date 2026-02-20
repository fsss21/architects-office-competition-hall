import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { CatalogFilterProvider } from './context/CatalogFilterContext'
import { TinderProvider } from './context/TinderContext'
import VideoPreview from './components/VideoPreview/VideoPreview'
import MainMenu from './pages/MainMenu/MainMenu'
import Catalog from './pages/Catalog/Catalog'
import CatalogItem from './pages/CatalogItem/CatalogItem'
import TinderStart from './pages/TinderStart/TinderStart'
import TinderHome from './pages/TinderHome/TinderHome'
import TinderFinish from './pages/TinderFinish/TinderFinish'
import TinderLeader from './pages/TinderLeader/TinderLeader'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showVideo, setShowVideo] = useState(true)

  useEffect(() => {
    // При перезагрузке страницы всегда перенаправляем на MainMenu (главную страницу)
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Выполняется только при монтировании

  const handleVideoComplete = () => {
    setShowVideo(false)
  }

  return (
    <CatalogFilterProvider>
      <TinderProvider>
        {showVideo && <VideoPreview onComplete={handleVideoComplete} />}
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/submenu" element={<CatalogItem />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<CatalogItem />} />
          <Route path="/tinder" element={<TinderStart />} />
          <Route path="/tinder/vote" element={<TinderHome />} />
          <Route path="/tinder/finish" element={<TinderFinish />} />
          <Route path="/tinder/leaders" element={<TinderLeader />} />
        </Routes>
      </TinderProvider>
    </CatalogFilterProvider>
  )
}

function App() {
  return <AppContent />
}

export default App
