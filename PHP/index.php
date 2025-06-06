<?php
header("Content-Type: application/json");

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);

// Esperado: /api.php/produtos
if (end($uri) === "produtos") {
    require_once __DIR__ . "./dados/produtos.php";
    echo json_encode($produtos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Se a rota não for reconhecida, retorna 404
http_response_code(404);
echo json_encode([
    "erro" => "Rota não encontrada. Use /api.php/produtos"
]);
exit;
