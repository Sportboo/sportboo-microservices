import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * Trims whitespace from string values in request body
 * Functions:
 * - Recursively trims all string values in objects and arrays
 * - Prevents accidental whitespace in user input
 * - Maintains data structure (objects, arrays, nested values)
 * 
 * Usage: @Body(TrimPipe) body: CreateUserDto
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item));
    }

    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = this.transform(value[key]);
        return acc;
      }, {});
    }

    return value;
  }
}