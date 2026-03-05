import { IsString, IsEmail, Length, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {

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
