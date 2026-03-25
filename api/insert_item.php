<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = new mysqli("localhost", "root", "", "inventaris_cybrmed");

    if ($conn->connect_error) {
        throw new Exception("Koneksi database gagal: " . $conn->connect_error);
    }

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        throw new Exception("Data kosong atau format tidak sesuai.");
    }

    $id = $data->id;
    $nama_alat = $data->nama_alat;
    $merek = $data->merek;
    $lokasi = $data->lokasi;
    $kondisi = $data->kondisi;

    $query = $conn->prepare("INSERT INTO alat_multimedia (id, nama_alat, merek, lokasi, kondisi) VALUES (?, ?, ?, ?, ?)");

    if (!$query) {
        throw new Exception("Kesalahan sintaks SQL: " . $conn->error);
    }

    $query->bind_param("sssss", $id, $nama_alat, $merek, $lokasi, $kondisi);

    if($query->execute()) {
        echo json_encode(["status" => "sukses", "pesan" => "Data berhasil disimpan"]);
    } else {
        throw new Exception("Gagal mengeksekusi data: " . $query->error);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "gagal", "pesan" => $e->getMessage()]);
}
?>