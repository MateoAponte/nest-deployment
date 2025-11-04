import * as Joi from 'joi';

// Lineamientos
export default Joi.object({
  DB_SYNCHRONIZE: Joi.string().optional().default(false),
  DB_LOAD_ENTITIES: Joi.boolean().optional().default(false),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().optional().default(5432),
  DB_DATABASE: Joi.string().required(),
  DB_URL: Joi.string().optional(),
  DB_SSL_MODE: Joi.boolean().optional().default(false),
  REDIS_URL: Joi.string().required(),
  ENABLE_WORKER: Joi.boolean().optional().default(false),
});
