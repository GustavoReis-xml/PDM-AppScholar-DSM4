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

    CREATE TABLE IF NOT EXISTS cursos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) UNIQUE NOT NULL,
      area VARCHAR(100),
      duracao INTEGER,
      coordenador VARCHAR(255)
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
        ('Admin Mestre', 'admin@fatec.sp.gov.br', 'admin');

        INSERT INTO cursos (nome, area, duracao, coordenador) VALUES
        ('Análise e Desenv. de Sistemas', 'Tecnologia da Informação', 6, 'Prof. Ricardo Lima'),
        ('Desenv. de Software Multiplataforma', 'Tecnologia da Informação', 6, 'Prof. André Olímpio'),
        ('Gestão da Tecnologia da Informação', 'Gestão e Negócios', 6, 'Prof. Mariana Costa'),
        ('Logística', 'Gestão e Negócios', 6, 'Prof. Fernando Alves'),
        ('Gestão de Recursos Humanos', 'Gestão e Negócios', 4, 'Prof. Carla Ribeiro');

        INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, senha) VALUES 
        ('Alberto Silva', 'Mestre', 'Programação', 8, 'alberto@fatec.sp.gov.br', 'prof123'),
        ('Beatriz Souza', 'Doutora', 'Banco de Dados', 12, 'beatriz@fatec.sp.gov.br', 'prof123'),
        ('Carlos Eduardo', 'Especialista', 'Gestão', 5, 'carlos@fatec.sp.gov.br', 'prof123');

        INSERT INTO alunos (nome, matricula, curso, email, senha, cidade, estado, rua, numero, bairro, semestre) VALUES 
        ('Lucas Andrade', '2001', 'Análise e Desenv. de Sistemas', 'lucas@fatec.sp.gov.br', 'aluno123', 'São Paulo', 'SP', 'Rua A', '10', 'Centro', '1º Semestre'),
        ('Felipe Rocha', '2003', 'Gestão da Tecnologia da Informação', 'felipe@fatec.sp.gov.br', 'aluno123', 'Santos', 'SP', 'Rua C', '30', 'Praia', '3º Semestre'),
        ('Juliana Mendes', '2004', 'Gestão da Tecnologia da Informação', 'juliana@fatec.sp.gov.br', 'aluno123', 'São Vicente', 'SP', 'Rua D', '40', 'Centro', '4º Semestre');

        INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES 
        ('Lógica de Programação', 80, 1, 'Análise e Desenv. de Sistemas', '1º Semestre'),
        ('Programação Web', 80, 1, 'Desenv. de Software Multiplataforma', '2º Semestre'),
        ('Banco de Dados Relacional', 80, 2, 'Desenv. de Software Multiplataforma', '2º Semestre'),
        ('Modelagem de Dados', 40, 2, 'Análise e Desenv. de Sistemas', '1º Semestre'),
        ('Empreendedorismo', 40, 3, 'Gestão da Tecnologia da Informação', '3º Semestre'),
        ('Governança de TI', 60, 3, 'Gestão da Tecnologia da Informação', '4º Semestre');

        INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) VALUES 
        (1, 1, NULL, NULL, NULL, NULL), -- Lucas em Lógica
        (1, 4, 8.0, 9.0, 8.5, 'Aprovado'), -- Lucas em Modelagem
        (2, 5, 7.5, 7.5, 7.5, 'Aprovado'), -- Felipe em Empreend.
        (3, 6, 6.0, 5.0, 5.5, 'Reprovado'); -- Juliana em Governança
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
