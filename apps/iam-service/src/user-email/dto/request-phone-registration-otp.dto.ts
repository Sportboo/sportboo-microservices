import {
  IsEmail,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class RequestPhoneRegistrationOtp {

  @ApiProperty()
  @IsEmail({}, {
    message: 'email:Invalid email provided'
  })
  email: string;z

  @ApiProperty()
  @Length(4, 16, {
    message: 'phone:Phone number should be between 8 to 20 digits',
  })
  @Matches(/^\+\d+$/, { message: 'phone:Phone number must start with + and contain only digits' })
  phone: string;
}
