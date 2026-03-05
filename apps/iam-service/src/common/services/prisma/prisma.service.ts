import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from 'apps/iam-service/generated/prisma/client';
import databaseConfig from '../../config/database.config';
import type DatabaseConfigType from '../../config/database.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

   private readonly logger = new Logger(PrismaService.name);
   
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly databaseConfiguration: ConfigType<typeof DatabaseConfigType>,
  ) {
    const pool = new Pool({
      connectionString: databaseConfiguration.url,
      ...(process.env.NODE_ENV === 'production'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {}),
      connectionTimeoutMillis: 10000,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
    const extendedClient = new PrismaClient({ adapter })
    // .$extends(AggregationExtension);
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
        this.logger.log(`Connection Error: Retrying:${retries} ......`);
        retries++;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}