import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';       
import { SendMessagePayload } from './type';
import { sendMessage } from './Message/sendMessage';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
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


mongoose.connect(MONGODB_URI).then(() => {
    console.log("[DB] Successfully connected to the database.");

    io.on("connection", (socket: Socket) => {
        console.log(`[Socket] User connected: ${socket.id}`);


        socket.on("join", (userId: string) => {
            console.log(`[Socket] User ${socket.id} joined room: ${userId}`);
            socket.join(userId);
        });
        socket.on("sendMessage", async (payload: SendMessagePayload) => await sendMessage(io, socket, payload));

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