const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000; // Default to port 3000 if --port is not provided

let homeContent = "";
let projectContent = "";
let registrationContent = "";

// Function to read files before starting the server
function loadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf-8", (err, data) => {
            if (err) {
                console.error(`Error reading ${filename}:`, err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Load all files and start the server
Promise.all([
    loadFile("home.html"),
    loadFile("project.html"),
    loadFile("registration.html")
])
    .then(([home, project, registration]) => {
        homeContent = home;
        projectContent = project;
        registrationContent = registration;

        // Create and start the server
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
        }).listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(() => {
        console.error("Server failed to start due to file loading error.");
    });
