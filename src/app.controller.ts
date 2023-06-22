import { Controller, Get, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoginGateway } from './events/login/login.gateway';

@Controller('specta')
export class AppController implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly _loginGateway: LoginGateway,
  ) { }

  onModuleInit() { 
    this.logger.debug('onModuleInit...');
  }

  onModuleDestroy() { 
  }

  @Get('login/user')
  async loginUser(): Promise<string> {
    // this.logger.debug(`LOGIN_ID: ${this._loginGateway.getId()}`);
    const sockets = await this._loginGateway.server.fetchSockets();
    const results = [
      ...sockets?.map((x) => ({
        socketId: x?.id,
        ...x?.data,
      })),
    ];
    return `<pre>${JSON.stringify(results, null, 2)}</pre>`;
  }

}
