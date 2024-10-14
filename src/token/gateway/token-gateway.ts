import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway(3000,{})
export class TokenGateway {
    @SubscribeMessage('realtimePrice')
    handleRealtimePrice(client: Socket) {
        console.log('Received realtimePrice event from client:', client.id);
        client.emit('reply', { price: 1000 });
    }
}