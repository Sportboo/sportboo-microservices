import { IsEmail, } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class RequestEmailRegistrationOtp {

  @ApiProperty()
  @IsEmail({}, {
    message: 'email:Invalid email provided'
  })
  email: string;
  
}