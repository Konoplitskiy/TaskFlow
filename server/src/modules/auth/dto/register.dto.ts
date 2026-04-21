import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(3,30)
    name: string;

    @IsEmail()
    email:string

    @IsString()
    @Length(6,120,{message:'Password must be min 6 symbol and max symbol 120'})
    password:string
}