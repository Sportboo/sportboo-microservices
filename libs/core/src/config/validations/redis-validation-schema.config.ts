import * as Joi from 'joi';

export const RedisValidationSchema = Joi.object({
  REDIS_DATABASE_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string(),
  REDIS_USERNAME: Joi.string(),
  REDIS_PORT: Joi.string().required(),
});
