# Todo REST API

Este é um exemplo de aplicação RESTful para gerenciar tarefas (todos).

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (v14.x ou superior)
- npm (geralmente vem com o Node.js)
- MySQL / Docker

## Configuração

1. Clone este repositório para o seu ambiente local:

por exemplo:

```bash
`git clone https://github.com/ebagabe/REST-API-todo-list.git`
```

2. Navegue até o diretório do projeto:

```bash
cd REST-API-todo-list.git
```

3. Instale as dependências do projeto:

```bash
npm install
```

4. Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente conforme necessário.

## Executando a aplicação

Para iniciar o servidor da aplicação, execute o seguinte comando:

```bash
npm start
```

### Executando Migrações

Para executar as migrações e criar as tabelas do banco de dados, use o seguinte comando:

```bash
knex migrate:latest
```

### 4. Desfazendo Migrações

Se você precisar desfazer a última migração executada, use o seguinte comando:

```bash
knex migrate:rollback
```

O servidor será iniciado na porta configurada no arquivo `.env`.

## Testando a API com o Postman

Você pode testar os endpoints da API utilizando o Postman. Para isso, siga os passos abaixo:

1. Faça o download da coleção Postman clicando [Download da coleção Postman](./API%20Todo.postman_collection.json).
2. Abra o Postman e clique em "Import" para importar a coleção.
3. Selecione o arquivo que você baixou e clique em "Open".
4. Agora você terá todos os endpoints disponíveis na sua coleção do Postman. Você pode enviar as requisições e testar a API.
