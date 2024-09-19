// NavBarContext.js
import React, { createContext, useContext, useState } from 'react';

const NavBarContext = createContext();

export const NavBarProvider = ({ children }) => {
  const [activeKey, setActiveKey] = useState('home');

  return (
    <NavBarContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavBarContext = () => useContext(NavBarContext);
