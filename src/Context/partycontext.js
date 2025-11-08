// src/context/PartyContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const PartyContext = createContext();
export const useParty = () => useContext(PartyContext);

export const PartyProvider = ({ children }) => {
  const [partyList, setPartyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartyList = async () => {
    setLoading(true);
    setError(null);
    try {
      // CORRECTED: Using the right domain www.setling.in
      const response = await fetch("https://www.setling.in/api/partyadd", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setPartyList(data);
      } else {
        console.error('Invalid party list format:', data);
        setPartyList([]);
      }
    } catch (err) {
      console.error('Error fetching party data:', err);
      setError(err.message);
      setPartyList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartyList();
  }, []);

  return (
    <PartyContext.Provider value={{ partyList, fetchPartyList, loading, error }}>
      {children}
    </PartyContext.Provider>
  );
};
