import {IsEmail, IsString} from "class-validator";

export class UserLoginDto {
    @IsEmail({}, { message: 'Is not email'})
    email: string;
    @IsString( { message: 'Is not string'})
    password: string;
}