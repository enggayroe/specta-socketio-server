import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LOGIN_EVENT } from 'src/shared/enums/login-event.enum';
import { UtilService } from 'src/shared/util/util.service';
import { FileGateway } from '../file/file.gateway';

@WebSocketGateway({
  // cors: true,
  namespace: 'login',
  transports: ['websocket'],
  // path: '/login'
})
export class LoginGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(FileGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly _utilService: UtilService,
  ) {
  }

  afterInit(server: any) {
    this.logger.debug('afterInit...');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`handleConnection... ${client?.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`handleDisconnect... ${client?.id}`);
  }

  userList$ = async () => {
    const sockets = await this.server.fetchSockets();
    const users = [
      ...sockets?.map((x) => ({
        socketId: x?.id,
        ...x?.data,
      })),
    ];
    return users;
  }

  @SubscribeMessage(LOGIN_EVENT.USER_ADD)
  async handleEventUserAdd(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(data);
    if (!dataParse?.username) return;

    this.logger.debug('LOGIN_EVENT.USER_ADD...');
    const res = { ...this._utilService.safelyParseJSON(data) };

    const userLogin: any = {
      socketId: client.id,
      username: `${res?.username}`,
      role: `${res?.role}`,
    };

    // const sockets = await this.server.fetchSockets();
    // const users = [
    //   ...sockets?.map((x) => ({
    //     socketId: x?.id,
    //     ...x?.data,
    //   })),
    // ];
    const users = [...await this.userList$()]
    console.log(`userList: `, users)

    const isExsist = users.find((x: any) => `${x?.username}`.toLowerCase() === `${userLogin?.username}`.toLowerCase()) ? true : false;

    if (!isExsist) {
      client.data = { ...userLogin };
    } else {
      client.emit(
        LOGIN_EVENT.FORCE_LOGOUT,
        JSON.stringify({
          key: LOGIN_EVENT.FORCE_LOGOUT,
          value: userLogin?.username,
        }),
      );
    }
    console.log(`client.data: `, client.data)
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(`message: `, payload);
    return 'Hello world!';
  }

  @SubscribeMessage(LOGIN_EVENT.FILE_NOTIF)
  async handleEventFileUpload(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(data);
    if (!dataParse?.key) return;
    const model: { key: string; value: any } = {
      ...dataParse,
    };
    this.logger.debug('LOGIN_EVENT.FILE_NOTIF...');

    switch (model.key) {
      case LOGIN_EVENT.FILE_UPLOAD:
        const users = [...await this.userList$()];
        console.log(`userList: `, users);
        const userFile = users.find((x: any) => `${x?.username}`.toLowerCase() === `engine_app`.toLowerCase());
        console.log(`userFile: `, userFile);
        if (!!userFile) {
          console.log(`model: `, model);
          const data = JSON.stringify({
            key: LOGIN_EVENT.FILE_UPLOAD,
            value: {
              user: { ...userFile },
              file: { ...model?.value },
              timestamp: Date.now()
            },
          });
          console.log(`userFile?.socketId: `, userFile?.socketId);
          // this.server.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF`, data);
          client.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF`, data);
          // client.emit(`FILE_NOTIF`, data);
          console.log(`timestamp: `, Date.now());
        }

        client.emit(
          'CONTOH',
          JSON.stringify({
            key: '123',
            value: 'value',
          }),
        );

        break;
    }
  }

  @SubscribeMessage(LOGIN_EVENT.FILE_NOTIF2)
  async handleEventFileUpload2(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(data);
    if (!dataParse?.key) return;
    const model: { key: string; value: any } = {
      ...dataParse,
    };
    this.logger.debug('LOGIN_EVENT.FILE_NOTIF2...');
    switch (model.key) {
      case LOGIN_EVENT.FILE_UPLOAD:
        const users = [...await this.userList$()];
        console.log(`userList: `, users);
        const userFile = users.find((x: any) => `${x?.username}`.toLowerCase() === `engine_app`.toLowerCase());
        console.log(`userFile: `, userFile);
        if (!!userFile) {
          console.log(`model: `, model);
          const data = JSON.stringify({
            key: LOGIN_EVENT.FILE_UPLOAD,
            value: {
              user: { ...userFile },
              file: { ...model?.value },
              timestamp: Date.now()
            },
          });
          console.log(`userFile?.socketId: `, userFile?.socketId);
          // this.server.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF`, data);
          client.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF2`, data);
          // client.emit(`FILE_NOTIF`, data);
          console.log(`timestamp: `, Date.now());
        }

        // client.emit(
        //   'CONTOH',
        //   JSON.stringify({
        //     key: '123',
        //     value: 'value',
        //   }),
        // );

        break;
    }
  }

  @SubscribeMessage(LOGIN_EVENT.ENGINE_FILE_NOTIF)
  async handleEventEngineFileNotif(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(payload);
    if (!dataParse?.key) return;
    const model: { key: string; value: any } = {
      ...dataParse,
    };
    console.log(`model: `, model);
    this.logger.debug('LOGIN_EVENT.ENGINE_FILE_NOTIF...');

    const users = [...await this.userList$()];
    console.log(`userList: `, users);
    const username = model?.value?.username;
    const user = users.find((x: any) => `${x?.username}`.toLowerCase() === username?.toLowerCase());
    console.log(`user: `, user);
    const data = JSON.stringify({
      key: model?.key,
      value: {
        ...model?.value,
        // timestamp: new Date().getTime()
      },
    });
    console.log(`data: `, data);
    client.to(`${user?.socketId}`?.toString()).emit(LOGIN_EVENT.FILE_NOTIF, data);

    // switch (model.key) {
    //   case LOGIN_EVENT.FILE_UPLOAD:
    //     const users = [...await this.userList$()];
    //     console.log(`userList: `, users);
    //     const userFile = users.find((x: any) => `${x?.username}`.toLowerCase() === `engine_app`.toLowerCase());
    //     console.log(`userFile: `, userFile);
    //     if (!!userFile) {
    //       console.log(`model: `, model);
    //       const data = JSON.stringify({
    //         key: LOGIN_EVENT.FILE_UPLOAD,
    //         value: {
    //           user: { ...userFile },
    //           file: { ...model?.value },
    //           timestamp: Date.now()
    //         },
    //       });
    //       console.log(`userFile?.socketId: `, userFile?.socketId);
    //       // this.server.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF`, data);
    //       client.to(`${userFile?.socketId}`?.toString()).emit(`FILE_NOTIF`, data);
    //       // client.emit(`FILE_NOTIF`, data);
    //       console.log(`timestamp: `, Date.now());
    //     }

    //     break;
    // }
  }

  @SubscribeMessage(LOGIN_EVENT.ENGINE_FILE_NOTIF2)
  async handleEventEngineFileNotif2(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(payload);
    if (!dataParse?.key) return;
    const model: { key: string; value: any } = {
      ...dataParse,
    };
    console.log(`ENGINE_FILE_NOTIF2 model: `, model);
    this.logger.debug('LOGIN_EVENT.ENGINE_FILE_NOTIF2...');

    const users = [...await this.userList$()];
    console.log(`users: `, users);
    const username = model?.value?.file?.username;
    const userList = users.filter((x: any) => `${x?.username}`.toLowerCase() === username?.toLowerCase());
    console.log(`userList: `, userList);
    [...userList]?.forEach((item, index) => {
      console.log(`item: `, item);
      client.to(`${item?.socketId}`?.toString()).emit(`FILE_NOTIF`, model);
    });
    // this.server.to(`${user?.socketId}`?.toString()).emit(LOGIN_EVENT.FILE_NOTIF2, model);
  }

  @SubscribeMessage(LOGIN_EVENT.USER_ADD_MULTIPLE)
  async handleEventUserAddMultiple(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const dataParse = this._utilService.safelyParseJSON(data);
    if (!dataParse?.username) return;

    this.logger.debug('LOGIN_EVENT.USER_ADD_MULTIPLE...');
    const res = { ...this._utilService.safelyParseJSON(data) };

    const userLogin: any = {
      socketId: client.id,
      username: `${res?.username}`,
      role: `${res?.role}`,
    };

    // const sockets = await this.server.fetchSockets();
    // const users = [
    //   ...sockets?.map((x) => ({
    //     socketId: x?.id,
    //     ...x?.data,
    //   })),
    // ];
    const users = [...await this.userList$()]
    console.log(`userList: `, users)

    // const isExsist = users.find((x: any) => `${x?.username}`.toLowerCase() === `${userLogin?.username}`.toLowerCase()) ? true : false;

    // if (!isExsist) {
    client.data = { ...userLogin };
    // } else {
    //   client.emit(
    //     LOGIN_EVENT.FORCE_LOGOUT,
    //     JSON.stringify({
    //       key: LOGIN_EVENT.FORCE_LOGOUT,
    //       value: userLogin?.username,
    //     }),
    //   );
    // }
    console.log(`client.data: `, client.data)
  }
}
