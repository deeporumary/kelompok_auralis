<?php
require_once '../config/database.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(['success' => false, 'message' => 'Semua kolom wajib diisi.']);
    exit();
}

// Hash password sebelum disimpan
$hashed_password = password_hash($data->password, PASSWORD_BCRYPT);

$database = new Database();
$conn = $database->getConnection();

try {
    $query = "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, 'user')";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':password', $hashed_password);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Pendaftaran berhasil! Silakan login.']);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Kode untuk duplicate entry
        echo json_encode(['success' => false, 'message' => 'Username atau email sudah terdaftar.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan pada database.']);
    }
}
?>