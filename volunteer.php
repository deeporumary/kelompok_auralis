<?php
// PASTIKAN INI ADALAH BARIS 1, TIDAK ADA APAPUN DI ATASNYA
session_start(); 

// --- PENGATURAN HEADER ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GANTI BLOK KODE IF YANG LAMA DENGAN INI
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Periksa apakah sesi 'role' ada DAN nilainya adalah 'admin'
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403); // Kode status 'Forbidden'
        echo json_encode(["success" => false, "message" => "Akses ditolak. Hanya admin yang dapat melakukan tindakan ini."]);
        exit(); // Hentikan eksekusi
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Periksa apakah sesi 'role' ada dan nilainya adalah 'admin'
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403); // Kode status 'Forbidden' atau 'Dilarang'
        echo json_encode(["success" => false, "message" => "Akses ditolak. Hanya admin yang dapat melakukan tindakan ini."]);
        exit(); // Hentikan eksekusi skrip
    }
}

// --- KONEKSI DATABASE ---
require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Koneksi ke database gagal."]);
    exit();
}

// --- PROSES PERMINTAAN (REQUEST) ---
$method = $_SERVER['REQUEST_METHOD'];
$table_name = "relawan";

switch ($method) {
    // --- (R)EAD: Mengambil data relawan ---
    case 'GET':
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $query = "SELECT id, nama, email, nohp FROM " . $table_name;
        if ($search) {
            $query .= " WHERE nama LIKE :search OR email LIKE :search OR nohp LIKE :search";
        }
        $query .= " ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        if ($search) {
            $stmt->bindValue(':search', '%' . $search . '%');
        }
        $stmt->execute();
        $volunteers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $volunteers]);
        break;

    // --- (C)REATE & (U)PDATE: Menambah atau mengubah data ---
    case 'POST':
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));

        if (json_last_error() !== JSON_ERROR_NONE || is_null($data)) {
            http_response_code(400); 
            echo json_encode(["success" => false, "message" => "Input JSON tidak valid."]);
            exit();
        }

        if (!isset($data->nama) || !isset($data->email) || !isset($data->nohp)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Data tidak lengkap. Field nama, email, dan nohp wajib ada."]);
            exit();
        }
        
        if ($method === 'PUT' && !isset($data->id)) {
             http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID relawan wajib ada untuk proses update."]);
            exit();
        }

        try {
            if ($method === 'POST') {
                $query = "INSERT INTO " . $table_name . " (nama, email, nohp) VALUES (:nama, :email, :nohp)";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':nama', $data->nama);
                $stmt->bindParam(':email', $data->email);
                $stmt->bindParam(':nohp', $data->nohp);
                $message = "Relawan berhasil ditambahkan.";
            } else { // PUT
                $query = "UPDATE " . $table_name . " SET nama = :nama, email = :email, nohp = :nohp WHERE id = :id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':nama', $data->nama);
                $stmt->bindParam(':email', $data->email);
                $stmt->bindParam(':nohp', $data->nohp);
                $stmt->bindParam(':id', $data->id);
                $message = "Relawan berhasil diperbarui.";
            }

            if ($stmt->execute()) {
                if ($method === 'PUT' && $stmt->rowCount() === 0) {
                     echo json_encode(["success" => true, "message" => "Tidak ada perubahan data yang disimpan."]);
                } else {
                    echo json_encode(["success" => true, "message" => $message]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Gagal menyimpan data ke database."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            if ($e->getCode() == 23000) { // Error duplikat
                 echo json_encode(["success" => false, "message" => "Email atau No. HP sudah terdaftar."]);
            } else {
                 echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
            }
        }
        break;

    // --- (D)ELETE: Menghapus data ---
    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID relawan tidak ditemukan."]);
            exit();
        }
        $id = $_GET['id'];
        $query = "DELETE FROM " . $table_name . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "Relawan berhasil dihapus."]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Relawan dengan ID tersebut tidak ditemukan."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Gagal menghapus relawan."]);
        }
        break;

    // --- Metode tidak diizinkan ---
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Metode tidak diizinkan."]);
        break;
}
?>
