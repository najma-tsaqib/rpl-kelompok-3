<?php
$host = "localhost";
$dbname = "UDLestari"; // ganti ini
$user = "postgres";
$pass = "dz1234"; // password kamu

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // set schema ke UDLestari
    $pdo->exec('SET search_path TO "UDLestari", public;');

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>