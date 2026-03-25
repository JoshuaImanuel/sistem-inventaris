<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

try {
    $conn = new mysqli("localhost", "root", "", "inventaris_cybrmed");

    if ($conn->connect_error) {
        throw new Exception("Koneksi database gagal");
    }

    $query = $conn->prepare("SELECT * FROM alat_multimedia ORDER BY id ASC");
    $query->execute();

    $result = $query->get_result();
    $semua_barang = [];

    while ($baris = $result->fetch_assoc()) {
        $semua_barang[] = $baris;
    }

    echo json_encode($semua_barang);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>