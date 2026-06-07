/**
 * Стабильная высота viewport для kiosk/Chrome (--vh вместо 100vh).
 * Вызывать один раз при старте приложения.
 */
export function initViewport() {
  const update = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  update()
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)
}
