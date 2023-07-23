// GlobalContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const initialContextValues = {
  VT: '',
  T: '',
  C: '',
};

const GlobalContext = createContext(initialContextValues);

const useGlobalContext = () => {
  return useContext(GlobalContext);
}

const GlobalContextProvider = ({ children }) => {
  const [context, setContext] = useState(initialContextValues);

  const updateContext = (updatedContext) => {
    setContext((prevContext) => ({
      ...prevContext,
      ...updatedContext,
    }));
    localStorage.setItem('context', JSON.stringify(updatedContext));
  };

  return (
    <GlobalContext.Provider value={{ ...context, updateContext }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobalContext };
