import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBlueprintDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsEmail()
  @IsNotEmpty()
  author!: string;

  @IsNotEmpty()
  blueprint_data!: any;
}