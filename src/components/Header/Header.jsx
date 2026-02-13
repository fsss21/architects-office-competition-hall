import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useCatalogFilter, CATALOG_SECTIONS } from '../../context/CatalogFilterContext'
import styles from './Header.module.css'

import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

function Header() {
  const location = useLocation()
  const isCatalogPage = location.pathname === '/catalog'
  const isCatalogItemPage = location.pathname.startsWith('/catalog/') && location.pathname !== '/catalog'

  const { selectedItemIds, setSelectedItemIds } = useCatalogFilter()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [finalistsCollapsed, setFinalistsCollapsed] = useState(false)
  const [peopleFavoritesCollapsed, setPeopleFavoritesCollapsed] = useState(false)
  const [catalogItemsForFilters, setCatalogItemsForFilters] = useState([])

  useEffect(() => {
    if (isCatalogPage && filtersOpen) {
      fetch('/data/catalogItems.json')
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          const list = Array.isArray(data) ? data : []
          setCatalogItemsForFilters(list)
        })
        .catch((err) => console.error('Header: failed to load catalog for filters', err))
    }
  }, [isCatalogPage, filtersOpen])

  const allItemIds = useMemo(() => catalogItemsForFilters.map(i => i.id), [catalogItemsForFilters])
  const finalists = useMemo(() => catalogItemsForFilters.filter(i => i.section === CATALOG_SECTIONS.FINALISTS), [catalogItemsForFilters])
  const peopleFavorites = useMemo(() => catalogItemsForFilters.filter(i => i.section === CATALOG_SECTIONS.PEOPLE_FAVORITES), [catalogItemsForFilters])

  const isItemSelected = (id) => selectedItemIds.length === 0 || selectedItemIds.includes(id)

  const handleToggleItem = (id) => {
    setSelectedItemIds(prev => {
      const next = prev.length === 0 ? allItemIds : [...prev]
      if (next.includes(id)) {
        const filtered = next.filter(i => i !== id)
        return filtered.length === 0 ? [] : filtered
      }
      return [...next, id].sort((a, b) => a - b)
    })
  }

  const handleFiltersToggle = () => {
    setSearchOpen(false)
    setFiltersOpen(prev => !prev)
  }
  const handleSearchToggle = () => {
    setFiltersOpen(false)
    setSearchOpen(prev => !prev)
  }
  const handleOverlayClick = () => {
    setFiltersOpen(false)
    setSearchOpen(false)
  }
  const handleShowFilters = () => setFiltersOpen(false)

  return (
    <>
      <header className={`${styles.header} ${isCatalogItemPage ? styles.headerOnItemPage : ''}`}>
        <h1 className={styles.headerTitle}>Конкурсный зал</h1>

        {isCatalogPage && (
          <div className={styles.headerButtons}>
            <div className={styles.headerDropdownWrap}>
              <button
                type="button"
                className={styles.headerBtnFilters}
                onClick={handleFiltersToggle}
                aria-expanded={filtersOpen}
                aria-haspopup="true"
                aria-label="Открыть фильтры"
              >
                <MenuIcon fontSize="large" />
              </button>
              {filtersOpen && (
                <div className={styles.headerDropdown} onClick={e => e.stopPropagation()}>
                  <div className={styles.headerDropdownHeader}>
                    <h3 className={styles.headerDropdownTitle}>Фильтры</h3>
                    <button type="button" className={styles.headerDropdownClose} onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры">
                      <CloseIcon />
                    </button>
                  </div>

                  <div className={`${styles.headerFilterBlock} ${finalistsCollapsed ? styles.headerFilterBlockCollapsed : ''}`}>
                    <div className={styles.headerFilterLabelWrap}>
                      <span className={styles.headerFilterLabel}>Финалисты</span>
                      <button
                        type="button"
                        className={styles.headerCollapseBtn}
                        onClick={() => setFinalistsCollapsed(prev => !prev)}
                        aria-expanded={!finalistsCollapsed}
                      >
                        {finalistsCollapsed ? 'Развернуть' : 'Свернуть'}
                        {finalistsCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
                      </button>
                    </div>
                    {!finalistsCollapsed && (
                      <div className={styles.headerFilterOptions}>
                        {finalists.map(item => (
                          <label key={item.id} className={styles.headerFilterCheck}>
                            <input
                              type="checkbox"
                              checked={isItemSelected(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            {item.name}
                          </label>
                        ))}
                        {finalists.length === 0 && (
                          <span className={styles.headerFilterEmpty}>Нет элементов</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`${styles.headerFilterBlock} ${peopleFavoritesCollapsed ? styles.headerFilterBlockCollapsed : ''}`}>
                    <div className={styles.headerFilterLabelWrap}>
                      <span className={styles.headerFilterLabel}>Народные любимцы</span>
                      <button
                        type="button"
                        className={styles.headerCollapseBtn}
                        onClick={() => setPeopleFavoritesCollapsed(prev => !prev)}
                        aria-expanded={!peopleFavoritesCollapsed}
                      >
                        {peopleFavoritesCollapsed ? 'Развернуть' : 'Свернуть'}
                        {peopleFavoritesCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
                      </button>
                    </div>
                    {!peopleFavoritesCollapsed && (
                      <div className={styles.headerFilterOptions}>
                        {peopleFavorites.map(item => (
                          <label key={item.id} className={styles.headerFilterCheck}>
                            <input
                              type="checkbox"
                              checked={isItemSelected(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            {item.name}
                          </label>
                        ))}
                        {peopleFavorites.length === 0 && (
                          <span className={styles.headerFilterEmpty}>Нет элементов</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button type="button" className={styles.headerShowBtn} onClick={handleShowFilters}>
                    Показать
                  </button>
                </div>
              )}
            </div>
            <div className={styles.headerSearchWrap}>
              <button
                type="button"
                className={styles.headerBtnSearch}
                onClick={handleSearchToggle}
                aria-expanded={searchOpen}
                aria-haspopup="true"
                aria-label="Поиск"
              >
                <SearchIcon fontSize="large" />
              </button>
              {searchOpen && (
                <div className={styles.headerSearchPanel} onClick={e => e.stopPropagation()}>
                  <div className={styles.headerSearchForm}>
                    <button type="button" className={styles.headerSearchIconBtn} aria-label="Поиск">
                      <SearchIcon fontSize="small" />
                    </button>
                    <input
                      type="search"
                      className={styles.headerSearchInput}
                      placeholder="Поиск..."
                      autoFocus
                      aria-label="Поле поиска"
                    />
                  </div>
                  <button type="button" className={styles.headerSearchClose} onClick={() => setSearchOpen(false)} aria-label="Закрыть поиск">
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {isCatalogPage && (filtersOpen || searchOpen) && (
        <div className={styles.headerOverlay} onClick={handleOverlayClick} aria-hidden="true" />
      )}
    </>
  )
}

export default Header
