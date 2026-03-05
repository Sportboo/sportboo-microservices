export class FileValidationRules {
  required?: boolean;
  maxSize?: number; // in bytes
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}