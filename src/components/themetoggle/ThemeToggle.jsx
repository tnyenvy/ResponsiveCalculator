import React from 'react';
import './ThemeToggle.scss';
import MoonIcon from '../../assets/moon.svg';
import SunIcon from '../../assets/sun.svg';

const ThemeToggle = ({ isDark, onToggle, toggleRef }) => {
  return (
    <div className="theme-toggle">
      <div 
        ref={toggleRef}
        className={`theme-toggle__switch ${isDark ? 'theme-toggle__switch--dark' : 'theme-toggle__switch--light'}`}
        onClick={onToggle}
      >
        <div className="theme-toggle__icon">
          {isDark ? (
            <img src={MoonIcon} alt="Moon" width="20" height="20" />
          ) : (
            <img src={SunIcon} alt="Sun" width="20" height="20" />
          )}
        </div>
        <div className="theme-toggle__circle"></div>
      </div>
    </div>
  );
};

export default ThemeToggle;