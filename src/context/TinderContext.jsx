import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const STORAGE_KEY = 'tinder-user-choice'

const TinderContext = createContext(null)

function readStoredChoice() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const id = parseInt(raw, 10)
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

function writeStoredChoice(itemId) {
  try {
    if (itemId == null) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, String(itemId))
    }
  } catch {
    //
  }
}

export function TinderProvider({ children }) {
  const [userVotedItemId, setUserVotedItemIdState] = useState(readStoredChoice)

  const setUserVotedItemId = useCallback((itemId) => {
    setUserVotedItemIdState(itemId ?? null)
    writeStoredChoice(itemId ?? null)
  }, [])

  const value = useMemo(
    () => ({ userVotedItemId, setUserVotedItemId }),
    [userVotedItemId, setUserVotedItemId]
  )

  return (
    <TinderContext.Provider value={value}>
      {children}
    </TinderContext.Provider>
  )
}

export function useTinder() {
  const ctx = useContext(TinderContext)
  return ctx || { userVotedItemId: null, setUserVotedItemId: () => {} }
}
