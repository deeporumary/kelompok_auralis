<?php
class Database {
    private $host = "localhost";
    private $db_name = "db_relawan"; 
    private $username = "root"; 
    private $password = "";     
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            // Set PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            // Optionally, you can throw the exception or return false
            // throw new Exception("Database connection failed: " . $exception->getMessage());
            return null; // Return null on connection failure
        }
        return $this->conn;
    }
}
?>