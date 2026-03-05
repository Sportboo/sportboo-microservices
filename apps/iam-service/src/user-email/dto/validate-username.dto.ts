import { Length, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ValidateUsernameDto {

  @ApiProperty()
  @Length(4, 16)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username:Username should contain a-z, A-Z, 0-9 and _ only'
  })
  username: string;

}
