import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

function FormulirInventaris() {
    const [formData, setFormData] = useState({
        id: '',
        nama_alat: '',
        merek: '',
        lokasi: 'SG 1',
        kondisi: 'Baik'
    });
    
    const [qrValue, setQrValue] = useState('');
    const canvasRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch('http://localhost/sistem-inventaris/backend/insert_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'sukses') {
                setQrValue(`http://localhost:5173/item/${formData.id}`);
                alert('Data berhasil disimpan dan Kode QR telah dibuat!');
            } else {
                alert('Gagal: ' + data.pesan);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan komunikasi dengan peladen.');
        });
    };

    useEffect(() => {
        if (qrValue && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qrValue, { width: 200 }, function (error) {
                if (error) console.error(error);
            });
        }
    }, [qrValue]);

    const unduhQR = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = `QR_${formData.id}.png`;
            link.href = url;
            link.click();
        }
    };

    return (
        <div className="wadah-formulir" style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#0056b3', textAlign: 'center', marginBottom: '20px' }}>Tambah Inventaris Baru</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input type="text" name="id" placeholder="ID Alat (contoh: KMR-001)" value={formData.id} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input type="text" name="nama_alat" placeholder="Nama Alat" value={formData.nama_alat} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input type="text" name="merek" placeholder="Merek" value={formData.merek} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <select name="lokasi" value={formData.lokasi} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="SG 1">SG 1</option>
                        <option value="SG 2">SG 2</option>
                        <option value="Gudang">Gudang</option>
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <select name="kondisi" value={formData.kondisi} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="Baik">Baik</option>
                        <option value="Rusak">Rusak</option>
                        <option value="Dipinjam">Dipinjam</option>
                    </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan & Hasilkan Kode QR</button>
            </form>

            {qrValue && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h3>Kode QR Alat</h3>
                    <canvas ref={canvasRef} style={{ margin: '10px auto', display: 'block' }}></canvas>
                    <button onClick={unduhQR} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Unduh Gambar QR</button>
                </div>
            )}
        </div>
    );
}

export default FormulirInventaris;