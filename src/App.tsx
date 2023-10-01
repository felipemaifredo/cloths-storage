import './App.css';
import { Route, Routes, Navigate, HashRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './Configs/FirebaseConfig';

//Routes
import Home from './Routes/Public/Home';

//Private
import Login from './Routes/Private/Login';
import AdmHome from './Routes/Private/AdmHome';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/adm/login'element={<Login />} />
        <Route path='/adm/admhome' element={ (loggedIn ? <AdmHome /> : <Navigate to="/adm/login" />) } />
      </Routes>
    </HashRouter>
  );
}

export default App;
