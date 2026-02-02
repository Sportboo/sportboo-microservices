import { IsNumber, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPhoneRegistrationDto {
  @ApiProperty()
  @Length(4, 16, {
    message: 'phone:Phone number should be between 8 to 20 digits',
  })
  @Matches(/^\+\d+$/, { message: 'phone:Phone number must start with + and contain only digits' })
  phone: string;

  @ApiProperty()
  @IsNumber({}, {
    message: 'userId:UserId should contain numbers only'
 })
  userId: number;

}
