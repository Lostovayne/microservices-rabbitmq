/** biome-ignore-all lint/style/useImportType: Biome me estaba trolleando */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.configService.get<string>('RABBIT_MQ_URI') ??
            'amqp://localhost:5672',
        ],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }
}
