import {
  ArgumentMetadata,
  ValidationPipe as NestValidationPipe,
  PipeTransform,
} from '@nestjs/common';

/**
 * Custom validation pipe with pre-configured options
 * Functions:
 * - Validates incoming DTOs using class-validator decorators
 * - Strips non-whitelisted properties from request body
 * - Transforms payload to DTO instance
 * - Automatically converts primitive types (strings to numbers, etc.)
 * - Provides detailed validation error messages
 */
export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, // Strip props that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted props exist
      transform: true, // Transform payload to DTO instance
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert types (string to number, etc.)
      },
      disableErrorMessages: false, // Show validation errors
      validationError: {
        target: true, // Don't expose the target object in errors
        value: true, // Don't expose the value that failed validation
      },
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {

    if (!metadata.metatype || !value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return super.transform(value, metadata);
    }

    // Parse JSON string fields
    Object.keys(value).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const val = value[key];

      // TODO: probaly restrict these to only certain dtos
      if (val === 'true') value[key] = true;
      if (val === 'false') value[key] = false;

      // handle json string
      if (
        typeof val === 'string' &&
        ((val.startsWith('[') && val.endsWith(']')) ||
          (val.startsWith('{') && val.endsWith('}')))
      ) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value[key] = JSON.parse(val);
        } catch (e) {
          // Keep original value if parse fails
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super.transform(value, metadata);
    // return plainToClass(metadata.metatype, value);
  }
}
