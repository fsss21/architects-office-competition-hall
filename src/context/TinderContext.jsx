import { createContext, useContext, useState, useMemo } from 'react'

const TinderContext = createContext(null)

export function TinderProvider({ children }) {
  const [userVotedItemId, setUserVotedItemId] = useState(null)
  const value = useMemo(
    () => ({ userVotedItemId, setUserVotedItemId }),
    [userVotedItemId]
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
