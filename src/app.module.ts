import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TransferModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
