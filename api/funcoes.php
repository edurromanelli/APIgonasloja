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
        $erros['nome'] = 'O nome é obrigatório.';
    } elseif (strlen($dados['nome']) > 100) {
        $erros['nome'] = 'O nome não pode exceder 100 caracteres.';
    }

    if (!isset($dados['preco'])) {
        $erros['preco'] = 'O preço é obrigatório.';
    } elseif (!is_numeric($dados['preco'])) {
        $erros['preco'] = 'O preço deve ser numérico.';
    } elseif ($dados['preco'] <= 0) {
        $erros['preco'] = 'O preço deve ser maior que zero.';
    }

    return $erros;
}

function enviarRespostaJson($dados, $codigo = 200) {
    http_response_code($codigo);
    header('Content-Type: application/json');
    echo json_encode($dados);
    exit;
}

function atualizarProduto(&$produtos, $id, $dadosAtualizados) {
    foreach ($produtos as &$produto) {
        if ($produto['id'] == $id) {
            $produto['nome'] = $dadosAtualizados['nome'];
            $produto['preco'] = floatval($dadosAtualizados['preco']);
            return $produto;
        }
    }
    return null;
}

function excluirProduto(&$produtos, $id) {
    foreach ($produtos as $index => $produto) {
        if ($produto['id'] == $id) {
            array_splice($produtos, $index, 1);
            return true;
        }
    }
    return false;
}
