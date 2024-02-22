import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Data from './Data.jsx'
import NavBar from './NavBar.jsx'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
     <BrowserRouter>
     <App/>
     </BrowserRouter>
  </React.StrictMode>,
)

