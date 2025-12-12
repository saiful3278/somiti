import { db } from './config'
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore'

export const recordLogin = async (somitiUid, provider = 'local') => {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    let ip = ''
    let meta = {}
    try {
      const res = await fetch('https://ipapi.co/json/')
      if (res.ok) {
        const j = await res.json()
        ip = j?.ip || ''
        meta = { country: j?.country_name, city: j?.city }
      }
    } catch (_) {}

    const col = collection(db, 'users', somitiUid, 'login_history')
    await addDoc(col, {
      ip,
      user_agent: ua,
      provider,
      meta,
      created_at: serverTimestamp()
    })
    return { ok: true }
  } catch (e) {
    return { error: e }
  }
}

export const fetchLoginHistory = async (somitiUid) => {
  try {
    const col = collection(db, 'users', somitiUid, 'login_history')
    const q = query(col, orderBy('created_at', 'desc'), limit(50))
    const snap = await getDocs(q)
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return { data }
  } catch (e) {
    return { error: e }
  }
}