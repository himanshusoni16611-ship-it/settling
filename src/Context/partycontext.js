// src/context/PartyContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const PartyContext = createContext();
export const useParty = () => useContext(PartyContext);

export const PartyProvider = ({ children }) => {
  const [partyList, setPartyList] = useState([]);

  const fetchPartyList = async () => {
    try {
      const response = await fetch('https://cute-beijinho-d62c23.netlify.app/partyadd', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
           if(Array.isArray(data)){
            setPartyList(data);
           }else{
            console.error('Invalid party list format:', data);
      setPartyList([]); // Fallback to empty array to prevent .map crash
           }
    } catch (err) {
      console.error('Error fetching party data:', err);
    }
  };

  useEffect(() => {
    fetchPartyList();
  }, []);

  return (
    <PartyContext.Provider value={{ partyList, fetchPartyList }}>
      {children}
    </PartyContext.Provider>
  );
};
