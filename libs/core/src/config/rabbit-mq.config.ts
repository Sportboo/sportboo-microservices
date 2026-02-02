import { registerAs } from '@nestjs/config';

export default registerAs('rabbitMq', () => {
  return {
    host: process.env.RABBITMQ_HOST,
  url: process.env.RABBITMQ_URL,
    port: parseInt(process.env.RABBITMQ_PORT ?? '5672', 10),
  };
});