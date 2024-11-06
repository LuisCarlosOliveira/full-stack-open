import React, { useState } from 'react';

function ThemeToggle() {
    const [dark, setDark] = useState(false);

    const changeTheme = () => {
        setDark(!dark);
    };

    return (
        <div
          style={{
            backgroundColor: dark ? '#333' : '#fff',
            color: dark ? '#fff' : '#000',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p>Theme: {dark ? 'dark' : 'Light'}</p>
          <button onClick={changeTheme}>
            Change to {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      );
    }
    
    export default ThemeToggle;