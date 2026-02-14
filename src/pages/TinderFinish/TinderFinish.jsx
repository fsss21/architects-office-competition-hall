import { useState, useEffect } from 'react'
import { fetchVotes } from '../../utils/tinderVotes'
import { useNavigate } from 'react-router-dom'
import styles from './TinderFinish.module.css'
import tinderFinishImg from '../../assets/tinder_finish_img.png'
import tinderFinishImg4k from '../../assets/tinder_finish_img-4k.png'
import itemFrameImg from '../../assets/item_frame_img.png'
import itemFrameImg4k from '../../assets/item_frame_img-4k.png'
import gabeImg from '../../assets/gabe_img.png'
import stamovImg from '../../assets/stamov_img.png'
import petrovImg from '../../assets/petrov_img.png'

const itemImages = { 4: gabeImg, 5: stamovImg, 7: petrovImg }

function TinderFinish() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [votes, setVotes] = useState({})
  const [bgSrc, setBgSrc] = useState(tinderFinishImg)
  const [frameSrc, setFrameSrc] = useState(itemFrameImg)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    const updateSrc = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setBgSrc(is4K ? tinderFinishImg4k : tinderFinishImg)
      setFrameSrc(is4K ? itemFrameImg4k : itemFrameImg)
    }
    updateSrc()
    window.addEventListener('resize', updateSrc)
    return () => window.removeEventListener('resize', updateSrc)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/data/catalogItems.json').then((r) => (r.ok ? r.json() : [])),
      fetchVotes(),
    ]).then(([catalog, v]) => {
      setItems(Array.isArray(catalog) ? catalog : [])
      const vMap = typeof v === 'object' && v !== null ? v : {}
      setVotes(vMap)
      const total = Object.values(vMap).reduce((a, b) => a + (Number(b) || 0), 0)
      setTotalVotes(total)
    }).catch(() => {
      setItems([])
      setVotes({})
      setTotalVotes(0)
    })
  }, [])

  const itemsWithImages = items.filter((item) => itemImages[item.id])
  const sortedItems = [...itemsWithImages]
    .map((item) => ({
      ...item,
      votes: votes[String(item.id)] || 0,
    }))
    .sort((a, b) => b.votes - a.votes)
    .filter((i) => i.votes > 0)

  const topItem = sortedItems[0] || itemsWithImages[0] || null
  const topImg = topItem ? itemImages[topItem.id] : null
  const topPct = totalVotes > 0 && topItem ? ((topItem.votes / totalVotes) * 100).toFixed(1) : '0'

  const handleVotesClick = () => navigate('/tinder/leaders')
  const handleBack = () => navigate('/')

  return (
    <div className={styles.tinderFinish} style={{ backgroundImage: `url(${bgSrc})` }}>
      <div className={styles.tinderFinishContent}>
        <button className={styles.tinderBackBtn} onClick={handleBack} aria-label="Назад">
          Назад
        </button>

        <h2 className={styles.tinderFinishTitle}>РЕЗУЛЬТАТ ГОЛОСОВАНИЯ</h2>

        <div className={styles.tinderFinishCard}>
          <div className={styles.tinderFinishFrameWrap}>
            <div className={styles.tinderFinishItemImage}>
              {topImg && (
                <img src={topImg} alt={topItem?.name || ''} onError={(e) => (e.target.style.display = 'none')} />
              )}
            </div>
            <img src={frameSrc} alt="" className={styles.tinderFinishFrame} aria-hidden />
          </div>
          <div className={styles.tinderFinishOverlay}>
            <p className={styles.tinderFinishLabel}>{topItem?.label || ''}</p>
            <p className={styles.tinderFinishName}>{topItem?.name || ''}</p>
            <button
              type="button"
              className={styles.tinderFinishVotes}
              onClick={handleVotesClick}
              aria-label="Открыть тройку лидеров"
            >
              {topItem?.votes ?? 0} голосов ({topPct}%)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TinderFinish
