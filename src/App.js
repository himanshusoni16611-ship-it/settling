import './App.css';
import Header from './routes/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartyAdd from './routes/partyadd';
import SettlingEntry from './routes/settling';
import Bs from './routes/balancesheet';
import { PartyProvider } from './Context/partycontext';
import Home from './routes/Home';
import Deleteall from'./routes/deleteall';



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* No PartyProvider here */}
        <Route path="/" element={<Home />} />
        <Route path="/balancesheet" element={<Bs />} />

        {/* Wrap only these with PartyProvider */}
        <Route
          path="/partyadd"
          element={
            <PartyProvider>
              <PartyAdd />
            </PartyProvider>
          }
        />
        <Route
          path="/settlingentry"
          element={
            <PartyProvider>
              <SettlingEntry />
            </PartyProvider>
          }
        />
        <Route path="/deleteall" element={<Deleteall/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
