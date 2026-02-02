import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggingExtension } from './prisma-extensions';
import { PrismaClient } from 'apps/iam-service/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {
      super();
      const extendedClient = new PrismaClient().$extends(LoggingExtension);
      Object.assign(this, extendedClient);
    }
  
    async onModuleInit() {
      // await this.$connect();
  
      let isConnected = false;
      let retries = 0;
  
      while (!isConnected && retries < 5) {
        try {
          await this.$connect();
          isConnected = true;
        } catch (error) {
          console.log(`Connection Error: Retrying:${retries} ......`);
          retries++;
        }
      }
    }
  
    async onModuleDestroy() {
      await this.$disconnect();
    }
    
  }
  