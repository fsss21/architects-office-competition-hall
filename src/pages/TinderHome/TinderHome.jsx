import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTinder } from '../../context/TinderContext'
import styles from './TinderHome.module.css'
import tinderHomeImg from '../../assets/tinder_home_img.png'
import tinderHomeImg4k from '../../assets/tinder_home_img-4k.png'
import itemFrameImg from '../../assets/item_frame_img.png'
import itemFrameImg4k from '../../assets/item_frame_img-4k.png'
import gabeImg from '../../assets/gabe_img.png'
import stamovImg from '../../assets/stamov_img.png'
import petrovImg from '../../assets/petrov_img.png'

import { submitVote } from '../../utils/tinderVotes'
import CloseIcon from '@mui/icons-material/Close'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'

const itemImages = { 1: gabeImg, 2: stamovImg, 7: petrovImg }
const CREATION_YEARS = { 1: '1957', 2: '1957', 3: '1957', 4: '1957', 5: '1957', 6: '1957', 7: '1957' }

function TinderHome() {
  const navigate = useNavigate()
  const { setUserVotedItemId } = useTinder()
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bgSrc, setBgSrc] = useState(tinderHomeImg)
  const [frameSrc, setFrameSrc] = useState(itemFrameImg)

  useEffect(() => {
    const updateSrc = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setBgSrc(is4K ? tinderHomeImg4k : tinderHomeImg)
      setFrameSrc(is4K ? itemFrameImg4k : itemFrameImg)
    }
    updateSrc()
    window.addEventListener('resize', updateSrc)
    return () => window.removeEventListener('resize', updateSrc)
  }, [])

  useEffect(() => {
    fetch('/data/catalogItems.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setItems(list.filter((item) => itemImages[item.id]))
      })
      .catch(() => setItems([]))
  }, [])

  const currentItem = items[currentIndex] || null
  const itemImg = currentItem ? itemImages[currentItem.id] : null

  const handleReject = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleVote = async () => {
    if (!currentItem) return
    setUserVotedItemId(currentItem.id)
    await submitVote(currentItem.id)
    navigate('/tinder/finish')
  }

  const handleSuperLike = async () => {
    if (!currentItem) return
    setUserVotedItemId(currentItem.id)
    await submitVote(currentItem.id)
    await submitVote(currentItem.id)
    navigate('/tinder/finish')
  }

  const handleLearnMore = () => {
    if (currentItem) navigate(`/catalog/${currentItem.id}`)
  }

  const handleBack = () => navigate('/tinder')

  if (!items.length) {
    return (
      <div className={styles.tinder} style={{ backgroundImage: `url(${bgSrc})` }}>
        <div className={styles.tinderContent}>
          <p className={styles.tinderEmpty}>Загрузка…</p>
          <button className={styles.tinderBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tinder} style={{ backgroundImage: `url(${bgSrc})` }}>
      <div className={styles.tinderContent}>
        <button className={styles.tinderBackBtn} onClick={handleBack} aria-label="Назад">
          Назад
        </button>

        <div className={styles.tinderCenter}>
          <div className={styles.tinderStarWrap}>
            <button
              type="button"
              className={styles.tinderStarCircle}
              onClick={handleSuperLike}
              aria-label="Очень нравится"
            >
              <StarIcon className={styles.tinderStarIcon} />
            </button>
          </div>

          <div className={styles.tinderRow}>
            <button
              type="button"
              className={styles.tinderBtnCircle}
              onClick={handleReject}
              disabled={currentIndex >= items.length - 1 && items.length <= 1}
              aria-label="Пропустить"
            >
              <CloseIcon className={styles.tinderBtnIcon} />
            </button>

            <div className={styles.tinderCard}>
              <div className={styles.tinderFrameWrap}>
                <div className={styles.tinderItemImage}>
                  {itemImg && (
                    <img src={itemImg} alt={currentItem?.name || ''} onError={(e) => (e.target.style.display = 'none')} />
                  )}
                </div>
                <img src={frameSrc} alt="" className={styles.tinderFrame} aria-hidden />
              </div>
            </div>

            <button
              type="button"
              className={`${styles.tinderBtnCircle} ${styles.tinderBtnHeart}`}
              onClick={handleVote}
              aria-label="Голосовать"
            >
              <FavoriteIcon className={styles.tinderBtnIcon} />
            </button>
          </div>

          <div className={styles.tinderOverlay}>
            <p className={styles.tinderLabel}>{currentItem?.label || ''}</p>
            <p className={styles.tinderName}>{currentItem?.name || ''}</p>
            <p className={styles.tinderYear}>
              {currentItem?.creationTime || currentItem?.creationYear || CREATION_YEARS[currentItem?.id] || ''}
            </p>
            <button type="button" className={styles.tinderLearnMore} onClick={handleLearnMore}>
              узнать больше
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TinderHome
