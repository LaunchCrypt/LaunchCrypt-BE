import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Trade } from "../schemas/trade.schema"

@WebSocketGateway({
    namespace: '/trade',
    cors: {
        origin: '*',
        transports: ['websocket', 'polling'],
    },
})

export class TradeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    constructor(@InjectModel(Trade.name) private tradeModel: Model<Trade>) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('trade:joinRoom')
    async handleJoinRoom(client: Socket, data: { liquidityPairId: string, tokenId: string }) {
        console.log('client join trade room')
        client.join(`pair-${data.liquidityPairId}`);
        console.log('tokenId', data.tokenId)
        const trade = await this.tradeModel.find({ tokenId: data.tokenId })
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();

        client.emit('previousTrades', trade);
    }

    @SubscribeMessage('trade:leaveRoom')
    handleLeaveRoom(client: Socket, liquidityPairId: string) {
        console.log('client leave trade room')
        client.leave(`pair-${liquidityPairId}`);
    }

    emitNewTrade(liquidityPairId: string, trade: Trade) {
        this.server.to(`pair-${liquidityPairId}`).emit('newTrade', trade);
    }

}