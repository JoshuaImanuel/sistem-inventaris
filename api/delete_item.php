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

    if (!$data || !isset($data->id)) {
        throw new Exception("ID barang tidak disertakan untuk penghapusan");
    }

    $id = $data->id;

    $query = $conn->prepare("DELETE FROM alat_multimedia WHERE id = ?");
    $query->bind_param("s", $id);

    if($query->execute()) {
        echo json_encode(["status" => "sukses", "pesan" => "Data barang berhasil dihapus"]);
    } else {
        throw new Exception("Gagal mengeksekusi penghapusan data");
    }

} catch (Exception $e) {
    echo json_encode(["status" => "gagal", "pesan" => $e->getMessage()]);
}
?>