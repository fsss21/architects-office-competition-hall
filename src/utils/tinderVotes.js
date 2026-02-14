const STORAGE_KEY = 'tinder-votes'

export async function fetchVotes() {
  try {
    const res = await fetch('/api/tinder/votes')
    const apiData = res.ok ? await res.json() : {}
    const localData = getLocalVotes()
    return mergeVotes(apiData, localData)
  } catch {
    return getLocalVotes()
  }
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
    // API недоступен — сохраняем в localStorage
    addLocalVote(itemId)
  }
  return false
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
    out[k] = (Number(out[k]) || 0) + (Number(v) || 0)
  }
  return out
}
