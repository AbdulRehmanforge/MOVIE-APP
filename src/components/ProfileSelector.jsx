import React, { useState } from 'react';
import { AVATAR_IMAGES, KIDS_AVATAR } from './profile-avatars.js';
import styles from './ProfileSelector.module.css';

const getAvatar = (profile, idx) => {
  if (profile.isKids) return KIDS_AVATAR;
  return AVATAR_IMAGES[idx % AVATAR_IMAGES.length];
};

const ProfileSelector = ({ profiles, onSelectProfile, onCreateProfile }) => {
  const [name, setName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [cardVisible, setCardVisible] = useState(true);
  const [addBtnHover, setAddBtnHover] = useState(false);

  const handleProfileClick = (profile) => {
    setFadeOut(true);
    setTimeout(() => onSelectProfile(profile), 350);
  };
  React.useEffect(() => {
    setCardVisible(true);
    setFadeOut(false);
  }, [profiles]);

  return (
    <main
      className={styles['profile-selector-netflix']}
      style={fadeOut ? { opacity: 0, transition: 'opacity 0.32s cubic-bezier(.4,1.01,.32,1)' } : {}}
    >
      <h1
        className={styles['profile-heading-netflix']}
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s cubic-bezier(.22,.68,.43,1.01), transform 0.7s cubic-bezier(.22,.68,.43,1.01)',
        }}
      >
        Who&apos;s watching?
      </h1>
      <div className={styles['profile-row-netflix']}>
        {profiles.map((profile, idx) => (
          <button
            key={profile.id}
            type="button"
            className={styles['profile-card-netflix']}
            tabIndex={0}
            onClick={() => handleProfileClick(profile)}
            style={{
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(40px)',
              transition: `opacity 0.5s ${0.15 + idx * 0.09}s cubic-bezier(.4,1.01,.32,1), transform 0.5s ${0.15 + idx * 0.09}s cubic-bezier(.4,1.01,.32,1)`,
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onFocus={e => e.currentTarget.style.boxShadow = '0 4px 32px #e5091440, 0 2px 8px #000a'}
            onBlur={e => e.currentTarget.style.boxShadow = ''}
          >
            <div className={styles['profile-avatar-netflix']}>
              <img src={getAvatar(profile, idx)} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }} />
            </div>
            <div className={styles['profile-name-netflix']}>{profile.name}</div>
          </button>
        ))}
        <button
          key="add-profile"
          type="button"
          className={styles['add-profile-card-netflix']}
          tabIndex={0}
          onClick={() => setShowForm(true)}
          aria-label="Add Profile"
          onMouseEnter={() => setAddBtnHover(true)}
          onMouseLeave={() => setAddBtnHover(false)}
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(40px)',
            transition: `opacity 0.5s ${0.15 + profiles.length * 0.09}s cubic-bezier(.4,1.01,.32,1), transform 0.5s ${0.15 + profiles.length * 0.09}s cubic-bezier(.4,1.01,.32,1)`,
            background: addBtnHover ? '#e50914' : '',
            color: addBtnHover ? '#fff' : '',
            boxShadow: addBtnHover ? '0 4px 32px #e5091440, 0 2px 8px #000a' : '',
          }}
        >
          <div className={styles['add-avatar-netflix']}><span>+</span></div>
          <div className={styles['add-profile-label-netflix']}>Add Profile</div>
        </button>
      </div>

      {showForm && (
        <form
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            onCreateProfile({ name: name.trim(), isKids });
            setName('');
            setIsKids(false);
            setShowForm(false);
          }}
          style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.32s cubic-bezier(.22,.68,.43,1.01), transform 0.32s cubic-bezier(.22,.68,.43,1.01)' }}
        >
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Profile name" style={{ fontSize: '1.1rem', borderRadius: 8, border: '1.5px solid #e50914', padding: '12px 18px', background: '#181818', color: '#fff', width: 220, outline: 'none', boxShadow: '0 2px 8px #000a', transition: 'border 0.2s' }} />
          <label style={{ color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isKids} onChange={(event) => setIsKids(event.target.checked)} style={{ accentColor: '#e50914', width: 18, height: 18, marginRight: 6 }} /> Kids
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #e5091440', transition: 'background 0.18s' }}>Add</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: '#232323', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #000a', transition: 'background 0.18s' }}>Cancel</button>
          </div>
        </form>
      )}
    </main>
  );
};

export default ProfileSelector;
