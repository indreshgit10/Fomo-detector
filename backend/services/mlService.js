const http = require("http");
const FomoLog = require("../models/FomoLog");

let clients = [];

const startMLStreamListener = () => {
  const url = process.env.ML_SERVER_URL || "http://localhost:9000";
  console.log(`Connecting to FastAPI ML Stream at: ${url}/data_stream`);

  const connect = () => {
    http.get(`${url}/data_stream`, (res) => {
      let buffer = "";

      res.on("data", async (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        // Keep the last incomplete line in the buffer
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            
            // Save to MongoDB
            const log = new FomoLog(data);
            await log.save();

            // Broadcast to all connected frontend clients
            clients.forEach(client => {
              client.write(`data: ${JSON.stringify(log)}\n\n`);
            });
          } catch (err) {
            console.error("Error parsing or saving streamed data:", err.message);
          }
        }
      });

      res.on("end", () => {
        console.log("ML Stream connection closed, attempting reconnect in 5s...");
        setTimeout(connect, 5000);
      });
    }).on("error", (err) => {
      console.error("Failed to connect to Python ML Stream server:", err.message);
      console.log("Retrying connection in 5s...");
      setTimeout(connect, 5000);
    });
  };

  connect();
};

const addClient = (res) => {
  clients.push(res);
};

const removeClient = (res) => {
  clients = clients.filter(c => c !== res);
};

module.exports = {
  startMLStreamListener,
  addClient,
  removeClient
};
