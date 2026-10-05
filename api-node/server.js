const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORTA = 3000;
app.use(cors());


app.get('/api/projetos/:id', async (req, res) => {
  const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE id = ? AND status = 'publicado'";
  const [linhas] = await pool.excute(sql, [req.params.id]);
  if (linhas.length === 0) {
    return res.status(404).json({ erro: 'Projeto nao encontrado'});
  }
  res.json(linhs[0]);
});

app.listen(PORTA, () => {
  console.log('API no ar em http://localhost')
})