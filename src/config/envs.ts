import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  RMQ_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    RMQ_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const validationSchema = envsSchema.validate({
  ...process.env,
  RMQ_SERVERS: process.env.RMQ_SERVERS?.split(','),
});
const error: joi.ValidationError | undefined = validationSchema.error;
const value: EnvVars = validationSchema.value as EnvVars;
if (error) {
  throw new Error('Config Validation error: ' + error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  rmq_servers: envVars.RMQ_SERVERS,
};
