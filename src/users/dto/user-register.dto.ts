import {IsEmail, IsString} from "class-validator";

export class UserRegisterDto {
    @IsEmail({}, { message: 'Is not email'})
    email: string;

    @IsString( { message: 'Is not string'})
    password: string;

    @IsString( { message: 'Is not string'})
    name: string;
}