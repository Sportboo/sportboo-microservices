import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


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
  
}
