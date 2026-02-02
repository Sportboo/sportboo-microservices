import { IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { OtpTransporter } from './forget-password.dto';


export class ForgetPasswordVerifyDto {

  @ApiProperty()
  @IsNumber({}, {
    message: 'userId:UserId should contain numbers only'
 })
  userId: number;

  @ApiProperty()
  @IsString()
  @Length(4, 4, {
    message: 'otp:Otp should contain exactly 4 characters'
 })
  otp: string;

    @ApiProperty({ enum: OtpTransporter })
    @IsEnum(OtpTransporter, {
      message: 'otpTransporter:OtpTransporter must be either "email" or "phone"',
    })
    otpTransporter: OtpTransporter;
  
}
