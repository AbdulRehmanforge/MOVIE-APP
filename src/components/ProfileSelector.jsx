import React, { useState } from 'react';

const ProfileSelector = ({ profiles, onSelectProfile, onCreateProfile }) => {
  const [name, setName] = useState('');
  const [isKids, setIsKids] = useState(false);

  return (
    <main className="profile-selector">
      <h1>Who&apos;s watching?</h1>
      <div className="profile-grid">
        {profiles.map((profile) => (
          <button key={profile.id} type="button" className="profile-card" onClick={() => onSelectProfile(profile)}>
            <span>{profile.isKids ? '🧒' : '🎬'}</span>
            <p>{profile.name}</p>
          </button>
        ))}
      </div>

      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          onCreateProfile({ name: name.trim(), isKids });
          setName('');
          setIsKids(false);
        }}
      >
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Create profile" />
        <label>
          <input type="checkbox" checked={isKids} onChange={(event) => setIsKids(event.target.checked)} /> Kids
        </label>
        <button type="submit">Add Profile</button>
      </form>
    </main>
  );
};

export default ProfileSelector;
