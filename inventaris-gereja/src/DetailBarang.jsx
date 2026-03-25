import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailBarang() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [barang, setBarang] = useState(null);
    const [modeEdit, setModeEdit] = useState(false);
    const [kondisiBaru, setKondisiBaru] = useState('');
    const [lokasiBaru, setLokasiBaru] = useState('');

    useEffect(() => {
        fetch(`http://localhost/sistem-inventaris/api/get_item.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setBarang(data);
                    setKondisiBaru(data.kondisi);
                    setLokasiBaru(data.lokasi || 'SG 1');
                } else {
                    alert('Barang tidak ditemukan!');
                    navigate('/daftar');
                }
            })
            .catch(error => console.error('Galat saat mengambil data:', error));
    }, [id, navigate]);

    const simpanPembaruan = () => {
        fetch('http://localhost/sistem-inventaris/api/update_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: barang.id, lokasi: lokasiBaru, kondisi: kondisiBaru })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sukses') {
                setBarang({ ...barang, lokasi: lokasiBaru, kondisi: kondisiBaru });
                setModeEdit(false);
                alert('Data inventaris berhasil diperbarui!');
            } else {
                alert('Gagal: ' + data.pesan);
            }
        })
        .catch(error => console.error('Galat komunikasi peladen:', error));
    };

    const hapusBarang = () => {
        const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus ${barang.nama_alat} secara permanen?`);
        if (konfirmasi) {
            fetch('http://localhost/sistem-inventaris/api/delete_item.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: barang.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sukses') {
                    alert('Barang berhasil dihapus dari sistem.');
                    navigate('/daftar');
                } else {
                    alert('Gagal menghapus barang: ' + data.pesan);
                }
            })
            .catch(error => console.error('Galat komunikasi peladen:', error));
        }
    };

    if (!barang) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>Memuat informasi inventaris...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#0056b3', textAlign: 'center', marginBottom: '20px' }}>Detail Inventaris</h2>
            <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: '15px' }}>
                <p><strong>ID Alat:</strong> {barang.id}</p>
                <p><strong>Nama Alat:</strong> {barang.nama_alat}</p>
                <p><strong>Merek:</strong> {barang.merek}</p>

                <div style={{ marginTop: '15px' }}>
                    <strong>Lokasi Saat Ini:</strong>{' '}
                    {!modeEdit ? (
                        <span style={{ fontWeight: 'bold' }}>{barang.lokasi}</span>
                    ) : (
                        <select 
                            value={lokasiBaru} 
                            onChange={(e) => setLokasiBaru(e.target.value)}
                            style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="SG 1">SG 1</option>
                            <option value="SG 2">SG 2</option>
                            <option value="Gudang">Gudang</option>
                        </select>
                    )}
                </div>
                
                <div style={{ marginTop: '15px', marginBottom: '20px' }}>
                    <strong>Kondisi Saat Ini:</strong>{' '}
                    {!modeEdit ? (
                        <span style={{ color: barang.kondisi === 'Baik' ? 'green' : 'red', fontWeight: 'bold' }}>{barang.kondisi}</span>
                    ) : (
                        <select 
                            value={kondisiBaru} 
                            onChange={(e) => setKondisiBaru(e.target.value)}
                            style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Baik">Baik</option>
                            <option value="Rusak">Rusak</option>
                            <option value="Dipinjam">Dipinjam</option>
                        </select>
                    )}
                </div>

                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {!modeEdit ? (
                        <>
                            <button onClick={() => setModeEdit(true)} style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Data</button>
                            <button onClick={hapusBarang} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus Barang</button>
                        </>
                    ) : (
                        <>
                            <button onClick={simpanPembaruan} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
                            <button onClick={() => setModeEdit(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailBarang;