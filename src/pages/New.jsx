import React, { useEffect, useState } from 'react'
import ImgSphere from '@/components/img-sphere'
import { MemberService } from '../firebase/memberService'
import '../styles/components/img-sphere.tailwind.css'

const New = () => {
  const [members, setMembers] = useState([])

  const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const initials = parts.slice(0, 2).map(p => p[0] || '').join('').toUpperCase()
    return initials || 'M'
  }

  const buildPlaceholderAvatar = (name, size = 128) => {
    const initials = getInitials(name)
    const bg = '#e2e8f0'
    const text = '#1e293b'
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="clip">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" />
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g clip-path="url(#clip)">
    <rect width="${size}" height="${size}" fill="${bg}"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(size*0.4)}" font-weight="700" fill="${text}">${initials}</text>
</svg>`
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    return dataUrl
  }

  useEffect(() => {
    console.log('[New] page mounted')
    const loadMembers = async () => {
      try {
        const res = await MemberService.getActiveMembers()
        if (res.success) {
          console.log('[New] loaded members', { count: res.data.length })
          setMembers(res.data)
        } else {
          console.error('[New] load members failed', res.error)
        }
      } catch (err) {
        console.error('[New] load members error', err)
      }
    }
    loadMembers()
  }, [])

  const images = members.map(m => ({
    id: m.id,
    src: m.photoURL || m.avatar || buildPlaceholderAvatar(m.name),
    alt: m.name || m.membershipId || 'Member',
    title: m.name,
    description: m.membershipId ? `ID: ${m.membershipId}` : undefined,
  }))

  useEffect(() => {
    console.log('[New] images prepared', { count: images.length })
  }, [images.length])

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold text-primary-600">New Components</h1>
      <ImgSphere 
        images={images} 
        containerSize={420} 
        sphereRadius={180} 
        autoRotate={true}
      />
    </div>
  )
}

export default New
