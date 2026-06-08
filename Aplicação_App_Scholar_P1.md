## **Atividade Avaliativa – App Scholar** 

**Professor:** André Olímpio 

## **Disciplina:** Programação para Dispositivos Móveis I 

## **Título do Projeto:** 

Aplicativo Mobile de Gerenciamento de Boletim Acadêmico para Instituições de Graduação em Tecnologia 

## **Descrição Geral:** 

O objetivo desta atividade é desenvolver um **aplicativo mobile multiplataforma utilizando React Native** , voltado para o gerenciamento de informações acadêmicas de uma instituição de ensino superior tecnológica. 

O sistema permitirá autenticação de usuários, cadastro de informações acadêmicas e consulta de boletins, utilizando **React Native, Node.js, APIs REST e banco de dados PostgreSQL** . 

O projeto será dividido em **duas grandes etapas de desenvolvimento** . 

## **PARTE 1 — Desenvolvimento da Interface Mobile (UI/UX)** 

## **Objetivo:** 

Nesta primeira etapa os alunos deverão desenvolver **todas as telas do aplicativo** , implementando a navegação, os componentes visuais e a interação com o usuário. 

Nesta fase **não é obrigatório haver conexão com banco de dados** , podendo ser utilizados **dados simulados (mockados)** . 

O foco será em: 

- construção da interface 

- experiência do usuário 

- organização de componentes 

- utilização de hooks 

- estruturação do projeto React Native 

## **Tecnologias Utilizadas:** 

- React Native 

- Expo.dev 

- JavaScript ou TypeScript 

- React Navigation 

- Hooks do React 

## **Estrutura Inicial do Projeto** 

Sugestão de organização: 

_/src /components /screens /services /hooks /styles /navigation_ 

~~Página~~ ~~**1** de~~ ~~**3**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

## **Conceitos Obrigatórios** 

## **UI/UX Mobile** 

O aplicativo deverá apresentar: 

- layout limpo e organizado 

- navegação intuitiva 

- boa legibilidade 

- feedback visual para ações 

- validação de campos de formulário 

- uso adequado de cores e espaçamentos 

Recomenda-se: 

- uso de **React Navigation** 

- criação de **componentes reutilizáveis** 

- padronização de botões e inputs 

## **Hooks Obrigatórios** 

O projeto deverá utilizar pelo menos: 

- **useState** 

Para gerenciamento de estados de: 

   - campos de formulários 

   - estados de tela 

   - controle de dados temporários 

- **useEffect** 

Para: 

      - inicialização de telas 

      - carregamento de dados simulados 

      - controle de efeitos colaterais 

- **useContext (opcional, recomendado)** 

   - Para gerenciamento de: 

      - estado de autenticação 

      - informações do usuário logado 

## **Telas que Devem Ser Desenvolvidas:** 

## **1. Tela de Login:** 

Campos obrigatórios: 

- login ou email 

- senha 

Elementos obrigatórios: 

- botão de login 

- mensagem de erro caso campos estejam vazios 

Após login simulado, o usuário deve ser redirecionado para a tela principal. 

## **2. Tela Inicial (Dashboard)** 

Esta tela deve apresentar opções de navegação para: 

- cadastro de alunos 

- cadastro de professores 

~~Página~~ ~~**2** de~~ ~~**3**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

- cadastro de disciplinas 

- consulta de boletim 

Pode ser implementada utilizando: 

- botões 

- cards 

- menu inferior ou lateral 

## **3. Tela de Cadastro de Alunos** 

Campos mínimos: 

- Nome 

- Matrícula 

- Curso 

- Email 

- Telefone 

- CEP 

- Endereço 

- Cidade 

- Estado 

Nesta etapa os dados podem ser apenas exibidos no console ou armazenados temporariamente no estado do aplicativo. 

## **4. Tela de Cadastro de Professores** 

Campos obrigatórios: 

- Nome 

- Titulação 

- Área de atuação 

- Tempo de docência 

- Email 

## **5. Tela de Cadastro de Disciplinas** 

Campos obrigatórios: 

- Nome da disciplina 

- Carga horária 

- Professor responsável 

- Curso 

- Semestre 

## **6. Tela de Visualização de Boletim** 

Deverá apresentar informações organizadas como: 

- disciplina 

- nota 1 

- nota 2 

- média 

- situação 

Os dados podem ser simulados nesta etapa. 

~~Página~~ ~~**3** de~~ ~~**3**~~ 

~~**Curso:** Desenvolvimento de Software Multiplataforma~~ 

