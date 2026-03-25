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

    if (!isset($_GET['id'])) {
        throw new Exception("ID parameter tidak disertakan pada URL");
    }

    $id = $_GET['id'];
    $query = $conn->prepare("SELECT * FROM alat_multimedia WHERE id = ?");
    $query->bind_param("s", $id);
    $query->execute();

    $result = $query->get_result();
    $data = $result->fetch_assoc();

    if ($data) {
        echo json_encode($data);
    } else {
        throw new Exception("Data inventaris dengan ID tersebut tidak ditemukan");
    }

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>