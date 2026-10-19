const express = require('express');
const cors = require('cors');
const app = express();
const PORTA = 3000;
app.use(cors());

// const cors = require('cors');
// const pool = require('./db');


// app.use(cors());

app.get('/', (req, res) => {
  res.send('API do Portifolio em Node:  no ar');
});

app.get('/api/projetos', (req, res) => {
  res.json(projetos);
});

app.listen(PORTA, () => {
  console.log('API no ar e, http://localhost:' + PORTA);
});

const projetos = [
  {
    id: 1,
    nome: 'Portifolio Angular',
    descricao: 'Meu Potifolio Angular com Angular Material.',
    tecnologias: 'Angular, TypeScript',
    link_github: 'https://github.com/rafamassa67/2026-DWII-portfolio-angular',
    ano: 2026
  },
  {
    id: 2,
    nome: 'API de Portifolio em PHP',
    descricao: 'Endpoints de projetos e catalogo com PDO e MariaDB.',
    tecnologias: 'PHP, MariaDB',
    link_github: null,
    ano: 2026
  },
  {
    id: 3,
    nome: 'Siste,a de Cadastro v1',
    descricao: 'CRUD em PHP do 1o trimestre.',
    tecnologias: 'PHP, MariaDB, Boostrap',
    link_github: null,
    ano: 2026
  },
];