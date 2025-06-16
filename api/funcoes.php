<?php
function buscarProdutoPorId($id, $produtos) {
    foreach ($produtos as $produto) {
        if ($produto['id'] == $id) {
            return $produto;
        }
    }
    return null;
}

function gerarProximoId($produtos) {
    $ids = array_column($produtos, 'id');
    return max($ids) + 1;
}

function adicionarProduto(&$produtos, $novoProduto) {
    $produtos[] = $novoProduto;
}

function validarDadosProduto($dados) {
    $erros = [];

    if (!isset($dados['nome']) || trim($dados['nome']) === '') {
        $erros['nome'] = 'Nome é obrigatório.';
    }

    if (!isset($dados['preco']) || !is_numeric($dados['preco']) || $dados['preco'] <= 0) {
        $erros['preco'] = 'Preço deve ser um número maior que zero.';
    }

    return $erros;
}

function enviarRespostaJson($dados, $codigo = 200) {
    http_response_code($codigo);
    header('Content-Type: application/json');
    echo json_encode($dados);
    exit;
}
