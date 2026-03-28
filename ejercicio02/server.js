const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Helper para comparar notas
handlebars.registerHelper('esMayor15', function (nota) {
    return nota > 15;
});

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = "";
    let data = {};

    //CSS
    if (req.url === "/style.css") {
        const cssPath = path.join(__dirname, "public", "style.css");
        fs.readFile(cssPath, (err, content) => {
            if (err) {
                res.statusCode = 404;
                res.end();
            } else {
                res.setHeader("Content-Type", "text/css");
                res.end(content);
            }
        });
        return; 
    }

    if (req.url === "/") {
        // Ruta del archivo HBS
        filePath = path.join(__dirname, "views", "home.hbs");

        // Datos dinámicos a enviar
        data = {
            title: "Servidor con Handlebars 🚀",
            welcomeMessage: "Bienvenido al laboratorio de Node.js",
            day: new Date().toLocaleDateString("es-PE"),
            students: ["Ana", "Luis", "Pedro", "María"],
        };
    } else if (req.url === "/about") {
        // Ruta del archivo HBS
        filePath = path.join(__dirname, "views", "about.hbs");

        // Datos dinámicos a enviar
        data = {
            curso: "Desarrollo Web",
            profesor: "Coello",
            fecha: new Date().toLocaleDateString("es-PE")
        };
    } else if (req.url === "/students") {
        // Ruta del archivo HBS
        filePath = path.join(__dirname, "views", "students.hbs");

        // Datos dinámicos a enviar
        data = {
            listaEstudiantes: [
                { nombre: "Ana", nota: 18 },
                { nombre: "Luis", nota: 12 },
                { nombre: "Pedro", nota: 16 },
                { nombre: "María", nota: 14 }
            ]
        };
    }

    if (filePath) {
        // Leer el archivo de plantilla
        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            // Compilar la plantilla con Handlebars
            const template = handlebars.compile(templateData);

            // Renderizar la vista con los datos
            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.end("<h1>404 - Página no encontrada</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});