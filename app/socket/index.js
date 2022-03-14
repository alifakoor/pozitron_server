const { Server } = require("socket.io");
const io = new Server({ cors: { origin: [process.env.CORS_DOMAINS] } });

io.on("connection", (socket) => {
  console.log("new user connected.");
});

module.exports = io;
