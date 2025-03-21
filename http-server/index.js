const http = require("http");
const fs = require("fs");
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

const port = args.port || 3000;

let homeContent = "";
let projectContent = "";
let registrationContent = "";

// Load files
fs.readFile("home.html", (err, home) => {
    if (err) throw err;
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err) throw err;
    projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
    if (err) throw err;
    registrationContent = registration;
});

// Create server
http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    switch (request.url) {
        case "/project.html":
            response.write(projectContent);
            break;
        case "/registration.html":
            response.write(registrationContent);
            break;
        default:
            response.write(homeContent);
            break;
    }
    response.end();
}).listen(port);
