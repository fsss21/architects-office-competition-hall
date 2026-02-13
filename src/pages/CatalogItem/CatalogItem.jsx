import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressLine from '../../components/ProgressLine/ProgressLine'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './CatalogItem.module.css'
import catalogItemImg from '../../assets/catalog_item_img.png'
import catalogItemImg4k from '../../assets/catalog_item_img-4k.png'
import gabeImg from '../../assets/gabe_img.png'
import stamovImg from '../../assets/stamov_img.png'
import petrovImg from '../../assets/petrov_img.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

function CatalogItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [catalogItems, setCatalogItems] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogItemImg)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [noPhotoImageSrc, setNoPhotoImageSrc] = useState(catalogItemImg)

  const rawId = id ? parseInt(id, 10) : NaN
  const currentItemId = Number.isInteger(rawId) ? rawId : null
  const activeIndex = useMemo(() => {
    if (currentItemId == null || !catalogItems.length) return 0
    const idx = catalogItems.findIndex((i) => i.id === currentItemId)
    return idx >= 0 ? idx : 0
  }, [currentItemId, catalogItems])

  const currentPoint = catalogItems[activeIndex] || null

  const itemImagesById = useMemo(() => ({ 4: gabeImg, 5: stamovImg, 7: petrovImg }), [])
  const currentPhotos = useMemo(() => {
    if (!currentPoint) return []
    const assetImg = itemImagesById[currentPoint.id]
    return assetImg ? [assetImg] : (currentPoint.photos || [])
  }, [currentPoint])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogItemImg4k : catalogItemImg)
    setNoPhotoImageSrc(is4K ? catalogItemImg4k : catalogItemImg)

    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        setCatalogItems(Array.isArray(data) ? data : [])
        setCurrentPhotoIndex(0)
      })
      .catch(err => console.error('Error loading catalog items:', err))
  }, [])

  useEffect(() => {
    if (!catalogItems.length) return
    const hasValidId = currentItemId != null && catalogItems.some((i) => i.id === currentItemId)
    if (!hasValidId) {
      const firstId = catalogItems[0]?.id
      if (firstId != null) navigate(`/catalog/${firstId}`, { replace: true })
    }
  }, [currentItemId, catalogItems, navigate])

  useEffect(() => {
    setCurrentPhotoIndex(0)
    setCurrentTextIndex(0)
  }, [activeIndex])

  useEffect(() => {
    const maxTextIndex = Math.max(0, (currentPoint?.texts?.length ?? 0) - 1)
    setCurrentTextIndex((prev) => Math.min(prev, maxTextIndex))
  }, [currentPoint?.texts?.length])

  const handlePrevItem = () => {
    if (activeIndex <= 0) return
    const prevItem = catalogItems[activeIndex - 1]
    if (prevItem?.id != null) navigate(`/catalog/${prevItem.id}`)
  }

  const handleNextItem = () => {
    if (activeIndex >= catalogItems.length - 1) return
    const nextItem = catalogItems[activeIndex + 1]
    if (nextItem?.id != null) navigate(`/catalog/${nextItem.id}`)
  }

  const handlePointClick = (index) => {
    if (index >= 0 && index < catalogItems.length) {
      const item = catalogItems[index]
      if (item?.id != null) navigate(`/catalog/${item.id}`)
    }
  }

  const handleNextText = () => {
    const texts = currentPoint?.texts || []
    if (texts.length > 0 && currentTextIndex < texts.length - 1) {
      setCurrentTextIndex((prev) => prev + 1)
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const handleMainMenu = () => {
    navigate('/catalog')
  }

  const hasPhotos = currentPhotos.length > 0

  const handleNextPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % currentPhotos.length)
    }
  }

  const handlePrevPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length)
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  const backgroundImageSrc = hasPhotos ? imageSrc : noPhotoImageSrc
  const currentTexts = currentPoint?.texts || []

  return (
    <div className={styles.catalogItem}>
      <div
        className={styles.catalogItemBackground}
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      />
      <Header />
      <div className={styles.catalogItemContent}>
        <ProgressLine
          items={catalogItems}
          activeIndex={activeIndex}
          onPrev={handlePrevItem}
          onNext={handleNextItem}
          onPointClick={handlePointClick}
        />
        <div className={`${styles.catalogItemMainContent} ${!hasPhotos ? styles.catalogItemMainContentCentered : ''}`}>
          <div className={styles.catalogItemMainContentMenu}>
            <div className={`${styles.catalogItemTextBlock} ${!hasPhotos ? styles.catalogItemTextBlockCentered : ''}`}>
              {!catalogItems.length ? (
                <p className={styles.catalogItemTextDescription}>Загрузка…</p>
              ) : currentPoint ? (
                <>
                  <h2
                    className={styles.catalogItemTextPoint}
                    dangerouslySetInnerHTML={{ __html: currentPoint.name || '' }}
                  />
                  {currentTexts.length > 0 && (
                    <p
                      className={styles.catalogItemTextDescription}
                      dangerouslySetInnerHTML={{ __html: currentTexts[currentTextIndex] || '' }}
                    />
                  )}
                  <div className={styles.catalogItemBottomNavigation}>
                    {!hasPhotos ? (
                      <>
                        {currentTexts.length > 1 && (
                          <div className={styles.catalogItemTextNavigation}>
                            <button
                              className={styles.catalogItemTextNavBtn}
                              onClick={handlePrevText}
                              disabled={currentTextIndex === 0}
                              aria-label="Предыдущий текст"
                            >
                              <ArrowBackIosNewIcon />
                            </button>
                            <button
                              className={styles.catalogItemTextNavBtn}
                              onClick={handleNextText}
                              disabled={currentTextIndex === currentTexts.length - 1}
                              aria-label="Следующий текст"
                            >
                              <ArrowForwardIosIcon />
                            </button>
                          </div>
                        )}
                        <button className={`${styles.catalogItemBtn} ${styles.catalogItemBtnMainMenu}`} onClick={handleMainMenu}>
                          Перейти в каталог
                        </button>
                      </>
                    ) : (
                      <>
                        <div className={styles.catalogItemControlsNavMenu}>
                          <button className={`${styles.catalogItemBtn} ${styles.catalogItemBtnMainMenu}`} onClick={handleMainMenu}>
                            Перейти в каталог
                          </button>
                        </div>
                        {currentTexts.length > 1 && (
                          <div className={styles.catalogItemTextNavigation}>
                            <button
                              className={styles.catalogItemTextNavBtn}
                              onClick={handlePrevText}
                              disabled={currentTextIndex === 0}
                              aria-label="Предыдущий текст"
                            >
                              <ArrowBackIosNewIcon />
                            </button>
                            <button
                              className={styles.catalogItemTextNavBtn}
                              onClick={handleNextText}
                              disabled={currentTextIndex === currentTexts.length - 1}
                              aria-label="Следующий текст"
                            >
                              <ArrowForwardIosIcon />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {hasPhotos && (
            <div className={styles.catalogItemGalleryBlock}>
              <div className={styles.catalogItemGalleryWrapper}>
                <PhotoGallery
                  photos={currentPhotos}
                  showControls={false}
                  showArrows={isFullscreen}
                  showFullscreen={isFullscreen}
                  onCloseFullscreen={handleCloseFullscreen}
                  currentIndex={currentPhotoIndex}
                  onIndexChange={setCurrentPhotoIndex}
                />
              </div>
              {currentPhotos.length > 0 && (
                <div className={styles.catalogItemGalleryControls}>
                  <div className={styles.catalogItemNav}>
                    <button
                      className={styles.catalogItemGalleryNavBtn}
                      onClick={handlePrevPhoto}
                      disabled={currentPhotos.length <= 1}
                      aria-label="Предыдущее фото"
                    >
                      <ArrowBackIosNewIcon />
                    </button>
                    <span className={styles.catalogItemGalleryCounter}>
                      {currentPhotoIndex + 1} / {currentPhotos.length}
                    </span>
                    <button
                      className={styles.catalogItemGalleryNavBtn}
                      onClick={handleNextPhoto}
                      disabled={currentPhotos.length <= 1}
                      aria-label="Следующее фото"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </div>
                  <button
                    className={styles.catalogItemFullscreenButton}
                    onClick={handleFullscreen}
                    aria-label="Полноэкранный режим"
                  >
                    <FullscreenIcon fontSize='large' />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogItem
