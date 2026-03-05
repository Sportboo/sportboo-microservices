import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * DTO representing the location details of a patient.
 */
export class LocationDto {
  /** The full country name. */
  @ApiProperty({ description: 'The full country name', example: 'Nigeria', type: String })
  @IsString()
  @IsNotEmpty()
  readonly country: string;

  /** The short country code (e.g., NG). */
  @ApiProperty({ description: 'Short country code', example: 'NG', type: String })
  @IsString()
  @IsNotEmpty()
  readonly shortCountry: string;

  /** The full state name. */
  @ApiProperty({ description: 'The full state name', example: 'Lagos', type: String })
  @IsString()
  @IsNotEmpty()
  readonly state: string;

  /** The short state code or abbreviation. */
  @ApiProperty({ description: 'Short state code', example: 'LA', type: String })
  @IsString()
  @IsNotEmpty()
  readonly shortState: string;

  /** The full city name. */
  @ApiProperty({ description: 'The full city name', example: 'Ikeja', type: String })
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  /** The short city code or abbreviation. */
  @ApiProperty({ description: 'Short city code', example: 'IKJ', type: String })
  @IsString()
  @IsNotEmpty()
  readonly shortCity: string;

  /** The full address string. */
  @ApiProperty({ description: 'Full address string', example: '12 Allen Avenue, Ikeja', type: String })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  /** The latitude coordinate as a string. */
  @ApiProperty({ description: 'Latitude coordinate', example: '6.6018', type: String })
  @IsString()
  @IsNotEmpty()
  readonly latitude: string;

  /** The longitude coordinate as a string. */
  @ApiProperty({ description: 'Longitude coordinate', example: '3.3515', type: String })
  @IsString()
  @IsNotEmpty()
  readonly longitude: string;

  /** The Google Maps or Place API identifier. */
  @ApiProperty({ description: 'Google Maps or Place API identifier', example: 'ChIJb8Jg9pYAOxARy9nDZ6zE-4w', type: String })
  @IsString()
  @IsNotEmpty()
  readonly placeId: string;

  /** The formatted address returned by the map service. */
  @ApiProperty({ description: 'Formatted address returned by the map service', example: '12 Allen Ave, Ikeja, Lagos, Nigeria', type: String })
  @IsString()
  @IsNotEmpty()
  readonly formattedAddress: string;
}