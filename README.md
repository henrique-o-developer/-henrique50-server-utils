# server-utils-by-henrique-o-developer

esse é um packege para npm desenvolvido para ajudar a criar um site ou api

como usar:

```js
    - index.js -

    var server_utils = require("server-utils-by-henrique-o-developer");

    var pages = server_utils("./pages/", false)
```

`var pages = server_utils("./pages/", false)` 

o primeiro argumento é o diretorio onde estão suas files para o express, o segundo é se você já tem um server express e quer usa-lo
 