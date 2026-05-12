<?php

$data = [
  "target" => "6281297987747",
  "message" => "Halo dari Lestari Store 🔥"
];

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.fonnte.com/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => http_build_query($data),
  CURLOPT_HTTPHEADER => array(
    "Authorization: sFeVhhfzDsqFgg395VEV"
  ),
));

$response = curl_exec($curl);

curl_close($curl);

echo $response;