import { registerAs } from '@nestjs/config';

export default registerAs('iamServiceGrpc', () => {
  return {
    host: process.env.IAM_GRPC_HOST,
    port: parseInt(process.env.IAM_GRPC_PORT ?? '50001', 10),
    url: process.env.IAM_GRPC_URL,
  };
});
