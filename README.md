# Movie Phrases

Uma aplicação web para gerenciar frases de filmes, desenvolvida com JavaScript, Materialize CSS, DOMPurify e Firebase.

## Descrição do Projeto

O Movie Phrases é uma aplicação web onde os usuários podem adicionar e excluir frases de filmes. As frases são persistidas no Firestore, e o login é feito diretamente com o Google Authentication, oferecendo uma experiência de login rápida e segura.

## Tecnologias Utilizadas

- **JavaScript**: A linguagem principal usada para a lógica do projeto.
- **Materialize CSS**: Um framework CSS moderno para estilizar a interface do usuário de forma responsiva e atrativa.
- **DOMPurify**: Uma biblioteca utilizada para sanitizar a entrada do usuário, garantindo a segurança contra XSS (Cross-Site Scripting).
- **Firebase Firestore**: Um banco de dados NoSQL que oferece uma solução de persistência de dados em tempo real.
- **Firebase Authentication**: Utilizado para autenticar os usuários através do login do Google.

## Funcionalidades

- **Adicionar Frases de Filmes**: Os usuários podem adicionar o nome de um filme e uma frase correspondente.
- **Excluir Frases de Filmes**: Opção para remover frases indesejadas.
- **Persistência de Dados**: Todas as frases são armazenadas no Firestore.
- **Autenticação com Google**: Login rápido e seguro utilizando o Google Authentication.
