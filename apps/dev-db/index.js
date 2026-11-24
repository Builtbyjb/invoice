import { spawn, execSync } from "node:child_process";

const subprocess1 = spawn("docker", ["compose", "up"]);

subprocess1.stdout.on("data", (data) => {
    console.log(data.toString());
});

subprocess1.stderr.on("data", (data) => {
    console.log(data.toString());
});

process.on("SIGINT", () => {
    console.log("Clean up");
    execSync("docker compose down");
});
