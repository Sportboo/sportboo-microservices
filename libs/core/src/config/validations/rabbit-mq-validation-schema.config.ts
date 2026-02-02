import * as Joi from 'joi';

export const RabbitMqValidationSchema = Joi.object({
  // RABBIT MQ
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().default(5672),
  RABBITMQ_URL: Joi.string().required(),
  
});
