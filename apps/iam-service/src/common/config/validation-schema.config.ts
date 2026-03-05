import {
  DatabaseValidationSchema,
  IamGrpcValidationSchema,
  RabbitMqValidationSchema,
  RedisValidationSchema,
} from '@app/core';
import * as Joi from 'joi';

export const ValidationSchema = DatabaseValidationSchema
  .concat(IamGrpcValidationSchema)
  .concat(RabbitMqValidationSchema)
  .concat(RedisValidationSchema)
  .concat(
    Joi.object({
      // App
      PORT: Joi.number().default(3001),
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

      // JWT
      JWT_SECRET: Joi.string().required(),
      JWT_REFRESH_SECRET: Joi.string().required(),
      JWT_TOKEN_AUDIENCE: Joi.string().required(),
      JWT_TOKEN_ISSUER: Joi.string().required(),
      JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
      JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
    }),
  );
