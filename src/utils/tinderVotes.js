const STORAGE_KEY = 'tinder-votes'

export async function fetchVotes() {
  const localData = getLocalVotes()

  try {
    const res = await fetch('/api/tinder/votes')
    if (res.ok) {
      const apiData = await res.json()
      if (typeof apiData === 'object' && apiData !== null && !Array.isArray(apiData)) {
        return mergeVotes(apiData, localData)
      }
    }
  } catch {
    // API недоступен — используем только localStorage
  }

  return localData
}

export async function submitVote(itemId) {
  try {
    const res = await fetch('/api/tinder/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    })
    if (res.ok) return true
  } catch {
    // API недоступен — сохраняем локально
  }

  addLocalVote(itemId)
  return true
}

function getLocalVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    return typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

function addLocalVote(itemId) {
  const key = String(itemId)
  const data = getLocalVotes()
  data[key] = (data[key] || 0) + 1
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    //
  }
}

function mergeVotes(api, local) {
  const out = { ...api }
  for (const [k, v] of Object.entries(local)) {
    if (!(k in out)) {
      out[k] = Number(v) || 0
    }
  }
  return out
}
