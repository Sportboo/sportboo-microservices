import { Module } from '@nestjs/common';
import {LoggerModule as PinnoLoggerModule} from 'nestjs-pino'

@Module({
    imports: [
        PinnoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          }
        }
      }
    })
    ]
})
export class LoggerModule {}
