import mongoose, { Document, Schema } from "mongoose";

export enum MessageEnum {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    FILE = "file",
    AUDIO = "audio"
}

export interface Message extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message?: string;
    image?: string;
    video?: string;
    file?: string;
    audio?: string;
    isEdited: boolean;
    isDeleted: boolean;
    isSeen: boolean;
}

const MessageSchema: Schema<Message> = new mongoose.Schema(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String },
        image: { type: String },
        video: { type: String },
        file: { type: String },
        audio: { type: String },
        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isSeen: { type: Boolean, default: false }
    },
    { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema);
