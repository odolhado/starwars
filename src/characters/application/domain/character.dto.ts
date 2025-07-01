import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsUUID } from 'class-validator';

export class CharacterNewDto {
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


export class CharacterDto extends CharacterNewDto {
  @ApiProperty({
    description: 'Unique identifier for the character',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4)
  id?: string;
}

