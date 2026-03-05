import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResidentialAddressDto {
    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    postCode: string;
    

}