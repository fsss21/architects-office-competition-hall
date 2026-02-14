import { useState, useEffect } from 'react'
import { fetchVotes } from '../../utils/tinderVotes'
import { useNavigate } from 'react-router-dom'
import { useTinder } from '../../context/TinderContext'
import styles from './TinderLeader.module.css'
import tinderLeaderImg from '../../assets/tinder_leader_img.png'
import tinderLeaderImg4k from '../../assets/tinder_leader_img-4k.png'
import gabeImg from '../../assets/gabe_img.png'
import stamovImg from '../../assets/stamov_img.png'
import petrovImg from '../../assets/petrov_img.png'
import itemFrameImg from '../../assets/item_frame_img.png'
import itemFrameImg4k from '../../assets/item_frame_img-4k.png'

const itemImages = { 4: gabeImg, 5: stamovImg, 7: petrovImg }

function TinderLeader() {
  const navigate = useNavigate()
  const { userVotedItemId } = useTinder()
  const [items, setItems] = useState([])
  const [votes, setVotes] = useState({})
  const [bgSrc, setBgSrc] = useState(tinderLeaderImg)
  const [frameSrc, setFrameSrc] = useState(itemFrameImg)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    const updateSrc = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setBgSrc(is4K ? tinderLeaderImg4k : tinderLeaderImg)
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
  const top3 = [...itemsWithImages]
    .map((item) => ({
      ...item,
      votes: votes[String(item.id)] || 0,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)

  const userChoice = items.find((i) => i.id === userVotedItemId) || null

  const handleBack = () => navigate('/tinder/finish')

  return (
    <div className={styles.tinderLeader} style={{ backgroundImage: `url(${bgSrc})` }}>
      <div className={styles.tinderLeaderContent}>
        <button className={styles.tinderBackBtn} onClick={handleBack} aria-label="Назад">
          Назад
        </button>

        <h2 className={styles.tinderLeaderTitle}>ТРОЙКА ЛИДЕРОВ</h2>

        <div className={styles.tinderLeaderBlocks}>
          {top3.map((item, idx) => {
            const img = itemImages[item.id]
            const pct = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : '0'
            return (
              <div key={item.id} className={styles.tinderLeaderBlock}>
                <span className={styles.tinderLeaderNum}>{idx + 1}.</span>
                <div className={styles.tinderLeaderFrameWrap}>
                  <div className={styles.tinderLeaderItemImage}>
                    {img && <img src={img} alt={item.name} onError={(e) => (e.target.style.display = 'none')} />}
                  </div>
                  <img src={frameSrc} alt="" className={styles.tinderLeaderFrame} aria-hidden />
                </div>
                <div>
                  <p className={styles.tinderLeaderLabel}>{item.label}</p>
                  <p className={styles.tinderLeaderVotes}>
                    {item.votes} голосов ({pct}%)
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <h3 className={styles.tinderLeaderSubtitle}>СРАВНЕНИЕ С ИСТОРИЧЕСКИМ РЕШЕНИЕМ</h3>

        <div className={styles.tinderLeaderComparison}>
          <button type="button" className={styles.tinderLeaderBtn}>
            <span className={styles.tinderLeaderBtnTitle}>ваш выбор</span>
            {userChoice && (
              <span className={styles.tinderLeaderBtnDesc}>{userChoice.label}</span>
            )}
          </button>
          <span className={styles.tinderLeaderVs}>VS</span>
          <button type="button" className={styles.tinderLeaderBtn}>
            <span className={styles.tinderLeaderBtnTitle}>исторический победитель</span>
            <span className={styles.tinderLeaderBtnDesc}>
              победивший проект
            </span>
            <span className={styles.tinderLeaderBtnSubDesc}>победитель конкурса 1957 года</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TinderLeader
