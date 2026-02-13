import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import Header from '../../components/Header/Header'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'
import gabeImg from '../../assets/gabe_img.png'
import stamovImg from '../../assets/stamov_img.png'
import petrovImg from '../../assets/petrov_img.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

function Catalog() {
  const navigate = useNavigate()
  const { selectedItemIds } = useCatalogFilter()
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

  // Маппинг изображений предметов из assets по id
  const itemImages = {
    4: gabeImg,
    5: stamovImg,
    7: petrovImg
  }

  useEffect(() => {
    // Определяем, нужно ли использовать 4K изображение
    // Для экранов с шириной >= 2560px или высотой >= 1440px используем 4K версию
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogImg4k : catalogImg)

    // Загружаем предметы каталога из JSON файла
    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setItems(list)
      })
      .catch(err => console.error('Error loading catalog items:', err))
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedItemIds.length === 0) return items
    return items.filter((item) => selectedItemIds.includes(item.id))
  }, [items, selectedItemIds])

  const PAGE_SIZE = 4
  const visibleItems = useMemo(
    () => filteredItems.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [filteredItems, currentPage]
  )

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE)

  useEffect(() => {
    if (filteredItems.length === 0) {
      setCurrentPage(0)
    } else if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1)
    }
    setCurrentItemIndex((prev) => Math.min(prev, Math.max(0, visibleItems.length - 1)))
  }, [filteredItems.length, totalPages, currentPage, visibleItems.length])

  const handleNextItem = () => {
    if (visibleItems.length === 0) return
    if (currentItemIndex < visibleItems.length - 1) {
      setCurrentItemIndex((prev) => prev + 1)
    } else if ((currentPage + 1) * PAGE_SIZE < filteredItems.length) {
      setCurrentPage((prev) => prev + 1)
      setCurrentItemIndex(0)
    }
  }

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1)
    } else if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
      setCurrentItemIndex(PAGE_SIZE - 1)
    }
  }

  const handleItemClick = (item) => {
    navigate(`/catalog/${item.id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={styles.catalog}>
      <div 
        className={styles.catalogBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogContent}>
        {/* Центральная область с предметами */}
        <div className={styles.catalogCenter}>
          <div className={styles.catalogItemsContainer}>
            {filteredItems.length === 0 ? (
              <p className={styles.catalogEmpty}>По вашему запросу ничего не найдено. Измените фильтры или поиск.</p>
            ) : (
            visibleItems.map((item, index) => {
              // Позиционирование по циклу: id 1,5,9… — Top; 2,4,6,8… — Bottom; 3,7,11… — Middle
              const positionIndex = (item.id - 1) % 4
              const blockPositionClass =
                positionIndex === 0
                  ? styles.catalogItemTop
                  : positionIndex === 2
                    ? styles.catalogItemMiddle
                    : styles.catalogItemBottom

              return (
                <div
                  key={item.id}
                  className={`${styles.catalogItem} ${blockPositionClass} ${
                    index === currentItemIndex ? styles.catalogItemActive : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                <div className={styles.catalogItemImage}>
                  {(itemImages[item.id] || (item.photos && item.photos[0])) ? (
                    <img 
                      src={itemImages[item.id] || item.photos[0]} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : null}
                </div>
                <div className={styles.catalogItemOverlay}>
                  <h3 
                    className={styles.catalogItemTitle}
                    dangerouslySetInnerHTML={{ __html: item?.title || '' }}
                  />
                </div>
              </div>
              )
            })
            )}
          </div>

          {/* Стрелочки для переключения между предметами - по середине страницы */}
          <div className={styles.catalogControls}>
            <button 
              className={styles.catalogArrow}
              onClick={handlePrevItem}
                  disabled={filteredItems.length === 0 || (currentPage === 0 && currentItemIndex === 0)}
              aria-label="Предыдущий предмет"
            >
              <ArrowBackIosNewIcon/>
            </button>
            <button
              className={styles.catalogArrow}
              onClick={handleNextItem}
              disabled={
                filteredItems.length === 0 ||
                (currentPage === totalPages - 1 && currentItemIndex === visibleItems.length - 1)
              }
              aria-label="Следующий предмет"
            >
              <ArrowForwardIosIcon/>
            </button>
          </div>
        </div>

        <div className={styles.catalogBottomNavigation}>
          <button className={styles.catalogBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default Catalog
