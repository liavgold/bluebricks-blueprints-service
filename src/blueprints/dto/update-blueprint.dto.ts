import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateBlueprintDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEmail()
  @IsOptional()
  author?: string;

  @IsOptional()
  blueprint_data?: any;
}