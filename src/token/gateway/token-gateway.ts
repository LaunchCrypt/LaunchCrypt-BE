import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import * as WebSocket from 'ws';

@WebSocketGateway({ cors: { origin: '*' } })
export class TokenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private binanceWs: WebSocket
  private latestPrice: number;

  afterInit(server: Server) {
    this.connectToBinance();
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('realtimePrice')
  handleRealtimePrice(client: Socket) {
    console.log('Received realtimePrice event from client:', client.id);

    // emit message for a single client (the one who send message)
    client.emit('reply', { price: 1000 });

    // emit message for all clients
    this.server.emit('reply', { price: 1000 });
  }

  private connectToBinance() {
    this.binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    this.binanceWs.on('message', (data: WebSocket.Data) => {
      const trade = JSON.parse(data.toString());
      this.latestPrice = parseFloat(trade.p);
    });

    this.binanceWs.on('close', () => {
      console.log('Disconnected from Binance WebSocket');
      setTimeout(() => this.connectToBinance(), 5000);
    });

    this.binanceWs.on('error', (error) => {
      console.error('Binance WebSocket error:', error);
    });

    setInterval(() => {
      if (this.latestPrice) {
        this.server.emit('btcPrice', {
          price: this.latestPrice,
        });
      }
    }, 3000); // 3 seconds interval
  }
}