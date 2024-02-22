import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Data from './Data.jsx';

function App() {
 
 

  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/data" element={<Data />} />
        <Route path="/farmer/:id" element={<Data />} />
      </Routes>
    </>
  )
}

export default App;
