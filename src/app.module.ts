import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './config/envs';

@Module({
  imports: [
    TransferModule,
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT,
      username: envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      database: envs.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
