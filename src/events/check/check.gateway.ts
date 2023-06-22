import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CHECK_EVENT } from 'src/shared/enums/check-event.enum';
import { UtilService } from 'src/shared/util/util.service';
import { LoginGateway } from '../login/login.gateway';

@WebSocketGateway({
  // cors: true,
  namespace: 'check',
  transports: ['websocket'],
  // path: '/check'
})
export class CheckGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CheckGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly _utilService: UtilService,
    private readonly _loginGateway: LoginGateway,
  ) { }
  afterInit(server: any) {
  }
  handleConnection(client: any, ...args: any[]) {
  }
  handleDisconnect(client: any) {
  }

  @SubscribeMessage(CHECK_EVENT.IS_USERNAME_EXIST)
  async handleIsUsernameExist(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // console.log(`(/check)-(handleIsUsernameExist)-(data): `, data);
    this.logger.log(`(handleIsUsernameExist)-(data): ${data}`);
    const headers: any = { ...client?.conn?.request?.headers };
    // console.log(`(/check)-(handleIsUsernameExist)-(headers): `, headers);
    const ip = headers.hasOwnProperty('client-ip') ? headers['client-ip'] : '';
    console.log(`(/check)-(handleIsUsernameExist)-(ip): `, ip);

    const sockets = await this._loginGateway.server.fetchSockets();
    // console.log(`(/login)-(handleUserAdd)-(sockets): `, sockets);
    const users = [
      ...sockets?.map((x) => ({
        socketId: x?.id,
        ...x?.data,
      })),
    ];
    console.log(`(/check)-(handleUserAdd)-(users): `, users);
    const resp = {
      isLogin: users?.find(
        (x: any) =>
          `${x?.username}`?.toLowerCase() === `${data}`?.toLowerCase(),
      )
        ? true
        : false,
      ipAddress: ip.replace(/::ffff:/gi, ''),
    };

    console.log(`(/check)-(handleUserAdd)-(resp): `, resp);
    console.log(`(/check)-(handleIsUsernameExist)-(resp): `, resp);

    client.emit(CHECK_EVENT.IS_USERNAME_EXIST, resp);
  }

  @SubscribeMessage(CHECK_EVENT.IS_USERNAME_EXIST_MULTIPLE)
  async handleIsUsernameExistMultiple(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // console.log(`(/check)-(handleIsUsernameExist)-(data): `, data);
    this.logger.log(`(handleIsUsernameExist)-(data): ${data}`);
    const headers: any = { ...client?.conn?.request?.headers };
    // console.log(`(/check)-(handleIsUsernameExist)-(headers): `, headers);
    const ip = headers.hasOwnProperty('client-ip') ? headers['client-ip'] : '';
    console.log(`(/check)-(handleIsUsernameExist)-(ip): `, ip);

    const sockets = await this._loginGateway.server.fetchSockets();
    // console.log(`(/login)-(handleUserAdd)-(sockets): `, sockets);
    const users = [
      ...sockets?.map((x) => ({
        socketId: x?.id,
        ...x?.data,
      })),
    ];
    console.log(`(/check)-(handleUserAdd)-(users): `, users);
    const resp = {
      isLogin: users?.find(
        (x: any) =>
          `${x?.username}`?.toLowerCase() === `${data}`?.toLowerCase(),
      )
        ? false
        : false,
      ipAddress: ip.replace(/::ffff:/gi, ''),
    };

    console.log(`(/check)-(handleUserAdd)-(resp): `, resp);
    console.log(`(/check)-(handleIsUsernameExist)-(resp): `, resp);

    client.emit(CHECK_EVENT.IS_USERNAME_EXIST, resp);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
