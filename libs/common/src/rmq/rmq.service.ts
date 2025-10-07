/** biome-ignore-all lint/style/useImportType: Biome me estaba trolleando */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, type RmqOptions, Transport } from '@nestjs/microservices';
import type { Channel, Message } from 'amqplib';

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
        noAck, // Reconocer manualmente que hemos aceptado el mensaje
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message | undefined;
    if (!originalMessage) {
      return;
    }
    channel.ack(originalMessage);
  }
}
