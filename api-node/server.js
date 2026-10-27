const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
const SEGREDO = 'eu-sou-os-guris7865-e-amo-a-thais';

app.use(cors());
app.use(express.json());

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization ?? '';
  const token = cabecalho.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ erro: 'Token ausente' });
  }
  try {
    req.usuario = jwt.verify(token, SEGREDO);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token invalido ou expirado' });
  }
}

app.get('/', (req, res) => {
  res.send('API do Portifolio em Node: no ar');
});

app.post('/api/login', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.email || !dados.senha) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }
    const [linhas] = await pool.execute('SELECT id, email, senha FROM usuarios WHERE email = ?', [dados.email]);
    const usuario = linhas[0];
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha invalido' });
    }
    const confere = await bcrypt.compare(dados.senha, usuario.senha);
    if (!confere) {
      return res.status(401).json({ erro: 'Email ou senha invalido' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SEGREDO, { expiresIn: '24h' });
    res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.get('/api/projetos', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id";
    const [linhas] = await pool.execute(sql);
    res.json(linhas);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha ao buscar projetos: ' + erro.message });
  }
});

app.post('/api/projetos', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    console.log(dados);

    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';
    
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      'publicado'
    ]);

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.put('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const dados = req.body;

    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = 'UPDATE projetos SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ? WHERE id = ?';
    
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      req.params.id
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    res.json({ mensagem: 'Projeto updated' });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.delete('/api/projetos/:id', autenticar, async (req, res) => {
  try{
    const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({erro: 'Projeto não encontrado'});
    }
    res.status(204).end();
  } catch (erro) {
    res.status(500).json({erro: 'Falha no servidor: ' + erro.message });
  }
});

app.listen(PORTA, () => {
  console.log('API no ar em http://localhost:' + PORTA);
});
