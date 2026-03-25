import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function FormulirInventaris() {
    const [formData, setFormData] = useState({ id: '', nama_alat: '', merek: '', kondisi: 'Baik' });
    const [qrValue, setQrValue] = useState('');
    const qrRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost/api/insert_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'sukses') {
                setQrValue(`http://inventaris.gbi-jababeka.com/item/${formData.id}`);
                alert('Data berhasil disimpan dan Kode QR telah dibuat!');
            } else {
                
                alert('Gagal: ' + data.pesan); 
            }
        })
        .catch(error => console.error('Galat komunikasi peladen:', error));
    };

    const unduhKodeQR = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const urlGambar = canvas.toDataURL("image/png");
            const elemenTautan = document.createElement('a');
            elemenTautan.href = urlGambar;
            elemenTautan.download = `QR_Inventaris_${formData.id}.png`;
            document.body.appendChild(elemenTautan);
            elemenTautan.click();
            document.body.removeChild(elemenTautan);
        }
    };

    return (
        <div className="wadah-formulir">
            <h2>Tambah Inventaris Baru</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="id" placeholder="ID Alat (Misal: MIC-001)" value={formData.id} onChange={handleChange} required />
                <input type="text" name="nama_alat" placeholder="Nama Alat" value={formData.nama_alat} onChange={handleChange} required />
                <input type="text" name="merek" placeholder="Merek" value={formData.merek} onChange={handleChange} />
                <select name="kondisi" value={formData.kondisi} onChange={handleChange}>
                    <option value="Baik">Baik</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Dipinjam">Dipinjam</option>
                </select>
                <button type="submit">Simpan & Hasilkan Kode QR</button>
            </form>

            {qrValue && (
                <div className="area-qrcode" ref={qrRef}>
                    <h3>Kode QR untuk {formData.nama_alat}:</h3>
                    <QRCodeCanvas value={qrValue} size={200} />
                    <p>Silakan unduh atau cetak kode ini.</p>
                    <button type="button" onClick={unduhKodeQR}>Unduh Gambar QR</button>
                </div>
            )}
        </div>
    );
}

export default FormulirInventaris;