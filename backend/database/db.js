require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alunos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      matricula VARCHAR(50) UNIQUE NOT NULL,
      curso VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      telefone VARCHAR(20),
      cep VARCHAR(20),
      rua VARCHAR(255),
      numero VARCHAR(20),
      bairro VARCHAR(100),
      cidade VARCHAR(100),
      estado VARCHAR(2),
      semestre VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS professores (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      titulacao VARCHAR(100),
      area VARCHAR(100),
      tempo_docencia INTEGER,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS disciplinas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      carga_horaria INTEGER,
      professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
      curso VARCHAR(100),
      semestre VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS notas (
      id SERIAL PRIMARY KEY,
      aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
      disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
      nota1 DECIMAL(5,2),
      nota2 DECIMAL(5,2),
      media DECIMAL(5,2),
      situacao VARCHAR(50),
      UNIQUE(aluno_id, disciplina_id)
    );

  `;

  try {
    // Cria as tabelas
    await pool.query(query);
    console.log('Tabelas criadas/verificadas com sucesso.');

    // Verifica se já existem alunos (para evitar duplicação em múltiplos restarts)
    const checkRes = await pool.query('SELECT COUNT(*) FROM alunos');
    if (parseInt(checkRes.rows[0].count) === 0) {
      const seedQuery = `
        INSERT INTO admins (nome, email, senha) VALUES 
        ('Administrador Geral', 'admin@fatec.sp.gov.br', 'admin');

        INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, senha) VALUES 
        ('Professor Silva', 'Doutor', 'Matemática', 10, 'silva@fatec.sp.gov.br', 'professor'),
        ('Professora Ana', 'Mestre', 'Programação', 5, 'ana@fatec.sp.gov.br', 'professor'),
        ('Professor Carlos', 'Especialista', 'Redes', 8, 'carlos@fatec.sp.gov.br', 'professor');

        INSERT INTO alunos (nome, matricula, curso, email, senha, cidade, estado, rua, numero, bairro, semestre) VALUES 
        ('Aluno Padrão', '123456', 'Desenvolvimento de Software Multiplataforma', 'aluno@fatec.sp.gov.br', 'aluno', 'São Paulo', 'SP', 'Rua Principal', '100', 'Centro', '1º Semestre'),
        ('João da Silva', '1001', 'Análise de Sistemas', 'joao.silva@fatec.sp.gov.br', 'aluno', 'Campinas', 'SP', 'Rua das Flores', '12', 'Jardim Primavera', '2º Semestre'),
        ('Maria Oliveira', '1002', 'Análise de Sistemas', 'maria.oliveira@fatec.sp.gov.br', 'aluno', 'Jacareí', 'SP', 'Av Brasil', '500', 'Centro', '3º Semestre'),
        ('Pedro Souza', '1003', 'Gestão de TI', 'pedro.souza@fatec.sp.gov.br', 'aluno', 'Santos', 'SP', 'Rua da Praia', '20', 'Gonzaga', '1º Semestre');

        INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES 
        ('Cálculo I', 80, 1, 'Análise de Sistemas', '1º Semestre'),
        ('Programação Mobile I', 80, 2, 'Análise de Sistemas', '4º Semestre'),
        ('Banco de Dados', 60, 2, 'Desenvolvimento de Software Multiplataforma', '2º Semestre'),
        ('Redes de Computadores', 60, 3, 'Análise de Sistemas', '3º Semestre');

        INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) VALUES 
        (1, 2, 8.5, 9.0, 8.75, 'Aprovado'),
        (1, 3, 5.0, 6.0, 5.5, 'Reprovado'),
        (2, 1, 7.0, 8.0, 7.5, 'Aprovado'),
        (2, 2, 9.0, 9.5, 9.25, 'Aprovado'),
        (3, 1, 4.0, 5.0, 4.5, 'Reprovado'),
        (4, 4, 10.0, 10.0, 10.0, 'Aprovado');
      `;
      await pool.query(seedQuery);
      console.log('Dados iniciais (seed) inseridos com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB
};
