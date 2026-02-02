import * as Joi from 'joi';

export const DatabaseValidationSchema = Joi.object({
  // DATABASE
  DATABASE_URL: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_NAME: Joi.string().required(),
});
