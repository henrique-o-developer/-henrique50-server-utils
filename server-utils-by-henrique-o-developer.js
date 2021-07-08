const fs = require('fs')
const express = require('express');

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
}

class def {
    constructor(path, haveServer) {
        this.root = path
        this.params = new params();
        this.routes = new express.Router();
        var folders = []
        var data = fs.readdirSync(path)

        data.forEach((file) => {
            if (isFolder(file, path)) {
                folders.push(path+"/"+file)
            } else {
                var route = "/"+file.split(".")[0].replace(/:/g, "/:")

                route = route.replace("//", "/")

                console.log(`rota ${route} está preparada para uso`)
                if (route.includes("post")) {
                    this.routes.post(route, require(path+"/"+file))
                }
                if (!route.includes("post") || path.includes("get")) {
                    this.routes.get(route, (req, res) => {
                        require(path+"/"+file)(req, res, this.params)
                    })
                }
            }
        })

        while (folders.length > 0) {
            var data = fs.readdirSync(folders[0])
            data.forEach((file) => {
                if (isFolder(file, folders[0])) {
                    folders.push(folders[0]+"/"+file)
                } else {
                    var route = folders[0].replace(this.root, "")+"/"+file.split(".")[0].replace(/:/g, "/:")

                    route = route.replace("//", "/")
                    
                    console.log(`rota ${route} está preparada para uso`)

                    if (route.includes("post")) {
                        this.routes.post(route, require(folders[0]+"/"+file))
                    }
                    if (!route.includes("post") || path.includes("get")) {
                        this.routes.get(route, (req, res) => {
                            require(folders[0]+"/"+file)(req, res, this.params)
                        })
                    }
                }
            })
            delete folders[0]
            folders.splice(0, 1)
        }



        if (haveServer || haveServer == false) {
            if (typeof(haveServer) == "object") {
                
            } else {

            }
        }
    }

    getRoutes() {
        return this.routes;
    }
} 


module.exports = def
