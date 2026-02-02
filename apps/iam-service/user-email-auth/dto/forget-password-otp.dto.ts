import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordOtpDto {

  @ApiProperty()
  @IsOptional()
  @IsEmail({}, {
    message: 'email: Invalid email'
  })
  email: string;
  
  @ApiProperty()
  @IsOptional()
  @Length(4, 16, {
    message: 'phone:Phone number should be between 8 to 20 digits',
  })
  @Matches(/^\+\d+$/, { message: 'phone:Phone number must start with + and contain only digits' })
  phone: string;

}
