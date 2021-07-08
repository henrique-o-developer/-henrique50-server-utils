# server-utils-by-henrique-o-developer


please use google translator pt-br


esse é um packege para npm desenvolvido para ajudar a criar um site ou api<br>

como usar:<br>

```js
    - index.js -

    var server_utils = require("server-utils-by-henrique-o-developer");

    var pages = new server_utils("./pages/", false)
```

`var pages = new server_utils("./pages/", false)` <br>

o primeiro argumento é o diretorio onde estão suas files para o express, o segundo é se você já tem um server express e quer usa-lo.<br>
caso não tenha servidor pode usar 2 parametros:
```js
    var pages = new server_utils("./pages/", false) || new server_utils("./pages/", {port: 3000 /*defautl*/, useSocket: true /*default*/})
```
caso já tenha um servidor express use: `app.use(pages.getRoutes())`<br>


as files express podem ser: <br>
    .html<br>
    .js<br>

o conteudo de uma file .js deve ser: <br>

```js
    module.exports = (req, res, params) => {
        res.send("conteudo")
    }
```

o contedudo html pode variar <br>

o nome dos arquivos ou pastas importa veja o exemplo: <br>

```txt
    root/get/.js > esse arquivo sera carregado como get
    root/.js > esse arquivo tambem sera carregado como get
    root/post.js > esse arquivo sera carregado como post
    root/get - post/.js > esse arquivo sera carregado como get e post
```

você tambem pode utilizar o params ex: <br>

```js
    module.exports = (req, res, params) => {
        params.setDefault(1, "${html}")

        // 1 é o id do html ex: ["html", "${html}"]
        //caso ja existisse algum conteudo em "1" ele seria movido para 2 ex: ["html", "body"] -> ["html", "${html}", "body"] 

        res.send(params.getDefault(1, {html: "nada"}))

        // ele substituira a palavra "${html}" por "nada"

        params.delDefault(1)
    }
```

as palavras que compoem os diretorios ou nomes de arquivos (com relevancia) são:<br>

```txt
    "get" ou nada para metodo get
    "post" para metodo post
    "ignore" para ignorar (não criar rota)    
```

compativel com:<br>
    react<br>
    react-dom<br>
    express<br>
    socket.io<br>
    http<br>
    ...<br>

possivelmente incompativel com: <br>
    next.js<br>