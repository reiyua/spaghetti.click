const BASE_URL = 'http://skibarino.lol:8090'
const COLLECTION = 'spaghetti_click_global_count'
const RECORD_ID = 'rpzs5g2vci00nkk' // your actual record ID

export async function getGlobalClicks() {
  const res = await fetch(`${BASE_URL}/api/collections/${COLLECTION}/records/${RECORD_ID}`)
  const data = await res.json()
  return data.total
}

export async function incrementGlobalClicks() {
  try {
    const current = await getGlobalClicks()
    const res = await fetch(`${BASE_URL}/api/collections/${COLLECTION}/records/${RECORD_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: current + 1 }),
    })
    const data = await res.json()
    return data.total
  } catch (e) {
    console.error('Failed to update global clicks:', e)
  }
}
