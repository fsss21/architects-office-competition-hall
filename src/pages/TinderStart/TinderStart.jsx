import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './TinderStart.module.css'
import tinderStartImg from '../../assets/tinder_start_sreen_img.png'
import tinderStartImg4k from '../../assets/tinder_start_screen_img-4k.png'

function TinderStart() {
  const navigate = useNavigate()
  const [bgSrc, setBgSrc] = useState(tinderStartImg)

  useEffect(() => {
    const updateSrc = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setBgSrc(is4K ? tinderStartImg4k : tinderStartImg)
    }
    updateSrc()
    window.addEventListener('resize', updateSrc)
    return () => window.removeEventListener('resize', updateSrc)
  }, [])

  const handleStart = () => {
    navigate('/tinder/vote')
  }



  return (
    <div className={styles.tinderStart} style={{ backgroundImage: `url(${bgSrc})` }}>
      <div className={styles.tinderStartContent}>
        <h1 className={styles.tinderStartTitle}>МЕНДЕЛЕЕВСКАЯ ЛИНИЯ</h1>

        <div className={styles.tinderStartBottom}>
          <button className={styles.tinderStartBtn} onClick={handleStart}>
            НАЧАТЬ ОЦЕНКУ ПРОЕКТОВ
          </button>
        </div>


      </div>
    </div>
  )
}

export default TinderStart
