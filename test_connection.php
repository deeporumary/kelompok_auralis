<?php
/**
 * Test Database Connection and Fetch Data
 */

header('Content-Type: text/html; charset=utf-8'); // Ensure proper character encoding
error_reporting(E_ALL); // Report all errors
ini_set('display_errors', 1); // Display errors

require_once 'config/database.php';

$database = new Database();
$conn = $database->getConnection();

echo "<h1>Database Connection Test</h1>";

if ($conn) {
    echo "<p style='color: green; font-weight: bold;'>Database connection successful!</p>";

    // Try to fetch data from the 'relawan' table
    $query = "SELECT id, nama, email, nohp FROM relawan ORDER BY id DESC";
    try {
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $relawanData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($relawanData) > 0) {
            echo "<h2>Data Relawan:</h2>";
            echo "<table border='1' cellpadding='10' cellspacing='0'>";
            echo "<thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>No. HP</th></tr></thead>";
            echo "<tbody>";
            foreach ($relawanData as $row) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['id']) . "</td>";
                echo "<td>" . htmlspecialchars($row['nama']) . "</td>";
                echo "<td>" . htmlspecialchars($row['email']) . "</td>";
                echo "<td>" . htmlspecialchars($row['nohp']) . "</td>";
                echo "</tr>";
            }
            echo "</tbody></table>";
        } else {
            echo "<p>No data found in 'relawan' table.</p>";
        }

    } catch (PDOException $e) {
        echo "<p style='color: red; font-weight: bold;'>Error fetching data: " . htmlspecialchars($e->getMessage()) . "</p>";
    }

} else {
    echo "<p style='color: red; font-weight: bold;'>Database connection failed. Check config/database.php and your MySQL server.</p>";
}
?>
