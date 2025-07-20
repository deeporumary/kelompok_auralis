<?php
/**
 * Programs API
 * Handles program data for dropdowns and references
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

class ProgramsAPI {
    private $conn;
    private $table_name = "programs";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAllPrograms() {
        $query = "SELECT id, name, description, status 
                  FROM " . $this->table_name . " 
                  WHERE status = 'active' 
                  ORDER BY name";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array(
                "success" => true,
                "data" => $programs
            ));

        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ));
        }
    }
}

// Handle the request
$api = new ProgramsAPI();
$api->getAllPrograms();
?>