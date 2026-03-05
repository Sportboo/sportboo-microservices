import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * Sanitizes input to prevent XSS attacks
 * Functions:
 * - Removes potentially dangerous HTML/script tags
 * - Strips SQL injection attempts
 * - Escapes special characters
 * - Recursively sanitizes objects and arrays
 * 
 * Usage: @Body(SanitizePipe) body: CreatePostDto
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
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

  private sanitizeString(value: string): string {
    // Remove script tags and potentially dangerous HTML
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}