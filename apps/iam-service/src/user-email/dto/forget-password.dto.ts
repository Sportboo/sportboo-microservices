import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class ForgetPasswordDto {

  @ApiProperty()
  @IsNumber({}, {
    message: 'userId:UserId should contain numbers only'
 })
  userId: number;

  @ApiProperty()
  @Length(8, 20, {
    message: 'password:Password should contain between 8 and 20 characters'
 })
  password: string;
}
