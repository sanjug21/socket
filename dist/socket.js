"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const sendMessage_1 = require("./Message/sendMessage");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
// app.get('/', (req, res) => {
//     res.send('Socket Server is running!');
// });
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("[Server] MONGODB_URI not found in environment variables.");
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI).then(() => {
    console.log("[DB] Successfully connected to the database.");
    io.on("connection", (socket) => {
        console.log(`[Socket] User connected: ${socket.id}`);
        socket.on("join", (userId) => {
            console.log(`[Socket] User ${socket.id} joined room: ${userId}`);
            socket.join(userId);
        });
        socket.on("sendMessage", async (payload) => await (0, sendMessage_1.sendMessage)(io, socket, payload));
        socket.on("disconnect", () => {
            console.log(`[Socket] User disconnected`);
        });
    });
    const PORT = process.env.SOCKET_PORT || 3001;
    httpServer.listen(PORT, () => {
        console.log(`[Server] Express & Socket.IO running on port ${PORT}`);
    });
}).catch((error) => {
    // Add error handling for the database connection
    console.error("[Server] Failed to connect to the database:", error);
    process.exit(1);
});
//# sourceMappingURL=socket.js.map