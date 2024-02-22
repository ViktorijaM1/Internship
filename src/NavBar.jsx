import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './style.css';

export default function NavBar({ onDataClick, onHomeClick, onExcelClick, onCsvClick, onJsonClick, clicked }) {

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setShowButtons(clicked);
  }, [clicked]);

  const handleDataClick = () => {
    setShowButtons(!showButtons);
    onDataClick();

  };

  return (
    <nav className="navbar navbar-expand-lg navbar bg-secondary">
      <div className="container-fluid">
        <div className="collapse navbar-collapse justify-content-start" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to={`/`} className="btn btn-light me-2" aria-current="page" onClick={() => { onHomeClick(); setShowButtons(false); }}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to={`/data`} className="btn btn-light" aria-current="page" onClick={handleDataClick}>Data</Link>
            </li>
            {clicked && showButtons && (
              <div className='divButtons'>
                <button className="btn btn-sm btn-light" style={{ marginRight: '10px' }} onClick={onCsvClick}>Download CSV</button>
                <button className="btn btn-sm btn-light" style={{ marginRight: '10px' }} onClick={onExcelClick}>Download Excel</button>
                <button className="btn btn-sm btn-light" onClick={onJsonClick}>Download Json</button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

