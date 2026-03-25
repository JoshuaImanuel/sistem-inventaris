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
        throw new Exception("Koneksi database gagal");
    }

    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->id) || !isset($data->kondisi) || !isset($data->lokasi)) {
        throw new Exception("Data tidak lengkap untuk pembaruan");
    }

    $id = $data->id;
    $lokasi = $data->lokasi;
    $kondisi = $data->kondisi;

    $query = $conn->prepare("UPDATE alat_multimedia SET lokasi = ?, kondisi = ? WHERE id = ?");
    $query->bind_param("sss", $lokasi, $kondisi, $id);

    if($query->execute()) {
        echo json_encode(["status" => "sukses", "pesan" => "Data berhasil diperbarui"]);
    } else {
        throw new Exception("Gagal mengeksekusi pembaruan data");
    }

} catch (Exception $e) {
    echo json_encode(["status" => "gagal", "pesan" => $e->getMessage()]);
}
?>