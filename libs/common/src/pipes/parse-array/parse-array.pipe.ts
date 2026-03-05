import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

/**
 * Parses and validates array query parameters
 * Functions:
 * - Converts comma-separated strings to arrays
 * - Handles both string and array inputs
 * - Validates array items if validator function provided
 * - Useful for query params like ?tags=tag1,tag2,tag3
 * 
 * Usage: @Query('tags', ParseArrayPipe) tags: string[]
 */
@Injectable()
export class ParseArrayPipe implements PipeTransform {
  constructor(
    private readonly separator: string = ',',
    private readonly itemValidator?: (item: string) => boolean,
  ) {}

  transform(value: any): string[] {
    if (!value) {
      return [];
    }

    let array: string[];

    if (typeof value === 'string') {
      array = value.split(this.separator).map((item) => item.trim());
    } else if (Array.isArray(value)) {
      array = value;
    } else {
      throw new BadRequestException('Value must be a string or array');
    }

    // Validate items if validator provided
    if (this.itemValidator) {
      const invalidItems = array.filter((item) => !this.itemValidator(item));
      if (invalidItems.length > 0) {
        throw new BadRequestException(
          `Invalid array items: ${invalidItems.join(', ')}`,
        );
      }
    }

    return array;
  }
}