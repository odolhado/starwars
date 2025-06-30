import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class CharacterDto {
  @ApiProperty({
    description: 'The name of the character',
    example: 'Luke Skywalker',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Episodes the character appears in',
    example: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  episodes: string[];

  @ApiPropertyOptional({
    description: 'The home planet of the character',
    example: 'Alderaan',
  })
  @IsOptional()
  @IsString()
  planet?: string;
}
