const fs = require('fs')
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

function isFolder(path, root) {
    if (!root.endsWith('/')) {
        root+="/"
    }
    if (path.startsWith(root)) {
        root = ""
    }
    try {
        fs.readdirSync(root+path)
        return true
    } catch (err) {
        delete err
        return false
    }
}

class params {
    constructor() {
        this.defaults = [
            `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport"content="width=device-width,initial-scale=1.0"><title>\${title}</title></head><body></body>\${body}</html>`
        ];
        this.addinall = []
    }

    getDefault(index, obj) {
        var obs = this.defaults[index];
        if (obj)
            Object.keys(obj).forEach((val) => {
                obs.split("$").forEach((vaul) => {
                    var vall = "$" + vaul.split("}")[0] + "}" 
                    if (vall == `\${${val}}`) {
                        obs = obs.replace(`\${${val}}`, obj[val])
                    }
                })
            })
        return obs;
    }

    setDefault(index, val) {
        this.default.splice(index+1, 0, val);
    }

    delDefault(index) {
        this.default.splice(index, 1)
    }

    addInAll(text) {
        this.addinall.push(text)
    }
}

class def {
    constructor(pathh, haveServer) {
        var path = pathh
        if (path.endsWith("/"))
            path = path.slice(0, -1);
        this.root = path
        this.haveServer = haveServer
        this.params = new params();
        this.routes = new express.Router();
    }

    construct() {
        var folders = []
        var data = fs.readdirSync(this.root)
        var add = ""
        this.params.addinall.forEach((val) => {
            add += val
        })
        data.forEach((file) => {
            if (!file.includes("ignore")) {
                if (isFolder(file, this.root)) {
                    folders.push(this.root+"/"+file)
                } else {
                    var route = "/"+file.split(".")[0].replace(/:/g, "/:")

                    route = route.replace("//", "/")

                    console.log(`rota ${route} está preparada para uso`)
                    if (route.includes("post")) {
                        if (file.split(".")[1] == "js") {
                            this.routes.post(route, (req, res) => {
                                require(this.root+"/"+file)(req, res, this.params)
                            })
                        } else if (file.split(".")[1] == "html") {
                            this.routes.post(route, (req, res) => {
                                res.send(fs.readFileSync(this.root+"/"+file) + add)
                            })
                        }
                    }
                    if (!route.includes("post") || this.root.includes("get")) {
                        if (file.split(".")[1] == "js") {
                            this.routes.get(route, (req, res) => {
                                require(this.root+"/"+file)(req, res, this.params)
                            })
                        } else if (file.split(".")[1] == "html") {
                            this.routes.get(route, (req, res) => {
                                res.send(fs.readFileSync(this.root+"/"+file, {encoding:'utf8', flag:'r'}) + add)
                            })
                        }
                    }
                }
            }
        })
        while (folders.length > 0) {
            var data = fs.readdirSync(folders[0])
            data.forEach((file) => {
                if (file.includes("ignore")) {
                    delete folders[0]
                    folders.splice(0, 1)
                    return
                } else {
                    if (isFolder(file, folders[0])) {
                        folders.push(folders[0]+"/"+file)
                    } else {
                        var route = folders[0].replace(this.root, "")+"/"+file.split(".")[0].replace(/:/g, "/:")

                        route = route.replace("//", "/")
                        
                        console.log(`rota ${route} está preparada para uso`)

                        if (route.includes("post")) {
                            if (file.split(".")[1] == "js") {
                                this.routes.post(route, (req, res) => {
                                    require(folders[0]+"/"+file)(req, res, this.params)
                                })
                            } else if (file.split(".")[1] == "html") {
                                this.routes.post(route, (req, res) => {
                                    res.send(fs.readFileSync(folders[0]+"/"+file))
                                })
                            }
                        }
                        if (!route.includes("post") || this.root.includes("get")) {
                            if (file.split(".")[1] == "js") {
                                this.routes.get(route, (req, res) => {
                                    require(folders[0]+"/"+file)(req, res, this.params)
                                })
                            } else if (file.split(".")[1] == "html") {
                                this.routes.get(route, (req, res) => {
                                    res.send(fs.readFileSync(folders[0]+"/"+file))
                                })
                            }
                        }
                    }
                }
                delete folders[0]
                folders.splice(0, 1)
            })
        }



        if (this.haveServer || this.haveServer == false) {
            if (typeof(this.haveServer) == "object") {
                const app = express();
                const server = http.createServer(app);
                const port = this.haveServer.port || 3000
                if (this.haveServer.useSocket) {
                    const io = new Server(server);
                }
                app.use(this.routes)
                server.listen(port);
            } else {
                const app = express();
                const server = http.createServer(app);
                const io = new Server(server);
                app.use(this.routes)
                server.listen(3000);
            }
        }
    }

    getRoutes() {
        return this.routes;
    }
} 


module.exports = def
