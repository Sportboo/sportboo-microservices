import {
  IsString,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationDto {
  @ApiProperty()
  @IsString()
  @Length(4, 30, {
     message: 'fullname:Fullname should contain between 4 and 30 characters'
  })
  @Matches(/^\D*$/, {
    message: 'fullname:Fullname should not contain numbers'
  })
  fullname: string;

  @ApiProperty()
  @Length(4, 16)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username:Username should contain a-z, A-Z, 0-9 and _ only'
  })
  username: string;

  @ApiProperty()
  @IsEmail({}, {
    message: 'email:Invalid email provided'
  })
  email: string;

  @ApiProperty()
  @Length(8, 20, {
    message: 'password:Password should contain between 8 and 20 characters'
 })
  password: string;

}
