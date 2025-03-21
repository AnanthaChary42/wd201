const http = require("http");
const fs = require("fs");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2));

const port = args.port || 3000;

// Load files synchronously
const homeContent = fs.readFileSync("home.html", "utf8");
const projectContent = fs.readFileSync("project.html", "utf8");
const registrationContent = fs.readFileSync("registration.html", "utf8");

const server = http.createServer((request, response) => {
    console.log(`Request received: ${request.url}`);

    if (request.url === "/" || request.url === "/home") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(homeContent);
    } else if (request.url === "/project") {  // 🔥 Fix route name
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(projectContent);
    } else if (request.url === "/registration") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(registrationContent);
    } else {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end("<h1>404 Not Found</h1>");
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
