import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

/**
 * Parses JSON strings from query parameters or headers
 * Functions:
 * - Safely parses JSON strings
 * - Handles already-parsed objects (returns as-is)
 * - Provides clear error messages for invalid JSON
 * - Useful for complex query params
 * 
 * Usage: @Query('filter', ParseJsonPipe) filter: FilterDto
 */
@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Invalid JSON format');
    }
  }
}