const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const { method, url } = req;

    // RUTA: GET /students
    if (url === "/students" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify(repo.getAll()));
    }

    // RUTA: GET /students/:id
    else if (url.startsWith("/students/") && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        const student = repo.getById(id);

        if (student) {
            res.statusCode = 200;
            res.end(JSON.stringify(student));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    }

    // RUTA: POST /students (CON VALIDACIÓN)
    else if (url === "/students" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const data = JSON.parse(body);
            
            // VALIDACIÓN:
            if (!data.name || !data.email || !data.course || !data.phone) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Faltan campos obligatorios: name, email, course o phone" }));
            }

            const newStudent = repo.create(data);
            res.statusCode = 201;
            res.end(JSON.stringify(newStudent));
        });
    }

    // RUTA: POST /ListByStatus
    else if (url === "/ListByStatus" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        try {
            const { status } = JSON.parse(body);

            if (!status) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Debe enviar el campo status" }));
            }

            const result = repo.getByStatus(status);

            if (result.length === 0) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: "No hay estudiantes con ese estado" }));
            }

            res.statusCode = 200;
            res.end(JSON.stringify(result));
        } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "JSON inválido" }));
        }
    });
}

    else if (url === "/ListByGrade" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        try {
            const { grade } = JSON.parse(body);

            if (grade === undefined) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Debe enviar el campo grade" }));
            }

            const result = repo.getByGrade(grade);

            if (result.length === 0) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: "No hay estudiantes con ese promedio" }));
            }

            res.statusCode = 200;
            res.end(JSON.stringify(result));
        } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "JSON inválido" }));
        }
    });
}

    // RUTA: PUT /students/:id
    else if (url.startsWith("/students/") && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const updated = repo.update(id, JSON.parse(body));
            if (updated) {
                res.statusCode = 200;
                res.end(JSON.stringify(updated));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
            }
        });
    }

    // RUTA: DELETE /students/:id
    else if (url.startsWith("/students/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const deleted = repo.remove(id);

        if (deleted) {
            res.statusCode = 200;
            res.end(JSON.stringify(deleted));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    }

    // Ruta no encontrada
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
});

server.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});