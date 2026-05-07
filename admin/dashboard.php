<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = [
  "orders" => 48,
  "income" => "2.4jt",
  "stock" => 324,
  "customers" => 156
];

echo json_encode($data);