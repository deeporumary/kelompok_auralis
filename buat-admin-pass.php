<?php
$password_polos = 'admin123';
$hash_password = password_hash($password_polos, PASSWORD_BCRYPT);

echo "<!DOCTYPE html>";
echo "<html lang='id'>";
echo "<head><title>Password Hash Generator</title>";
echo "<style>
        body { font-family: sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        h3 { color: #333; }
        p { color: #555; }
        input { 
            width: 100%; 
            padding: 10px; 
            margin-top: 10px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 1.1em; 
            text-align: center; 
            background-color: #eee; 
            cursor: text;
        }
      </style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<h3>Password Hash untuk Admin</h3>";
echo "<p>Password Anda (<strong>" . htmlspecialchars($password_polos) . "</strong>) telah dienkripsi. Salin teks di bawah ini:</p>";
echo "<input type='text' value='" . htmlspecialchars($hash_password) . "' readonly onclick='this.select();'>";
echo "</div>";
echo "</body>";
echo "</html>";

?>