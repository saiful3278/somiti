import React, { useEffect } from 'react'
import '../../styles/components/MemberDetailsCard.css'

const MemberDetailsCard = ({ member, onClose }) => {
  useEffect(() => {
    console.log('[MemberDetailsCard] open', { id: member?.id, name: member?.name })
  }, [member])

  if (!member) return null

  return (
    <div className="member-details-overlay" onClick={onClose}>
      <div className="member-details-card" onClick={(e) => e.stopPropagation()}>
        <div className="member-details-header">
          <img className="member-details-avatar" src={member.photoURL || member.avatar || '/logo_pdf.png'} alt={member.name || 'Member'} />
          <div className="member-details-title">
            <h3>{member.name || 'Unknown Member'}</h3>
            {member.membershipId && <p className="member-details-id">ID: {member.membershipId}</p>}
          </div>
        </div>
        <div className="member-details-body">
          {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
          {member.email && <p><strong>Email:</strong> {member.email}</p>}
          {member.status && <p><strong>Status:</strong> {member.status}</p>}
        </div>
        <div className="member-details-actions">
          <button className="member-details-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailsCard
