<?php
// api/projetos.php - le, cria, altera e apaga projetos (CRUD completo)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Sem isto, um tropeco no banco devolve tela em branco e voce fica sem pista.
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha no servidor: ' . $e->getMessage()]);
});

// Antes de um POST/PUT/DELETE o navegador pergunta "posso?" com um OPTIONS.
// Responda 204 (ok, sem corpo) e saia - isto e o "pre-voo" do CORS.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($metodo === 'GET') {
    $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos";
    $projetos = $pdo->query($sql)->fetchAll();
    echo json_encode($projetos);
    exit;
}

// Chegou ate aqui? O verbo nao e tratado (ainda).
http_response_code(405);
echo json_encode(['erro' => 'Metodo nao permitido']);
