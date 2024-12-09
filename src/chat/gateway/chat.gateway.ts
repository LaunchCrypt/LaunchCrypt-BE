import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from "../schemas/chat.schemas"
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
        transports: ['websocket', 'polling'],
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
    ) { }

    async handleConnection(client: Socket) {
        // Handle connection
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // Handle disconnection
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, liquidityPairId: string) {
        console.log("client join room")
        client.join(`pair-${liquidityPairId}`);

        // Get last 50 messages for this liquidity pair
        const messages = await this.chatModel.find({ liquidityPair: liquidityPairId })
            .sort({ loveCount: -1, timestamp: -1 })
            .limit(100)
            .populate('children')
            .exec();

        client.emit('previousMessages', messages);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, liquidityPairId: string) {
        client.leave(`pair-${liquidityPairId}`);
    }

    @SubscribeMessage('postMessage')
    async handlePostMessage(client: Socket, payload: {
        liquidityPairId: string,
        message: string,
        creator: string,
        parentId?: string
    }) {
        const newMessage = new this.chatModel({
            creator: payload.creator,
            message: payload.message,
            liquidityPair: payload.liquidityPairId,
            timestamp: Date.now(),
            loveCount: 0,
            parent: payload.parentId || null
        });

        await newMessage.save();

        // Populate children if this is a parent message
        const populatedMessage = await newMessage.populate('children');

        this.server.to(`pair-${payload.liquidityPairId}`).emit('newMessage', populatedMessage);
    }

    @SubscribeMessage('loveMessage')
    async handleLoveMessage(client: Socket, messageId: string) {
        const message = await this.chatModel.findById(messageId);
        if (message) {
            message.loveCount = (message.loveCount || 0) + 1;
            await message.save();

            this.server.to(`pair-${message.liquidityPair}`).emit('messageLoved', {
                messageId,
                loveCount: message.loveCount
            });
        }
    }
}

