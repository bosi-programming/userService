# API de Lista de tarefas / Todo list

Esta é uma API para cadastro de lista de tarefas com cadastro de usuários e com suporte a upload de tarefas em arquivos de excel em formato xlsx.

O sistema realiza tanto o cadastro de usuários como o de tarefas no banco de dados MongoDB.

Para usar a API, primeiro o usuário deve se cadastrar no sistema e fazer login para adquirir um token de acesso. A partir daí ele tem acesso tanto ao cadastro e descadastro de tarefas como o seu próprio descadastro total do sistema, incluíndo exclusão de todas as tarefas cadastradas em seu ID/email.

## Como trabalhar

Este projeto foi todo feito em TypScript. Para rodar o projeto em modo de desenvolvimento, foi criado o script `npm run dev` ou `yarn dev` que já acompanha as mudanças realizadas pelo programador em tempo real.

Com as mudanças feitas, antes de se dar deploy no projeto para produção, é também necessário realizar o build do mesmo, através do comando `npm run build` ou `yarn build`.

Para dar deploy, neste momento, no sistema é necessário ter acesso a conta principal do Heroku e dar push da branch main para a mesma.

## Endpoints

### /api/users

#### POST

O post para o endpoind de `/api/users` é utilizado para criar novos usuários dentro do sistema. Para isso, é necessário enviar para o mesmo um JSON no body da request com os seguintes valores:

- cpf: Valor em string senguindo ou o padrão XXX.XXX.XXX-XX ou XXXXXXXXXXX, onde X é qualquer valor entre 0 e 9;
- email: Valor em string;
- telefone: Valor com DDD em string seguindo o formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX;
- senha: Valor em string.

O sistema também verifica se os valores de CPF, email e telefone seguem os padrões nacionais do mesmo de modo a rejeitar valores inválidos dos mesmos;

#### Delete

Um delete neste endpoint deleta o usuário e todas as suas tarefas cadastradas do sistema. Realizamos o mesmo a partir do ID retirado do token de acesso. Como uma forma extra de verificar que estamos descadastrando o usuário correto, também pedimos o email do mesmo. 

Para utilizar este endpoint você precisa colocar na sua request:

Header

- x-access-token: Valor pego através de login no endpoint `/api/login`

Body

- email: string com o email cadastrado no sistema

### /api/login

#### POST

Este endpoint somente aceita POST e retorna um JSON Web Token (JWT) para que o usuário tenha acesso ao restante do sistema. Para utilizar este endpoint, precisamos que nos envie no Body da request:

- email: string com o email do usuário cadastrado no sistema
- senha: string com a senha do usuário

O sistema retorna um JSON com a propriedade "token" com o valor dentro desta chave.

### /api/todo

Qualquer tipo de request dentro deste endpoint necessita o uso de um token conseguido a partir do endpoint de login. O mesmo deve ser enviado sempre no Header como a propriedade `x-access-token`.

#### GET

Um GET neste endpoint trás toda a lista de tarefas cadastradas no id do usuário.

#### POST

Um POST em `/api/todo` realiza o cadastro de uma tarefa dentro do sistema. O sistema checa se a tarefa não existe no sistema para aquele usuário em específico e se não a cadastra no mesmo.

Para realizar este cadastro de tarefa, precisamos:

- nome: string com o nome dado a tarefa;
- data: string com data a ser finalizada a tarefa;
- hora: string hora da tarefa;

Não é obrigatório para o cadastro da tarefa, mas o sistema também aceita valores de status:

- status: enum com um dos valores: "naoIniciado", "emProgresso" ou "completo".

#### PUT

Um put neste endpoint atualiza uma tarefa em específico do usuário do sistema. Para isso precisamos tanto do webtoken do usuário, do nome da tarefa a ser atualizada e os dados a serem modificados, sendo que qualquer mudança no nome deve ser passada como newNome. Os parâmetros mínimos são:

- nome: nome da tarefa a ser atualizada em string.

Pelo menos um entre os parâmetros abaixo:

- newNome: string com o novo nome dado a ser dado a tarefa;
- data: string com data a ser finalizada a tarefa;
- hora: string hora da tarefa;
- status: enum com um dos valores: "naoIniciado", "emProgresso" ou "completo".

#### Delete

Um delete neste endpoint deleta uma tarefa específica cadastrada na conta do usuário. Para isso, além do webtoken, precisamos:

- nome: string com o nome dado a tarefa;

### /api/todo/bulk

Este endpoint somente aceita POSTs. A partir do mesmo, o usuário consegue cadastrar várias tarefas de uma única vez através do upload de um arquivo de excel no formato xlsx. Para isto, além do webtoken, precisamos que o arquivo seja enviado no corpo da request dentro do parâmetro `tabela` e que a tabela contenha as seguintes colunas totalmente preenchidas

- nome: string com o nome dado a tarefa;
- data: string com data a ser finalizada a tarefa;
- hora: string hora da tarefa;

Não é obrigatório para o cadastro de qualquer uma das tarefas no arquivo, mas o sistema também aceita os seguintes valores de status:

- status: enum com um dos valores: "naoIniciado", "emProgresso" ou "completo".
