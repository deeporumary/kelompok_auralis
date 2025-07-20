<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username) || !isset($data->password)) {
    echo json_encode(['success' => false, 'message' => 'Input tidak lengkap.']);
    exit();
}

$database = new Database();
$conn = $database->getConnection();

// Periksa apakah koneksi berhasil
if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal terhubung ke database.']);
    exit();
}

$query = "SELECT id, username, password, role FROM users WHERE username = :username LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bindParam(':username', $data->username);
$stmt->execute();

if ($stmt->rowCount() == 1) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    // Verifikasi password yang di-hash
    if (password_verify($data->password, $user['password'])) {
        // Jika password cocok, simpan data ke session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Login berhasil!',
            'role' => $user['role']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Username atau password salah.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Username atau password salah.']);
}
?>