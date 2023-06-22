import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './events/login/login.module';
import { CheckModule } from './events/check/check.module';
import { FileModule } from './events/file/file.module';

@Module({
  imports: [
    CheckModule, 
    LoginModule, 
    FileModule,
    SharedModule, 
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
