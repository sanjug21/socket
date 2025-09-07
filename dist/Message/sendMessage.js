"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const Message_model_1 = __importDefault(require("../models/Message.model"));
const sendMessage = async (io, socket, data) => {
    try {
        const lastMessagePreview = data.message?.trim()
            ? data.message.trim()
            : data.image
                ? "sent a photo 📷"
                : data.video
                    ? "sent a video 📹"
                    : data.audio
                        ? "sent an audio 🎵"
                        : data.file
                            ? "sent a file 📄"
                            : "";
        let senderConversation = await Conversation_model_1.default.findOne({
            senderId: data.senderId,
            receiverId: data.receiverId,
        });
        if (!senderConversation) {
            senderConversation = await Conversation_model_1.default.create({
                senderId: data.senderId,
                receiverId: data.receiverId,
                lastMessage: lastMessagePreview,
                lastMessageSeen: true,
            });
        }
        else {
            senderConversation.lastMessage = lastMessagePreview;
            senderConversation.lastMessageSeen = true;
            await senderConversation.save();
        }
        let receiverConversation = await Conversation_model_1.default.findOne({
            senderId: data.receiverId,
            receiverId: data.senderId,
        });
        if (!receiverConversation) {
            receiverConversation = await Conversation_model_1.default.create({
                senderId: data.receiverId,
                receiverId: data.senderId,
                lastMessage: lastMessagePreview,
            });
        }
        else {
            receiverConversation.lastMessage = lastMessagePreview;
            receiverConversation.lastMessageSeen = false;
            await receiverConversation.save();
        }
        const senderMessage = await Message_model_1.default.create({
            conversationId: senderConversation._id,
            isSeen: true,
            ...data,
        });
        const receiverMessage = await Message_model_1.default.create({
            conversationId: receiverConversation._id,
            ...data,
        });
        socket.emit("message_success", { status: "ok" });
        io.to(data.senderId).emit("messages", senderMessage);
        io.to(data.receiverId).emit("messages", receiverMessage);
        const emitConversations = async (userId) => {
            const updated = await Conversation_model_1.default.find({ senderId: userId })
                .populate("receiverId", "name dp email")
                .sort({ updatedAt: -1 });
            io.to(userId).emit("conversation", updated);
        };
        await emitConversations(data.senderId);
        await emitConversations(data.receiverId);
    }
    catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", "Failed to send message");
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=sendMessage.js.map