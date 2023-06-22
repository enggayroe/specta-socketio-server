import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UtilService } from 'src/shared/util/util.service';


@WebSocketGateway({
  // cors: true,
  namespace: 'file',
  transports: ['websocket'],
  // path: '/check'
})
export class FileGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  private readonly logger = new Logger(FileGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly _utilService: UtilService,
  ) {}
  
  afterInit(server: any) {
    
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.debug('handleConnection...');
    this.logger.log('new user connected...');
    this.logger.debug(
      `${client.id}(${client.handshake.query['username']}) is connected!`,
    );
  }
  handleDisconnect(client: any) {
    this.logger.debug('handleDisconnect...');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
