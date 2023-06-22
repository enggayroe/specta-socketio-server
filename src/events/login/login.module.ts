import { Module } from '@nestjs/common';
import { LoginGateway } from './login.gateway';
import { UtilService } from 'src/shared/util/util.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [SharedModule],
    providers: [LoginGateway],
    exports: [LoginGateway]
})
export class LoginModule {}
