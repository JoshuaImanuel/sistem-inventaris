<?php
// Matikan error HTML bawaan PHP agar tidak merusak format JSON
error_reporting(0);
ini_set('display_errors', 0);

// Izinkan akses dari React (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Tangani metode OPTIONS dari peramban
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Gunakan blok try-catch untuk menangkap error secara rapi
try {
    // Pastikan nama database ("inventaris_cybrmed") sama persis dengan yang di phpMyAdmin
    $conn = new mysqli("localhost", "root", "", "inventaris_cybrmed");

    // Periksa koneksi
    if ($conn->connect_error) {
        throw new Exception("Koneksi database gagal: " . $conn->connect_error);
    }

    // Ambil data dari React
    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        throw new Exception("Data kosong atau format tidak sesuai.");
    }

    $id = $data->id;
    $nama_alat = $data->nama_alat;
    $merek = $data->merek;
    $kondisi = $data->kondisi;

    // Siapkan kueri
    $query = $conn->prepare("INSERT INTO alat_multimedia (id, nama_alat, merek, kondisi) VALUES (?, ?, ?, ?)");

    if (!$query) {
        throw new Exception("Kesalahan sintaks SQL: " . $conn->error);
    }

    $query->bind_param("ssss", $id, $nama_alat, $merek, $kondisi);

    // Eksekusi kueri
    if($query->execute()) {
        echo json_encode(["status" => "sukses", "pesan" => "Data berhasil disimpan"]);
    } else {
        throw new Exception("Gagal mengeksekusi data: " . $query->error);
    }

} catch (Exception $e) {
    // Jika terjadi error apa pun, cetak sebagai JSON agar bisa dibaca oleh React
    echo json_encode(["status" => "gagal", "pesan" => $e->getMessage()]);
}
?>