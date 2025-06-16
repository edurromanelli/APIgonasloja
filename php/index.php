<?php
header("Content-Type: application/json");

$rota = $_GET['rota'] ?? '';

if ($rota === "produtos") {
    require_once __DIR__ . "/dados/produtos.php";
    echo json_encode($produtos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(404);
echo json_encode([
    "erro" => "Rota não encontrada. Use ?rota=produtos"
]);
exit;

