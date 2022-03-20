import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SerpapiService } from './serpapi/serpapi.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AppController],
  providers: [SerpapiService],
})
export class AppModule {}
