import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnviromentVariables {
  @IsString()
  @IsNotEmpty()
  public DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  public DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public DB_HOST: string;

  @IsNumberString()
  @IsNotEmpty()
  public DB_PORT: string;

  @IsNumberString()
  @IsNotEmpty()
  public APP_PORT: string;
}

export function validate(config: Record<string, unknown>) {
  const validateConfig = plainToInstance(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
}
