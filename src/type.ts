export interface SendMessagePayload {
    senderId: string;
    receiverId: string;
    message?: string;
    image?: string;
    video?: string;
    audio?: string;
    file?: string;
}