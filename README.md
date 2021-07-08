# server-utils-by-henrique-o-developer

esse é um packege para npm desenvolvido para ajudar a criar um site ou api

como usar:

```js
    - index.js -

    var server_utils = require("server-utils-by-henrique-o-developer");

    var pages = new server_utils("./pages/", false)
```

`var pages = new server_utils("./pages/", false)` 

o primeiro argumento é o diretorio onde estão suas files para o express, o segundo é se você já tem um server express e quer usa-lo


as files express podem ser: 
    .html
    .js

o conteudo de uma file .js deve ser: 

```js
    module.exports = (req, res, params) => {
        res.send("conteudo")
    }
```

o contedudo html pode variar 

o nome dos arquivos ou pastas importa veja o exemplo:

```txt
    root/get/.js > esse arquivo sera carregado como get
    root/.js > esse arquivo tambem sera carregado como get
    root/post.js > esse arquivo sera carregado como post
    root/get - post/.js > esse arquivo sera carregado como get e post
```

você tambem pode utilizar o params ex: 

```js
    module.exports = (req, res, params) => {
        params.setDefault(1, "${html}")

        // id of html

        res.send(params.getDefault(1, {html: "nada"}))

        // ele substituira a palavra "${html}" por "nada"

        params.delDefault(1)
    }
```

compativel com:
    react
    react-dom
    express
    socket.io
    http
    ...

possivelmente incompativel com: 
    next.js