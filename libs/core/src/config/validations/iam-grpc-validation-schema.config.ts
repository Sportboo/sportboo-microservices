import * as Joi from 'joi';

export const IamGrpcValidationSchema = Joi.object({
  IAM_GRPC_HOST: Joi.string().required(),
  IAM_GRPC_PORT: Joi.number().default(50001),
  IAM_GRPC_URL: Joi.string().required(),
});