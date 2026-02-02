import { IsString, IsEmail, IsBoolean, Length, Matches, isValidationOptions } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class UserLoginDto {

  @ApiProperty()
  @IsEmail({}, {
    message: 'email: Invalid email'
  })
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 20, {
    message: 'password: Password should contain between 8 and 20 characters'
  })
  password: string;
  
}