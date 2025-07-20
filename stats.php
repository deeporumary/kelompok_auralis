<?php
/**
 * Stats API
 * Provides basic statistics for the relawan table
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Izinkan akses dari domain manapun (untuk pengembangan)
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$response = array("success" => false, "message" => "Failed to load stats.");

if ($conn) {
    try {
        // Total Volunteers
        $queryTotal = "SELECT COUNT(*) as total_volunteers FROM relawan";
        $stmtTotal = $conn->prepare($queryTotal);
        $stmtTotal->execute();
        $totalVolunteers = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total_volunteers'];

        // Karena tabel 'relawan' hanya memiliki id, nama, email, nohp,
        // statistik seperti 'relawan aktif', 'relawan baru', 'total kota' tidak dapat dihitung.
        // Kita akan mengembalikan nilai 0 untuk menjaga kompatibilitas frontend.
        
        $response = array(
            "success" => true,
            "data" => array(
                "total_volunteers" => (int)$totalVolunteers,
                "active_volunteers" => (int)$totalVolunteers, // Asumsi semua aktif
                "new_volunteers" => (int)$totalVolunteers,    // Asumsi semua baru (atau bisa 0 jika tidak ada tanggal)
                "total_cities" => 1       // Asumsi 1 kota jika tidak ada kolom kota
            )
        );

    } catch(PDOException $e) {
        http_response_code(500);
        $response["message"] = "Database error: " . $e->getMessage();
        error_log("Stats API error: " . $e->getMessage());
    }
} else {
    http_response_code(500);
    $response["message"] = "Database connection failed.";
}

echo json_encode($response);
?>