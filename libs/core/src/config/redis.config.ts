import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  };
});
