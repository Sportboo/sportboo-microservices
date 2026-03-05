import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailOtpDto {

  @ApiProperty()
  @IsString()
  @Length(4, 4, {
    message: 'otp:Otp should contain exactly 4 characters'
 })
  otp: string;

  @ApiProperty()
  @IsNumber({}, {
    message: 'userId:UserId should contain numbers only'
 })
  userId: number;
}
