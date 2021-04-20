import React, { useState, useEffect } from 'react';

export default function Name() {
  const [name, setName] = useState('');
  const handleChange = (e) => {
    setName(e.target.value);
  };
  useEffect(() => {
    const data = localStorage.getItem('name-state');
    if (data) {
      setName(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('name-state', JSON.stringify(name));
  }, [name]);

  return (
    <div>
      <input type="text" onChange={handleChange} value={name} />
    </div>
  );
}
