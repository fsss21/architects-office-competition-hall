import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './MainMenu.module.css'
import mainMenuImg from '../../assets/main_menu_img.png'
import mainMenuImg4k from '../../assets/main_menu_img-4k.png'

function MainMenu() {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(mainMenuImg)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? mainMenuImg4k : mainMenuImg)
  }, [])

  const handleCatalog = () => {
    navigate('/catalog')
  }

  const handleStatistics = () => {
    // TODO: переход на страницу статистики
  }

  const handleRateProjects = () => {
    // TODO: переход на страницу оценить проекты
  }

  return (
    <div className={styles.mainMenu}>
      <div
        className={styles.mainMenuBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.mainMenuContent}>
        {/* Кнопка "Перейти в каталог" справа от центра */}
        <div className={styles.mainMenuCatalogBtnContainer}>
          <button
            className={styles.mainMenuCatalogBtn}
            onClick={handleCatalog}
          >
            каталог конкурса
          </button>
        </div>
        {/* Кнопки внизу слева: Статистика, оценить проекты */}
        <div className={styles.mainMenuBottomNavigation}>
          <button
            type="button"
            className={styles.mainMenuBtn}
            onClick={handleRateProjects}
            aria-label="Оценить проекты"
          >
            оценить проекты
          </button>
          <button
            type="button"
            className={styles.mainMenuBtn}
            onClick={handleStatistics}
            aria-label="Статистика"
          >
            статистика
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
