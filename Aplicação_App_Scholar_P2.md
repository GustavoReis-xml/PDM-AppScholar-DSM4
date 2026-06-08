## **Atividade Avaliativa – App Scholar** 

**Professor:** André Olímpio 

**Disciplina:** Programação para Dispositivos Móveis I 

## **Título do Projeto:** 

Aplicativo Mobile de Gerenciamento de Boletim Acadêmico para Instituições de Graduação em Tecnologia 

## **Objetivo** 

Nesta segunda etapa os alunos deverão implementar a conectividade do aplicativo com um backend e banco de dados, transformando o protótipo desenvolvido na Parte 1 em um sistema funcional. Serão implementados: 

- backend em Node.js 

- APIs REST 

- integração com PostgreSQL 

- consumo de APIs externas 

- requisições HTTP no aplicativo mobile 

## **Tecnologias Utilizadas** 

Backend: 

   - Node.js 

- Express.js 

- Banco de dados: 

   - PostgreSQL 

Comunicação: 

- API REST 

- JSON 

- Axios ou Fetch 

## **Estrutura Sugerida do Backend** 

/backend /controllers /routes /models /database server.js 

~~Página~~ ~~**1** de~~ ~~**4**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

## **Banco de Dados (PostgreSQL)** 

## **O banco deverá possuir pelo menos as seguintes tabelas: Tabela alunos** 

id 

nome matricula curso email telefone cep endereco cidade estado 

## **Tabela professores** 

id 

nome titulacao area tempo_docencia email 

## **Tabela disciplinas** 

id 

nome carga_horaria professor_id curso semestre 

## **Tabela notas** 

id aluno_id disciplina_id nota1 

nota2 

media situacao 

## **APIs Obrigatórias (Backend)** 

## **API 1 – Autenticação de Usuários** 

Endpoint exemplo: POST /api/login Função: 

- validar login e senha 

- retornar dados do usuário 

- gerar token de autenticação (JWT recomendado) 

Resposta esperada: { "token": "jwt_token", 

~~Página~~ ~~**2** de~~ ~~**4**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

"usuario": { "nome": "João", "perfil": "aluno" } } 

## **API 2 – Cadastro de Dados Acadêmicos** 

Endpoints possíveis: POST /api/alunos POST /api/professores POST /api/disciplinas Essas APIs deverão: 

- receber dados do aplicativo mobile 

- armazenar informações no banco PostgreSQL 

- retornar confirmação da operação 

## **API 3 – Consulta de Boletim** 

Endpoint exemplo: GET /api/boletim/:matricula 

Deve retornar: 

- disciplinas cursadas 

- notas 

- média 

- situação 

Exemplo de resposta: 

{ 

"aluno": "Maria Souza", "disciplinas": [ { 

"disciplina": "Programação Mobile", 

"nota1": 8, "nota2": 7, "media": 7.5, "situacao": "Aprovado" 

} ] } 

## **APIs Externas Obrigatórias** 

O aplicativo deverá integrar pelo menos duas APIs externas públicas. **API 1 – ViaCEP** 

Uso: 

• preenchimento automático de endereço no cadastro de alunos. Exemplo de requisição: https://viacep.com.br/ws/12245000/json/ 

~~Página~~ ~~**3** de~~ ~~**4**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

## **API 2 – IBGE Localidades** 

Uso: 

- carregar lista de estados 

- carregar lista de cidades 

Exemplo: 

https://servicodados.ibge.gov.br/api/v1/localidades/estados 

~~Página~~ ~~**4** de~~ ~~**4**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

