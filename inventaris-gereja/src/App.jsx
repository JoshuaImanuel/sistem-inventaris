import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FormulirInventaris from './FormulirInventaris';
import DetailBarang from './DetailBarang';
import DaftarInventaris from './DaftarInventaris';
import './FormulirInventaris.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header style={{ backgroundColor: '#0056b3', padding: '15px' }}>
          <h1 style={{ color: 'white', textAlign: 'center', margin: '0 0 15px 0' }}>Sistem Inventaris IT/MS</h1>
          <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Formulir Tambah Data</Link>
            <Link to="/daftar" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Daftar Inventaris</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<FormulirInventaris />} />
            <Route path="/daftar" element={<DaftarInventaris />} />
            <Route path="/item/:id" element={<DetailBarang />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;