<?php
$conn = new mysqli("db", "root", "root", "loginapp");
if ($conn->connect_error) {
    die("Fallo conexión DB: " . $conn->connect_error);
}
echo "✅ Conexión OK a MySQL desde PHP";
?>
