import mongoose, { Document, Schema, Types } from "mongoose";
import "./User.model";

export interface Conversation extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    lastMessage: string;
    lastMessageSeen: boolean;
}

const ConversationSchema = new Schema<Conversation>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lastMessage: { type: String},
        lastMessageSeen: { type: Boolean, default: false }
    },
    { timestamps: true }
);


ConversationSchema.index(
    { senderId: 1, receiverId: 1 },
    { unique: true }
);

export default mongoose.models.Conversation ||  mongoose.model<Conversation>("Conversation", ConversationSchema);
