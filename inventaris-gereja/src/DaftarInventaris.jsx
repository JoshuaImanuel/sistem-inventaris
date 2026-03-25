import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DaftarInventaris() {
    const [daftarBarang, setDaftarBarang] = useState([]);
    const [kataKunci, setKataKunci] = useState('');

    useEffect(() => {
        fetch('http://localhost/api/get_all_items.php')
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setDaftarBarang(data);
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => console.error('Galat komunikasi peladen:', error));
    }, []);

    const barangTersaring = daftarBarang.filter((barang) => {
        const kataKunciKecil = kataKunci.toLowerCase();
        return (
            barang.id.toLowerCase().includes(kataKunciKecil) ||
            barang.nama_alat.toLowerCase().includes(kataKunciKecil) ||
            barang.merek.toLowerCase().includes(kataKunciKecil)
        );
    });

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Daftar Inventaris IT/MS</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Cari ID, Nama Alat, atau Merek..."
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    style={{ padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#0056b3', color: 'white' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID Alat</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama Alat</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Merek</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Kondisi</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {barangTersaring.map((barang) => (
                        <tr key={barang.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{barang.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{barang.nama_alat}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{barang.merek}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: barang.kondisi === 'Baik' ? 'green' : 'red' }}>
                                {barang.kondisi}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                <Link to={`/item/${barang.id}`} style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>Lihat Detail</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DaftarInventaris;