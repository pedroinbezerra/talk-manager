# Chatbot

Esse projeto contém o código fonte da comunicação entre o [Botpress](https://botpress.com/) e [Rocketchat](https://pt-br.rocket.chat/)

<!-- O link para acessar o projeto em produção e homologação, são respectivamente:

POST:
<br>
http://url-do-projeto.com
<br>
http://url-do-projeto.com -->

## Pré-requisitos
 
Para começar a trabalhar no projeto você vai precisar dos programas abaixo instalados em sua máquina:
 
 - [GIT](https://git-scm.com/downloads)
 - [Node.js](https://nodejs.org/en/download/)
 - [Docker](https://www.docker.com/)

<!-- Para configurar o projeto em sua máquina, siga o passo a passo abaixo:

## Clonando o projeto

- Clone o projeto usando o git, via SSH ou HTTPS, clicando no botão **Clone**, na página do GIT do projeto ou usando os comandos abaixo:

Clone via SSH:
```
git clone ssh://git@gitlab.unimedfortaleza.com.br:2222/novas-tecnologias/rchat-webhook.git
```

Clone via HTTPS:
```
git clone http://gitlab.unimedfortaleza.com.br/novas-tecnologias/rchat-webhook.git -->
```

## Instalando as dependências

Para instalar as dependências , acesse a pasta onde o projeto foi clonado e em seguida execute o comando abaixo:

```
npm install
```


## Ajustando o ambiente

Para o correto funcionamento do ambiente, é necessário que o arquivo .env esteja devidamente configurado. Para isso, faça uma cópia do arquivo ***.env.example*** e renomeie para ***.env***.
Com isso, o ambiente já estará configurado com os apontamentos para as integrações com os sistemas de homologação.

## Executando o projeto

O projeto pode ser executado usando Docker ou NPM.
Para execução do projeto usando Docker, execute o comando abaixo. Com isso o container será criado com uma imagem do Redis e executando o projeto logo em seguida.

``` bash
docker compose up
```

Para executar o projeto usando o NPM, execute primeiramente o redis conforme abaixo:
``` bash
docker compose up redis
```

Em seguida execute o projeto utilizando o comando abaixo:
``` bash
npm run start:dev
```

<!-- **Observações importantes:** 

Caso execute o projeto utilizando NPM, ajuste o  arquivo ***.env*** para apontar corretamente para o redis, inserindo o host e porta correta. Se o projeto estiver sendo executado localmente, com as informações padrão do arquivo .env.example, o ***REDIS_HOST*** deverá apontar para localhost e o ***REDIS_PORT*** para 6382. -->


## Visualizando o projeto

Por padrão, o projeto pode ser acessado através da URL abaixo, caso esteja sendo executado com NPM:

POST - [http://localhost:3000/rchat](http://localhost:3000/rchat)

<!-- Caso o projeto esteja sendo executado usando Docker, por padrão poderá ser acessado através do endereço:

POST - [http://localhost:9091/rchat](http://localhost:9091/rchat) -->

## Disponibilizando o projeto na web

Para disponibilizar o projeto na web e testar usando o Rocketchat, por exemplo, utilize o [Ngrok](https://ngrok.com/download).
Abra o ngrok e digite o comando abaixo.

Levando em conta que o projeto está rodando na porta 3000 e você está no diretório onde está o executável do Ngrok:
``` bash
ngrok.exe http 3000
```

Após executar, será exibida uma tela com os parâmetros da sessão iniciada. Copie a URL do último parâmetro **_Forwarding_**. Essa será a URL com protocolo HTTPS e finalizará com ngrok.io.

Exemplo:
```
https://1a47-181-191-170-225.ngrok.io
```

## Testar usando o Rocketchat

Ao acessar o Rcketchat, clique na foto do perfil e selecione a opção Omnichannel.<br>
Após isso, selecione a opção **Webhooks** e no campo **URL do webhook** adicione a URL pública, como por exemplo, a disponibilizada pelo Ngrok, e ao fim da URL adicione /listen.

Exemplo
```
https://1a47-181-191-170-225.ngrok.io/listen
```

Clique em salvar no cando direito superior e com isso, o Rocketchat já está encaminhando os eventos selecionados na página de Webhooks para o endpoint informado.
