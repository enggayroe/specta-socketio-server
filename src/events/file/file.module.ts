import { Module } from '@nestjs/common';
import { FileGateway } from './file.gateway';
import { UtilService } from 'src/shared/util/util.service';

@Module({
    imports: [],
    providers: [FileGateway, UtilService]
})
export class FileModule {}
