<?php
require 'dados.php';
require 'funcoes.php';

// Pegando método e caminho da requisição
$metodo = $_SERVER['REQUEST_METHOD'];
$caminho = $_SERVER['REQUEST_URI'];

// Tirando query strings
$caminho = strtok($caminho, '?');

// Roteamento
if ($metodo === 'GET' && preg_match('#^/api/produtos/(\d+)$#', $caminho, $matches)) {
    $id = intval($matches[1]);
    $produto = buscarProdutoPorId($id, $produtos);

    if ($produto) {
        enviarRespostaJson($produto);
    } else {
        enviarRespostaJson(['erro' => 'Produto não encontrado.'], 404);
    }

} elseif ($metodo === 'POST' && $caminho === '/api/produtos') {
    $dadosRecebidos = json_decode(file_get_contents('php://input'), true);
    $erros = validarDadosProduto($dadosRecebidos);

    if (!empty($erros)) {
        enviarRespostaJson(['erros' => $erros], 400);
    }

    $novoProduto = [
        'id' => gerarProximoId($produtos),
        'nome' => $dadosRecebidos['nome'],
        'preco' => floatval($dadosRecebidos['preco'])
    ];

    adicionarProduto($produtos, $novoProduto);

    enviarRespostaJson($novoProduto, 201);

} else {
    enviarRespostaJson(['erro' => 'Rota ou método não suportado.'], 404);
}
