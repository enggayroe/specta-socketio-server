import { Module } from '@nestjs/common';
import { CheckGateway } from './check.gateway';
import { SharedModule } from 'src/shared/shared.module';
import { LoginModule } from '../login/login.module';

@Module({    
    imports: [SharedModule, LoginModule],
    providers: [CheckGateway]
})
export class CheckModule {}
